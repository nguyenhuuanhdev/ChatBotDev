const currentTime = document.querySelector("h1"),
    content = document.querySelector(".content"),
    selectMenu = document.querySelectorAll("select"),
    setAlarmBtn = document.querySelector("button");
let alarmTime, isAlarmSet, alarmTriggered = false,
    ringtone = new Audio("./files/alarm.mp3");

// Tự động yêu cầu quyền khi có HTTPS
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

        // Phát âm thanh
        ringtone.play();
        ringtone.loop = true;

        // Rung điện thoại (hoạt động cả HTTP)
        if ("vibrate" in navigator) {
            navigator.vibrate([200, 100, 200, 100, 200, 100, 200]);
        }

        // Hiện thông báo (chỉ trên HTTPS)
        if ("Notification" in window && Notification.permission === "granted") {
            const notification = new Notification("⏰ Alarm!", {
                body: `Đã đến ${alarmTime}`,
                icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='80' font-size='80'>⏰</text></svg>",
                requireInteraction: true,
                vibrate: [200, 100, 200, 100, 200, 100, 200]
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };
        }

        // Thay đổi tiêu đề tab để báo hiệu (hoạt động cả HTTP)
        document.title = "🔔 ALARM RINGING! 🔔";
        let titleBlink = setInterval(() => {
            document.title = document.title === "🔔 ALARM RINGING! 🔔" ? "⏰ WAKE UP! ⏰" : "🔔 ALARM RINGING! 🔔";
        }, 500);

        // Lưu interval để clear sau
        window.titleBlinkInterval = titleBlink;
    }
}, 1000);

function setAlarm() {
    if (isAlarmSet) {
        alarmTime = "";
        alarmTriggered = false;
        ringtone.pause();
        ringtone.currentTime = 0;
        content.classList.remove("disable");
        setAlarmBtn.innerText = "Set Alarm";
        document.title = "Alarm Clock";

        // Clear title blink
        if (window.titleBlinkInterval) {
            clearInterval(window.titleBlinkInterval);
        }

        return isAlarmSet = false;
    }

    // Kiểm tra quyền thông báo (chỉ trên HTTPS)
    if ("Notification" in window && Notification.permission !== "granted" && window.location.protocol === "https:") {
        Notification.requestPermission();
    }

    let time = `${selectMenu[0].value}:${selectMenu[1].value} ${selectMenu[2].value}`;
    if (time.includes("Hour") || time.includes("Minute") || time.includes("AM/PM")) {
        return alert("Please, select a valid time to set Alarm!");
    }
    alarmTime = time;
    isAlarmSet = true;
    alarmTriggered = false;
    content.classList.add("disable");
    setAlarmBtn.innerText = "Clear Alarm";
}

setAlarmBtn.addEventListener("click", setAlarm);