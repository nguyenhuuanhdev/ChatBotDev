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

    // PWA banner elements (không bắt buộc)
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
                const { outcome } = await deferredPrompt.userChoice;
                deferredPrompt = null;
                if (installBanner) installBanner.style.display = 'none';
            }
        });
    }
    if (dismissBtn) {
        dismissBtn.addEventListener('click', () => {
            if (installBanner) installBanner.style.display = 'none';
        });
    }

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').catch(err => {
            console.log('Service Worker error:', err);
        });
    }

    if ("Notification" in window && Notification.permission === "default" && window.location.protocol === "https:") {
        Notification.requestPermission();
    }

    // Bảo vệ: cần 3 select
    if (!selectMenu || selectMenu.length < 3) {
        console.error('selectMenu thiếu phần tử. Cần 3 <select> trong HTML.');
        return;
    }

    // Populate select options
    (function populate() {
        // hours 12 -> 1
        for (let i = 12; i > 0; i--) {
            const v = i < 10 ? `0${i}` : `${i}`;
            let option = `<option value="${v}">${v}</option>`;
            selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
        }
        // minutes 00 -> 59 (we insert after placeholder so order is 00..59)
        for (let j = 0; j < 60; j++) {
            const v = j < 10 ? `0${j}` : `${j}`;
            let option = `<option value="${v}">${v}</option>`;
            // insert at end of select
            selectMenu[1].insertAdjacentHTML("beforeend", option);
        }
        // AM/PM
        ["AM", "PM"].forEach(a => {
            let option = `<option value="${a}">${a}</option>`;
            selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
        });
    })();

    // Set defaults to current time to avoid prompt
    (function setDefaults() {
        try {
            const now = new Date();
            let h = now.getHours();
            const m = now.getMinutes();
            let ampm = "AM";
            if (h >= 12) { h -= 12; ampm = "PM"; }
            h = h === 0 ? 12 : h;
            const hh = h < 10 ? `0${h}` : `${h}`;
            const mm = m < 10 ? `0${m}` : `${m}`;

            if ([...selectMenu[0].options].some(o => o.value === hh)) selectMenu[0].value = hh;
            if ([...selectMenu[1].options].some(o => o.value === mm)) selectMenu[1].value = mm;
            if ([...selectMenu[2].options].some(o => o.value === ampm)) selectMenu[2].value = ampm;
        } catch (e) {
            console.warn('Không thể set default selects:', e);
        }
    })();

    // Wake lock helpers
    async function requestWakeLock() {
        try {
            if ('wakeLock' in navigator) {
                wakeLock = await navigator.wakeLock.request('screen');
                console.log('Wake Lock đã bật');
                wakeLock.addEventListener('release', () => {
                    console.log('Wake Lock đã tắt');
                    if (isAlarmSet && !alarmTriggered) setTimeout(() => requestWakeLock(), 100);
                });
            }
        } catch (err) {
            console.log('Không thể bật Wake Lock:', err);
        }
    }
    function releaseWakeLock() {
        if (wakeLock !== null) {
            try { wakeLock.release(); } catch (e) { }
            wakeLock = null;
            console.log('Wake Lock đã giải phóng');
        }
    }

    // Clock update and alarm check
    setInterval(() => {
        try {
            const d = new Date();
            let h = d.getHours(), m = d.getMinutes(), s = d.getSeconds(), ampm = "AM";
            if (h >= 12) { h -= 12; ampm = "PM"; }
            h = h === 0 ? 12 : h;
            const hh = h < 10 ? "0" + h : String(h);
            const mm = m < 10 ? "0" + m : String(m);
            const ss = s < 10 ? "0" + s : String(s);
            currentTime.innerText = `${hh}:${mm}:${ss} ${ampm}`;

            if (alarmTime === `${hh}:${mm} ${ampm}` && !alarmTriggered) {
                alarmTriggered = true;
                ringtone.loop = true;
                ringtone.play().catch(e => {
                    console.log('Lỗi phát âm thanh:', e);
                    setTimeout(() => ringtone.play(), 100);
                });
                if ('vibrate' in navigator) {
                    navigator.vibrate([200, 100, 200]);
                    window.vibrateInterval = setInterval(() => navigator.vibrate([200, 100, 200]), 2000);
                }
                if ("Notification" in window && Notification.permission === "granted") {
                    const n = new Notification("⏰ ALARM RINGING!", {
                        body: `Đã đến ${alarmTime}`,
                        icon: "icon-192.png",
                        badge: "icon-192.png",
                        requireInteraction: true,
                        tag: 'alarm-clock'
                    });
                    n.onclick = () => { window.focus(); n.close(); };
                }
                document.title = "🔔 ALARM RINGING! 🔔";
                window.titleBlinkInterval = setInterval(() => {
                    document.title = document.title === "🔔 ALARM RINGING! 🔔" ? "⏰ WAKE UP! ⏰" : "🔔 ALARM RINGING! 🔔";
                }, 500);
            }
        } catch (e) {
            console.error('Lỗi trong setInterval:', e);
        }
    }, 1000);

    // Set/Clear alarm
    async function setAlarm() {
        try {
            if (isAlarmSet) {
                // clear
                alarmTime = "";
                alarmTriggered = false;
                ringtone.pause();
                ringtone.currentTime = 0;
                content.classList.remove('disable');
                setAlarmBtn.innerText = 'Set Alarm';
                document.title = 'Alarm Clock';
                if (window.titleBlinkInterval) clearInterval(window.titleBlinkInterval);
                if (window.vibrateInterval) clearInterval(window.vibrateInterval);
                releaseWakeLock();
                const st = document.getElementById('status');
                if (st) st.innerText = 'Chọn giờ báo thức';
                isAlarmSet = false;
                return;
            }

            // lấy giá trị; nếu placeholder thì lấy option hợp lệ đầu tiên
            const hourVal = (selectMenu[0].value && selectMenu[0].value !== 'Hour') ? selectMenu[0].value : (selectMenu[0].options[1]?.value || '12');
            const minVal = (selectMenu[1].value && selectMenu[1].value !== 'Minute') ? selectMenu[1].value : (selectMenu[1].options[1]?.value || '00');
            const ampmVal = (selectMenu[2].value && selectMenu[2].value !== 'AM/PM') ? selectMenu[2].value : (selectMenu[2].options[1]?.value || 'AM');

            const time = `${hourVal}:${minVal} ${ampmVal}`;

            if ("Notification" in window) {
                if (Notification.permission === "default") {
                    const permission = await Notification.requestPermission();
                    if (permission !== "granted") {
                        alert("⚠️ Hãy cho phép thông báo để alarm hoạt động tốt hơn khi ẩn tab!");
                    }
                } else if (Notification.permission === "denied") {
                    alert("⚠️ Thông báo đã bị chặn! Bật lại từ trình duyệt nếu cần.");
                }
            }

            await requestWakeLock();

            alarmTime = time;
            isAlarmSet = true;
            alarmTriggered = false;
            content.classList.add('disable');
            setAlarmBtn.innerText = 'Clear Alarm';
            const st = document.getElementById('status');
            if (st) st.innerText = `Alarm set for ${alarmTime}`;
        } catch (e) {
            console.error('Lỗi trong setAlarm():', e);
        }
    }

    if (setAlarmBtn) setAlarmBtn.addEventListener('click', setAlarm);
    else console.error('Không tìm thấy nút #setAlarmBtn');

    document.addEventListener('visibilitychange', () => {
        if (document.hidden && isAlarmSet && alarmTriggered) {
            if (ringtone.paused) ringtone.play().catch(e => console.log('Không thể phát âm thanh khi tab ẩn:', e));
        }
    });

    window.addEventListener('pagehide', (e) => {
        if (isAlarmSet && alarmTriggered) e.preventDefault();
    });
});
