const currentTime = document.querySelector("h1"),
    content = document.querySelector(".content"),
    selectMenu = document.querySelectorAll("select"),
    setAlarmBtn = document.querySelector("button");
let alarmTime, isAlarmSet, alarmTriggered = false,
    ringtone = new Audio("./files/alarm.mp3");

// Yêu cầu quyền thông báo khi trang load
if ("Notification" in window && Notification.permission === "default") {
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

        // Hiện thông báo
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
        return isAlarmSet = false;
    }

    // Kiểm tra quyền thông báo
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission().then(permission => {
            if (permission !== "granted") {
                alert("Vui lòng cho phép thông báo để alarm hoạt động khi tab ẩn!");
                return;
            }
        });
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