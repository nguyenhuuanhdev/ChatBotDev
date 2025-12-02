const currentTime = document.querySelector("h1"),
    content = document.querySelector(".content"),
    selectMenu = document.querySelectorAll("select"),
    setAlarmBtn = document.querySelector("button");
let alarmTime, isAlarmSet, alarmTriggered = false,
    ringtone = new Audio("./files/alarm.mp3"),
    wakeLock = null;

// === THÊM PHẦN PWA ===
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

// Service Worker
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('sw.js').catch(err => {
        console.log('Service Worker error:', err);
    });
}
// === HẾT PHẦN PWA ===

// Yêu cầu quyền thông báo khi load trang (chỉ trên HTTPS)
if ("Notification" in window && Notification.permission === "default" && window.location.protocol === "https:") {
    Notification.requestPermission();
}

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

// Hàm giữ màn hình sáng
async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock đã bật - Màn hình sẽ không tắt');

            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock đã tắt');
                if (isAlarmSet && !alarmTriggered) {
                    setTimeout(() => requestWakeLock(), 100);
                }
            });
        }
    } catch (err) {
        console.log('Không thể bật Wake Lock:', err);
    }
}

function releaseWakeLock() {
    if (wakeLock !== null) {
        wakeLock.release();
        wakeLock = null;
        console.log('Wake Lock đã được giải phóng');
    }
}

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
            console.log("Lỗi phát âm thanh:", e);
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
            const notification = new Notification("⏰ ALARM RINGING!", {
                body: `Đã đến ${alarmTime} - Nhấn để tắt báo thức`,
                icon: "icon-192.png",
                badge: "icon-192.png",
                requireInteraction: true,
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                tag: 'alarm-clock'
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }

        document.title = "🔔 ALARM RINGING! 🔔";
        window.titleBlinkInterval = setInterval(() => {
            document.title = document.title === "🔔 ALARM RINGING! 🔔" ? "⏰ WAKE UP! ⏰" : "🔔 ALARM RINGING! 🔔";
        }, 500);
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

        if (window.titleBlinkInterval) {
            clearInterval(window.titleBlinkInterval);
        }
        if (window.vibrateInterval) {
            clearInterval(window.vibrateInterval);
        }

        releaseWakeLock();

        return isAlarmSet = false;
    }

    let time = `${selectMenu[0].value}:${selectMenu[1].value} ${selectMenu[2].value}`;
    if (time.includes("Hour") || time.includes("Minute") || time.includes("AM/PM")) {
        return alert("Please, select a valid time to set Alarm!");
    }

    if ("Notification" in window) {
        if (Notification.permission === "default") {
            const permission = await Notification.requestPermission();
            if (permission !== "granted") {
                alert("⚠️ Hãy cho phép thông báo để alarm hoạt động tốt hơn khi ẩn tab!\n\nCách bật: Nhấn vào biểu tượng khóa 🔒 bên URL → Notifications → Allow");
            }
        } else if (Notification.permission === "denied") {
            alert("⚠️ Thông báo đã bị chặn!\n\nCách bật lại:\n1. Nhấn biểu tượng khóa 🔒 bên URL\n2. Chọn Notifications → Allow\n3. Reload trang");
        }
    }

    await requestWakeLock();

    alarmTime = time;
    isAlarmSet = true;
    alarmTriggered = false;
    content.classList.add("disable");
    setAlarmBtn.innerText = "Clear Alarm";
}

setAlarmBtn.addEventListener("click", setAlarm);

document.addEventListener('visibilitychange', () => {
    if (document.hidden && isAlarmSet && alarmTriggered) {
        if (ringtone.paused) {
            ringtone.play().catch(e => console.log('Không thể phát âm thanh khi tab ẩn:', e));
        }
    }
});

window.addEventListener('pagehide', (e) => {
    if (isAlarmSet && alarmTriggered) {
        e.preventDefault();
    }
});