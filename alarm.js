const currentTime = document.querySelector("h1"),
    content = document.querySelector(".content"),
    selectMenu = document.querySelectorAll("select"),
    setAlarmBtn = document.querySelector("button"),
    status = document.getElementById("status"),
    wakeLockStatus = document.getElementById("wakeLockStatus");

let alarmTime, isAlarmSet, alarmTriggered = false,
    ringtone = new Audio("./files/alarm.mp3"),
    wakeLock = null;

// PWA Install
let deferredPrompt;
const installBanner = document.getElementById('installBanner');
const installBtn = document.getElementById('installBtn');
const dismissBtn = document.getElementById('dismissBtn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    installBanner.style.display = 'block';
});

installBtn.addEventListener('click', async () => {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        deferredPrompt = null;
        installBanner.style.display = 'none';
    }
});

dismissBtn.addEventListener('click', () => {
    installBanner.style.display = 'none';
});

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js');
}

// Notification permission
if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
}

// Populate selects
for (let i = 12; i > 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[0].firstElementChild.insertAdjacentHTML("afterend", option);
}
for (let i = 59; i >= 0; i--) {
    i = i < 10 ? `0${i}` : i;
    let option = `<option value="${i}">${i}</option>`;
    selectMenu[1].firstElementChild.insertAdjacentHTML("afterend", option);
}
for (let i = 2; i > 0; i--) {
    let ampm = i == 1 ? "AM" : "PM";
    let option = `<option value="${ampm}">${ampm}</option>`;
    selectMenu[2].firstElementChild.insertAdjacentHTML("afterend", option);
}

// Wake Lock
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLockStatus.textContent = "🔒 Màn hình được giữ sáng";

            wakeLock.addEventListener('release', () => {
                wakeLockStatus.textContent = "";
                if (isAlarmSet && !alarmTriggered) {
                    setTimeout(() => requestWakeLock(), 100);
                }
            });
        }
    } catch (err) {
        console.log('Wake Lock error:', err);
    }
}

function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release();
        wakeLock = null;
        wakeLockStatus.textContent = "";
    }
}

// Badge
function updateBadge(count) {
    if ('setAppBadge' in navigator) {
        if (count > 0) {
            navigator.setAppBadge(count);
        } else {
            navigator.clearAppBadge();
        }
    }
}

// Clock
setInterval(() => {
    let date = new Date(),
        h = date.getHours(),
        m = date.getMinutes(),
        s = date.getSeconds(),
        ampm = "AM";

    if (h >= 12) {
        h = h - 12;
        ampm = "PM";
    }
    h = h == 0 ? h = 12 : h;
    h = h < 10 ? "0" + h : h;
    m = m < 10 ? "0" + m : m;
    s = s < 10 ? "0" + s : s;
    currentTime.innerText = `${h}:${m}:${s} ${ampm}`;

    if (alarmTime === `${h}:${m} ${ampm}` && !alarmTriggered) {
        alarmTriggered = true;

        ringtone.play().catch(e => {
            setTimeout(() => ringtone.play(), 100);
        });
        ringtone.loop = true;

        if ("vibrate" in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200, 100, 200]);
            window.vibrateInterval = setInterval(() => {
                navigator.vibrate([200, 100, 200]);
            }, 2000);
        }

        if ("Notification" in window && Notification.permission === "granted") {
            const notification = new Notification("⏰ ALARM!", {
                body: `Đã đến ${alarmTime}! Nhấn để tắt.`,
                icon: "icon-192.png",
                badge: "icon-192.png",
                requireInteraction: true,
                vibrate: [200, 100, 200, 100, 200],
                tag: 'alarm-ringing'
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }

        document.title = "🔔 ALARM! 🔔";
        window.titleBlinkInterval = setInterval(() => {
            document.title = document.title === "🔔 ALARM! 🔔" ? "⏰ WAKE UP! ⏰" : "🔔 ALARM! 🔔";
        }, 500);

        status.textContent = "⏰ ALARM ĐANG RÉO!";
        status.style.color = "red";
        status.style.fontWeight = "bold";

        updateBadge(1);
    }
}, 1000);

async function setAlarm() {
    if (isAlarmSet) {
        alarmTime = "";
        alarmTriggered = false;
        ringtone.pause();
        ringtone.currentTime = 0;
        content.classList.remove("disable");
        setAlarmBtn.innerText = "Set Alarm";
        document.title = "Alarm Clock";
        status.textContent = "Chọn giờ báo thức";
        status.style.color = "#666";
        status.style.fontWeight = "normal";

        if (window.titleBlinkInterval) clearInterval(window.titleBlinkInterval);
        if (window.vibrateInterval) clearInterval(window.vibrateInterval);

        releaseWakeLock();
        updateBadge(0);

        return isAlarmSet = false;
    }

    let time = `${selectMenu[0].value}:${selectMenu[1].value} ${selectMenu[2].value}`;
    if (time.includes("Hour") || time.includes("Minute") || time.includes("AM/PM")) {
        return alert("Please, select a valid time to set Alarm!");
    }

    if ("Notification" in window && Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        if (permission !== "granted") {
            alert("⚠️ Hãy cho phép thông báo để alarm hoạt động tốt hơn!");
        }
    }

    await requestWakeLock();

    alarmTime = time;
    isAlarmSet = true;
    alarmTriggered = false;
    content.classList.add("disable");
    setAlarmBtn.innerText = "Clear Alarm";
    status.textContent = `⏰ Báo thức: ${time}`;
    status.style.color = "#28a745";
    status.style.fontWeight = "bold";

    updateBadge(1);
}

setAlarmBtn.addEventListener("click", setAlarm);

document.addEventListener('visibilitychange', () => {
    if (document.hidden && isAlarmSet && alarmTriggered) {
        if (ringtone.paused) {
            ringtone.play().catch(e => console.log('Play error:', e));
        }
    }
});