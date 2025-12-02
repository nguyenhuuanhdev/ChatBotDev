document.addEventListener('DOMContentLoaded', () => {
    const currentTime = document.querySelector("h1"),
        content = document.querySelector(".content"),
        selectMenu = document.querySelectorAll("select"),
        setAlarmBtn = document.getElementById("setAlarmBtn");

    let alarmTime = "",
        isAlarmSet = false,
        alarmTriggered = false,
        ringtone = new Audio("./files/alarm.mp3"),
        wakeLock = null;

    // --- PWA Install Banner ---
    let deferredPrompt;
    const installBanner = document.getElementById('installBanner');
    const installBtn = document.getElementById('installBtn');
    const dismissBtn = document.getElementById('dismissBtn');

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        if (installBanner) installBanner.style.display = 'block';
    });

    if (installBtn) {
        installBtn.addEventListener('click', async () => {
            if (deferredPrompt) {
                deferredPrompt.prompt();
                await deferredPrompt.userChoice;
                deferredPrompt = null;
                installBanner.style.display = 'none';
            }
        });
    }

    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            installBanner.style.display = 'none';
        });
    }

    // --- Service Worker ---
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('Service Worker error:', err);
        });
    }

    // --- Notification permission ---
    if ("Notification" in window && Notification.permission === "default" && location.protocol === "https:") {
        Notification.requestPermission();
    }

    // --- Check đủ 3 select ---
    if (!selectMenu || selectMenu.length < 3) {
        console.error('HTML thiếu 3 select menu!');
        return;
    }

    // --- Populate hours/minutes/AMPM ---
    (function populate() {
        // Hour
        for (let i = 12; i > 0; i--) {
            const v = i < 10 ? `0${i}` : `${i}`;
            selectMenu[0].insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`);
        }

        // Minute
        for (let i = 0; i < 60; i++) {
            const v = i < 10 ? `0${i}` : `${i}`;
            selectMenu[1].insertAdjacentHTML("beforeend", `<option value="${v}">${v}</option>`);
        }

        // AM / PM
        ["AM", "PM"].forEach(a => {
            selectMenu[2].insertAdjacentHTML("beforeend", `<option value="${a}">${a}</option>`);
        });
    })();

    // --- Wake Lock ---
    async function requestWakeLock() {
        try {
            if ("wakeLock" in navigator) {
                wakeLock = await navigator.wakeLock.request("screen");
                wakeLock.addEventListener("release", () => {
                    if (isAlarmSet && !alarmTriggered) {
                        setTimeout(() => requestWakeLock(), 100);
                    }
                });
            }
        } catch (err) {
            console.log("Không thể bật Wake Lock:", err);
        }
    }

    function releaseWakeLock() {
        if (wakeLock) {
            wakeLock.release().catch(() => { });
            wakeLock = null;
        }
    }

    // --- Update clock + check alarm ---
    setInterval(() => {
        const d = new Date();
        let h = d.getHours(), m = d.getMinutes(), s = d.getSeconds();
        let ampm = "AM";

        if (h >= 12) { h -= 12; ampm = "PM"; }
        if (h === 0) h = 12;

        const hh = h < 10 ? "0" + h : h;
        const mm = m < 10 ? "0" + m : m;
        const ss = s < 10 ? "0" + s : s;

        currentTime.innerText = `${hh}:${mm}:${ss} ${ampm}`;

        if (alarmTime === `${hh}:${mm} ${ampm}` && !alarmTriggered) {
            alarmTriggered = true;

            ringtone.loop = true;
            ringtone.play().catch(() => setTimeout(() => ringtone.play(), 200));

            if ('vibrate' in navigator) {
                navigator.vibrate([200, 100, 200]);
                window.vibrateInterval = setInterval(() => navigator.vibrate([200, 100, 200]), 2000);
            }

            if ("Notification" in window && Notification.permission === "granted") {
                const n = new Notification("⏰ ALARM RINGING!", {
                    body: `Đã đến ${alarmTime}`,
                    icon: "icon-192.png",
                    requireInteraction: true
                });
                n.onclick = () => { window.focus(); n.close(); };
            }

            document.title = "🔔 ALARM RINGING! 🔔";
            window.titleBlink = setInterval(() => {
                document.title = (document.title === "🔔 ALARM RINGING! 🔔")
                    ? "⏰ WAKE UP! ⏰"
                    : "🔔 ALARM RINGING! 🔔";
            }, 500);
        }
    }, 1000);

    // --- Set/Clear Alarm ---
    async function setAlarm() {
        if (isAlarmSet) {
            // CLEAR
            alarmTime = "";
            alarmTriggered = false;

            ringtone.pause();
            ringtone.currentTime = 0;

            if (window.titleBlink) clearInterval(window.titleBlink);
            if (window.vibrateInterval) clearInterval(window.vibrateInterval);

            releaseWakeLock();

            content.classList.remove("disable");
            setAlarmBtn.innerText = "Set Alarm";
            document.title = "Alarm Clock";

            const st = document.getElementById("status");
            if (st) st.innerText = "Chọn giờ báo thức";

            isAlarmSet = false;
            return;
        }

        // Lấy giá trị
        const hour = selectMenu[0].value;
        const minute = selectMenu[1].value;
        const ampm = selectMenu[2].value;

        if (hour === "Hour" || minute === "Minute" || ampm === "AM/PM") {
            alert("⚠️ Chọn giờ, phút và AM/PM trước!");
            return;
        }

        alarmTime = `${hour}:${minute} ${ampm}`;

        await requestWakeLock();

        isAlarmSet = true;
        alarmTriggered = false;

        content.classList.add("disable");
        setAlarmBtn.innerText = "Clear Alarm";

        const st = document.getElementById("status");
        if (st) st.innerText = `Alarm set for ${alarmTime}`;
    }

    setAlarmBtn.addEventListener("click", setAlarm);

    // Tab ẩn vẫn đảm bảo phát chuông
    document.addEventListener("visibilitychange", () => {
        if (document.hidden && isAlarmSet && alarmTriggered && ringtone.paused) {
            ringtone.play().catch(() => { });
        }
    });

    // Ngăn unload khi đang reo
    window.addEventListener("pagehide", (e) => {
        if (isAlarmSet && alarmTriggered) e.preventDefault();
    });
});
