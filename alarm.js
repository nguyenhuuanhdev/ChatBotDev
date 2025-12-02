const currentTime = document.querySelector("h1"),
    content = document.querySelector(".content"),
    selectMenu = document.querySelectorAll("select"),
    setAlarmBtn = document.querySelector("button");
let alarmTime, isAlarmSet, alarmTriggered = false,
    ringtone = new Audio("./files/alarm.mp3"),
    wakeLock = null;

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

            // Nếu wake lock bị release (do người dùng tắt màn hình), request lại
            wakeLock.addEventListener('release', () => {
                console.log('Wake Lock đã tắt');
                if (isAlarmSet && !alarmTriggered) {
                    // Tự động request lại nếu alarm vẫn đang chạy
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

        // Phát âm thanh với xử lý lỗi
        ringtone.play().catch(e => {
            console.log("Lỗi phát âm thanh:", e);
            // Thử phát lại sau 100ms
            setTimeout(() => ringtone.play(), 100);
        });
        ringtone.loop = true;

        // Rung điện thoại liên tục
        if ("vibrate" in navigator) {
            // Rung ngay lập tức
            navigator.vibrate([200, 100, 200, 100, 200, 100, 200]);

            // Tiếp tục rung mỗi 2 giây
            window.vibrateInterval = setInterval(() => {
                navigator.vibrate([200, 100, 200]);
            }, 2000);
        }

        // Hiện thông báo
        if ("Notification" in window && Notification.permission === "granted") {
            const notification = new Notification("⏰ ALARM RINGING!", {
                body: `Đã đến ${alarmTime} - Nhấn để tắt báo thức`,
                icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='80' font-size='80'>⏰</text></svg>",
                requireInteraction: true,
                vibrate: [200, 100, 200, 100, 200, 100, 200],
                tag: 'alarm-clock'
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }

        // Thay đổi tiêu đề tab
        document.title = "🔔 ALARM RINGING! 🔔";
        window.titleBlinkInterval = setInterval(() => {
            document.title = document.title === "🔔 ALARM RINGING! 🔔" ? "⏰ WAKE UP! ⏰" : "🔔 ALARM RINGING! 🔔";
        }, 500);
    }
}, 1000);

async function setAlarm() {
    if (isAlarmSet) {
        // Tắt alarm
        alarmTime = "";
        alarmTriggered = false;
        ringtone.pause();
        ringtone.currentTime = 0;
        content.classList.remove("disable");
        setAlarmBtn.innerText = "Set Alarm";
        document.title = "Alarm Clock";

        // Clear intervals
        if (window.titleBlinkInterval) {
            clearInterval(window.titleBlinkInterval);
        }
        if (window.vibrateInterval) {
            clearInterval(window.vibrateInterval);
        }

        // Giải phóng Wake Lock
        releaseWakeLock();

        return isAlarmSet = false;
    }

    let time = `${selectMenu[0].value}:${selectMenu[1].value} ${selectMenu[2].value}`;
    if (time.includes("Hour") || time.includes("Minute") || time.includes("AM/PM")) {
        return alert("Please, select a valid time to set Alarm!");
    }

    // Yêu cầu quyền thông báo
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

    // Bật Wake Lock để giữ màn hình sáng
    await requestWakeLock();

    alarmTime = time;
    isAlarmSet = true;
    alarmTriggered = false;
    content.classList.add("disable");
    setAlarmBtn.innerText = "Clear Alarm";
}

setAlarmBtn.addEventListener("click", setAlarm);

// Xử lý khi tab bị ẩn - cố gắng tiếp tục phát âm thanh
document.addEventListener('visibilitychange', () => {
    if (document.hidden && isAlarmSet && alarmTriggered) {
        // Khi tab bị ẩn và alarm đang reo, thử phát lại âm thanh
        if (ringtone.paused) {
            ringtone.play().catch(e => console.log('Không thể phát âm thanh khi tab ẩn:', e));
        }
    }
});

// Ngăn trình duyệt tắt âm thanh khi màn hình khóa
window.addEventListener('pagehide', (e) => {
    if (isAlarmSet && alarmTriggered) {
        e.preventDefault();
    }
});