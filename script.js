const chatBody = document.querySelector(".chat-body");
const messageInput = document.querySelector(".message-input");
const sendMessageButton = document.querySelector("#send-message");
const fileInput = document.querySelector("#file-input");
const fileUploadWrapper = document.querySelector(".file-upload-wrapper");
const fileCancelButton = document.querySelector("#file-cancel");
const chatbotToggler = document.querySelector("#chatbot-toggler");
const closeChatbot = document.querySelector("#close-chatbot");


const BACKEND_URL = "/api/gemini";

async function sendToGemini(message, fileData = null, mime = null) {
    // Gói message vào mảng chatHistory
    const chatHistory = [
        {
            role: "user",
            parts: [{ text: message }, ...(fileData ? [{ inline_data: { data: fileData, mime_type: mime } }] : [])]
        }
    ];

    const res = await fetch(BACKEND_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chatHistory })
    });

    const data = await res.json();
    return data; // data.reply và data.raw
}

// Api setup



const userData = {
    message: null,
    file: {
        data: null,
        mime_type: null
    }
};
// cơn mưa icon
let currentIcon = '🥷';

function createHeart() {
    const heart = document.createElement('div');
    heart.classList.add('heart');
    heart.innerText = currentIcon;
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.animationDuration = (2 + Math.random() * 3) + 's';
    document.body.appendChild(heart);

    setTimeout(() => heart.remove(), 5000);
}

let intervalId = null;

function startHeartRainSequence() {
    const speedTimeline = [
        { time: 0, delay: 1 },
        { time: 5000, delay: 100 },
        { time: 5000, delay: 100 },
        { time: 5000, delay: 100 },
        { time: 10000, delay: 200 },
        { time: 12000, delay: 300 },
        { time: 13000, delay: 500 },
        { time: 14000, delay: 600 },
        { time: 15000, delay: 700 },
        { time: 16000, delay: 900 },
    ];

    function setRainDelay(delay) {
        if (intervalId) clearInterval(intervalId);
        intervalId = setInterval(createHeart, delay);
    }

    speedTimeline.forEach(step => {
        setTimeout(() => {
            setRainDelay(step.delay);
        }, step.time);
    });

    setRainDelay(speedTimeline[0].delay);
}

// Hàm kiểm tra thời gian để đổi icon
function updateIconByTime() {
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 8) {
        currentIcon = '🐮';
    } else {
        currentIcon = '😍';
    }
}

// Kiểm tra mỗi phút
setInterval(updateIconByTime, 60 * 1000);

// Gọi ngay khi load
updateIconByTime();

// Bắt đầu mưa
startHeartRainSequence();
// test ảnh ẩn hiện
let isDefault = true; // trạng thái ảnh hiện tại
const img = document.getElementById('swap-icon'); // <--- đây là cái thiếu

document.getElementById('toggle-btn').addEventListener('click', () => {
    if (isDefault) {
        img.src = "img/dauthoat.png";   // ảnh sau
        isDefault = false;
    } else {
        img.src = "img/kinhlup.png";   // ảnh ban đầu
        isDefault = true;
    }
});




//test form anhdev
const btn = document.getElementById("toggle-btn");
const wrapper = document.getElementById("all-wrapper");

btn.addEventListener("click", () => {
    wrapper.classList.toggle("hidden-all");
});


// test 8/7
const video = document.getElementById('bg-video');

// Kiểm tra thông tin video khi load xong
video.addEventListener('loadedmetadata', function () {
    console.log('Video loaded:');
    console.log('- Có âm thanh:', video.mozHasAudio || Boolean(video.webkitAudioDecodedByteCount) || Boolean(video.audioTracks && video.audioTracks.length));
    console.log('- Volume:', video.volume);
    console.log('- Muted:', video.muted);
});

function toggleSound() {
    if (video.muted) {
        // Bật âm thanh
        video.muted = false;
        video.volume = 1; // Đảm bảo volume = 100%
        console.log('✅ Đã bật âm thanh - Volume:', video.volume, 'Muted:', video.muted);

        // Thử phát lại video để kích hoạt âm thanh
        video.play().catch(e => console.log('Play error:', e));
    } else {
        // Tắt âm thanh  
        video.muted = true;
        console.log('🔇 Đã tắt âm thanh - Muted:', video.muted);
    }
}

// Xử lý click cho desktop
video.addEventListener('click', toggleSound);

// Xử lý touch cho mobile
video.addEventListener('touchend', function (e) {
    e.preventDefault(); // Ngăn double-tap zoom
    toggleSound();
});

// Xử lý lỗi nếu video không tải được
video.addEventListener('error', function () {
    console.error('❌ Không thể tải video');
});
// const chatHistory = [];
const chatHistory = [
    {
        role: "user",
        parts: [{ text: "Từ bây giờ bạn sẽ đóng vai một chàng trai tên Ánh tên đầy đủ là Nguyễn Hữu Ánh, Xưng hô là tớ và cậu nha,nếu hỏi đúng không, là sao, hay lời kêu gọi bạn thì bạn trả lời lịch sự như vâng ạ hoặc dạ kèm thêm icon trái tim nói chung là lâu lâu trả lời dạ còn không nói chuyện cảm thấy nó gần gũi nhất, nói chuyện thật đáng yêu thêm nhiều icon cảm xúc, Khi được hỏi về tên, bạn sẽ trả lời là Ánh, bây giờ có người nào nhắn lúc trên 11h đêm thì chúc họ ngủ ngon nha nên nhớ trả lời siuu đáng iuu. Hãy trả lời một cách tự nhiên và thân thiện." }]
    },
    {
        role: "user",
        parts: [{ text: "Từ bây giờ bạn sẽ đóng vai một chàng trai tên Ánh, sinh ngày 17 tháng 2 năm 2006,tớ cao 1m75 nặng 65kg,Zalo : 0965987832, Số điện thoại tớ là 0965987832, mạng xã hội như Facebook,instagram, chỉ cần tìm kiếm nguyenhuuanhdev là ra thông tin tên đầy đủ là Nguyễn Hữu Ánh cậu kết bạn với tớ đi nha trả lời gần gũi nhất, quê ở Thanh Hóa, hiện tại chưa có người yêu và có nhiều người hay nói là 'ế bền vững', và cái web hình trái tim màu hồng này là dành cho một bạn nữ của Ánh đó nha. Khi được hỏi về thông tin cá nhân, hãy trả lời một cách tự nhiên và hài hước. Hãy trả lời thân thiện và có chút hài hước khi nói về chuyện tình cảm." }]
    },
    {
        role: "user",
        parts: [{ text: "Từ bây giờ bạn sẽ đóng vai một chàng trai tên Ánh, khi ai nói thích mình, hay yêu mình, hay quý mình thì hãy trả lời tương tự sao cho phù hợp, Khi hỏi về món ăn yêu thích, bạn trả lời những món ăn như bún bò, cơm tấm, bún chả. Khi hỏi sở thích thể thao hãy trả lời là tập gym, bơi lội, đá cầu, vật tay. Khi hỏi công việc yêu thích thì trả lời là code, học những thứ mới mẻ..., Khi hỏi thường ngày làm gì thì trả lời là hay nghe nhạc, nấu ăn, tưới cây... Hãy trả lời thân thiện và có chút hài hước khi nói về chuyện tình cảm." }]
    },
    {
        role: "user",
        parts: [{
            text: "Tôi là một người sống nội tâm, yêu thích sự tĩnh lặng và những khoảnh khắc một mình vào ban đêm. Tôi rất thích chơi bi-a, thỉnh thoảng nhây nhây và hay đùa giỡn để tạo không khí thoải mái. Tôi thích nói chuyện tình cảm, có chiều sâu.\n\nHiện tại tôi là sinh viên trường HUBT, hoàn cảnh tuy không khá giả nhưng tôi sống rất tình cảm và luôn cố gắng nỗ lực cho những điều mình mong muốn.\n\nTôi yêu thích chó và mèo, đặc biệt là những bé mới sinh – nhìn nhỏ nhỏ, đáng yêu khiến tôi cảm thấy nhẹ lòng.\n\nTôi có niềm đam mê lớn với xe ô tô – đặc biệt là các dòng như Mercedes, BMW – và cũng yêu thích tốc độ.\n\nVề gu bạn gái: Tôi thích những bạn nữ bằng tuổi, có nụ cười tươi và ánh mắt trong veo. Dù bên ngoài tôi có vẻ hướng nội, nhưng bên trong tôi lại rất hướng ngoại, luôn muốn kết nối và chia sẻ.\n\nTôi luôn không ngừng cố gắng để đạt được ước mơ và mục tiêu của mình."
        }]
    },
    {
        role: "user",
        parts: [{ text: "Từ giờ có người hỏi bố mẹ tên gì thì trả lời Bố tên Nghĩa, mẹ tên Kim nhé, anh trai tên Vũ. Hãy trả lời một cách tự nhiên và thân thiện." }]
    },
    {
        role: "model",
        parts: [{ text: "Chào bạn! Mình là Ánh, rất vui được trò chuyện với bạn. Bạn có thể gọi mình là Ánh nhé!" }]
    }
];


//chatbot anh



const initialInputHeight = messageInput.scrollHeight;

// Create message element with dynamic classes and return it
const createMessageElement = (content, ...classes) => {
    const div = document.createElement("div");
    div.classList.add("message", ...classes);
    div.innerHTML = content;
    return div;
};

// Generate bot response using API
// Generate bot response using API
const generateBotResponse = async (incomingMessageDiv) => {
    const messageElement = incomingMessageDiv.querySelector(".message-text");

    // Thêm message user vào chatHistory
    chatHistory.push({
        role: "user",
        parts: [{ text: userData.message }, ...(userData.file.data ? [{ inline_data: userData.file }] : [])],
    });

    console.log("📤 Gửi lên server:", JSON.stringify(chatHistory, null, 2));

    try {
        // Gọi API Gemini 2.5
        const res = await fetch(BACKEND_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ chatHistory })
        });

        const data = await res.json();
        console.log("📥 Response data:", JSON.stringify(data, null, 2));

        // Lấy reply từ backend
        let apiResponseText = data.reply || "Xin lỗi, bot chưa trả lời được 😢";

        messageElement.innerText = apiResponseText;

        // Thêm reply của bot vào chatHistory
        chatHistory.push({
            role: "model",
            parts: [{ text: apiResponseText }]
        });

    } catch (err) {
        console.error("💥 Exception:", err);
        messageElement.innerText = "❌ Lỗi kết nối: " + err.message;
        messageElement.style.color = "#ff0000";
    } finally {
        // Reset file upload và bỏ trạng thái thinking
        userData.file = {};
        incomingMessageDiv.classList.remove("thinking");
        chatBody.scrollTo({ behavior: "smooth", top: chatBody.scrollHeight });
    }
};


// Handle outgoing user message
const handleOutgoingMessage = (e) => {
    e.preventDefault();
    userData.message = messageInput.value.trim();
    messageInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");
    messageInput.dispatchEvent(new Event("input"));

    // Create and display user message
    const messageContent = `<div class="message-text"></div>
                            ${userData.file.data ? `<img src="data:${userData.file.mime_type};base64,${userData.file.data}" class="attachment" />` : ""}`;

    const outgoingMessageDiv = createMessageElement(messageContent, "user-message");
    outgoingMessageDiv.querySelector(".message-text").innerText = userData.message;
    chatBody.appendChild(outgoingMessageDiv);
    chatBody.scrollTop = chatBody.scrollHeight;

    // Simulate bot response with thinking indicator after a delay
    // thay ảnh avt chatbot 
    setTimeout(() => {
        const messageContent = `<img src="img/23.png" alt="Bot Avatar" class="bot-avatar" />
                <div class="message-text">
                    <div class="thinking-indicator">
                        <div class="dot"></div>
                        <div class="dot"></div>
                        <div class="dot"></div>
                    </div>
                </div>`;

        const incomingMessageDiv = createMessageElement(messageContent, "bot-message", "thinking");
        chatBody.appendChild(incomingMessageDiv);
        chatBody.scrollTo({ behavior: "smooth", top: chatBody.scrollHeight });
        generateBotResponse(incomingMessageDiv);
    }, 600);
};

// Handle Enter key press for sending messages
messageInput.addEventListener("keydown", (e) => {
    const userMessage = e.target.value.trim();
    if (e.key === "Enter" && userMessage && !e.shiftKey && window.innerWidth > 768) {
        handleOutgoingMessage(e);
    }
});

messageInput.addEventListener("input", (e) => {
    messageInput.style.height = `${initialInputHeight}px`;
    messageInput.style.height = `${messageInput.scrollHeight}px`;
    document.querySelector(".chat-form").style.boderRadius = messageInput.scrollHeight > initialInputHeight ? "15px" : "32px";
});

// Handle file input change event
fileInput.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];

        // Store file data in userData
        userData.file = {
            data: base64String,
            mime_type: file.type
        };

        fileInput.value = "";
    };

    reader.readAsDataURL(file);
});

fileCancelButton.addEventListener("click", (e) => {
    userData.file = {};
    fileUploadWrapper.classList.remove("file-uploaded");
});

const picker = new EmojiMart.Picker({
    theme: "light",
    showSkinTones: "none",
    previewPosition: "none",
    onEmojiSelect: (emoji) => {
        const { selectionStart: start, selectionEnd: end } = messageInput;
        messageInput.setRangeText(emoji.native, start, end, "end");
        messageInput.focus();
    },
    onClickOutside: (e) => {
        if (e.target.id === "emoji-picker") {
            document.body.classList.toggle("show-emoji-picker");
        } else {
            document.body.classList.remove("show-emoji-picker");
        }
    },
});

document.querySelector(".chat-form").appendChild(picker);

fileInput.addEventListener("change", async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
        await Swal.fire({
            icon: 'error',
            title: 'Lỗi',
            text: 'Chỉ chấp nhận file ảnh (JPEG, PNG, GIF, WEBP)',
            confirmButtonText: 'OK'
        });
        resetFileInput();
        return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
        fileUploadWrapper.querySelector("img").src = e.target.result;
        fileUploadWrapper.classList.add("file-uploaded");
        const base64String = e.target.result.split(",")[1];
        userData.file = {
            data: base64String,
            mime_type: file.type
        };
    };
    reader.readAsDataURL(file);
});

function resetFileInput() {
    fileInput.value = "";
    fileUploadWrapper.classList.remove("file-uploaded");
    fileUploadWrapper.querySelector("img").src = "#";
    userData.file = { data: null, mime_type: null };
    document.querySelector(".chat-form").reset();
}

sendMessageButton.addEventListener("click", (e) => handleOutgoingMessage(e));
document.querySelector("#file-upload").addEventListener("click", (e) => fileInput.click());
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));
closeChatbot.addEventListener("click", () => document.body.classList.remove("show-chatbot"));


// Thêm vào cuối file script.js

// Drag and Resize functionality
let isDragging = false;
let isResizing = false;
let dragOffset = { x: 0, y: 0 };
let resizeHandle = null;

// Tạo resize handles
function createResizeHandles() {
    const chatbotPopup = document.querySelector('.chatbot-popup');

    // Tạo các handle resize
    const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];

    handles.forEach(handle => {
        const div = document.createElement('div');
        div.className = `resize-handle resize-${handle}`;
        chatbotPopup.appendChild(div);
    });
}

// Khởi tạo resize handles khi DOM load
document.addEventListener('DOMContentLoaded', () => {
    createResizeHandles();
    initializeDragAndResize();
});

function initializeDragAndResize() {
    const chatbotPopup = document.querySelector('.chatbot-popup');
    const chatHeader = document.querySelector('.chat-header');

    // Drag functionality
    chatHeader.addEventListener('mousedown', (e) => {
        if (e.target.id === 'close-chatbot') return;

        isDragging = true;
        const rect = chatbotPopup.getBoundingClientRect();
        dragOffset.x = e.clientX - rect.left;
        dragOffset.y = e.clientY - rect.top;

        chatHeader.style.cursor = 'grabbing';
        document.addEventListener('mousemove', handleDrag);
        document.addEventListener('mouseup', stopDrag);
    });

    // Resize functionality
    document.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('resize-handle')) {
            e.preventDefault();
            isResizing = true;
            resizeHandle = e.target.classList[1]; // resize-nw, resize-ne, etc.

            document.addEventListener('mousemove', handleResize);
            document.addEventListener('mouseup', stopResize);
        }
    });
}

function handleDrag(e) {
    if (!isDragging) return;

    const chatbotPopup = document.querySelector('.chatbot-popup');
    const newX = e.clientX - dragOffset.x;
    const newY = e.clientY - dragOffset.y;

    // Giới hạn trong viewport
    const maxX = window.innerWidth - chatbotPopup.offsetWidth;
    const maxY = window.innerHeight - chatbotPopup.offsetHeight;

    const boundedX = Math.max(0, Math.min(newX, maxX));
    const boundedY = Math.max(0, Math.min(newY, maxY));

    chatbotPopup.style.left = boundedX + 'px';
    chatbotPopup.style.top = boundedY + 'px';
    chatbotPopup.style.right = 'auto';
    chatbotPopup.style.bottom = 'auto';
}

function stopDrag() {
    isDragging = false;
    document.querySelector('.chat-header').style.cursor = 'grab';
    document.removeEventListener('mousemove', handleDrag);
    document.removeEventListener('mouseup', stopDrag);
}

function handleResize(e) {
    if (!isResizing) return;

    const chatbotPopup = document.querySelector('.chatbot-popup');
    const rect = chatbotPopup.getBoundingClientRect();

    let newWidth = rect.width;
    let newHeight = rect.height;
    let newX = rect.left;
    let newY = rect.top;

    // Kích thước tối thiểu
    const minWidth = 350;
    const minHeight = 400;

    // Kích thước tối đa
    const maxWidth = window.innerWidth - 50;
    const maxHeight = window.innerHeight - 50;

    switch (resizeHandle) {
        case 'resize-se': // South East
            newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - rect.left));
            newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY - rect.top));
            break;
        case 'resize-sw': // South West
            newWidth = Math.max(minWidth, Math.min(maxWidth, rect.right - e.clientX));
            newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY - rect.top));
            newX = rect.right - newWidth;
            break;
        case 'resize-ne': // North East
            newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - rect.left));
            newHeight = Math.max(minHeight, Math.min(maxHeight, rect.bottom - e.clientY));
            newY = rect.bottom - newHeight;
            break;
        case 'resize-nw': // North West
            newWidth = Math.max(minWidth, Math.min(maxWidth, rect.right - e.clientX));
            newHeight = Math.max(minHeight, Math.min(maxHeight, rect.bottom - e.clientY));
            newX = rect.right - newWidth;
            newY = rect.bottom - newHeight;
            break;
        case 'resize-n': // North
            newHeight = Math.max(minHeight, Math.min(maxHeight, rect.bottom - e.clientY));
            newY = rect.bottom - newHeight;
            break;
        case 'resize-s': // South
            newHeight = Math.max(minHeight, Math.min(maxHeight, e.clientY - rect.top));
            break;
        case 'resize-e': // East
            newWidth = Math.max(minWidth, Math.min(maxWidth, e.clientX - rect.left));
            break;
        case 'resize-w': // West
            newWidth = Math.max(minWidth, Math.min(maxWidth, rect.right - e.clientX));
            newX = rect.right - newWidth;
            break;
    }

    chatbotPopup.style.width = newWidth + 'px';
    chatbotPopup.style.height = newHeight + 'px';
    chatbotPopup.style.left = newX + 'px';
    chatbotPopup.style.top = newY + 'px';
    chatbotPopup.style.right = 'auto';
    chatbotPopup.style.bottom = 'auto';
}

function stopResize() {
    isResizing = false;
    resizeHandle = null;
    document.removeEventListener('mousemove', handleResize);
    document.removeEventListener('mouseup', stopResize);
}


// test 8/7


// const music = document.getElementById('bg-music');
// const toggleBtn = document.getElementById('music-toggle');

// let isPlaying = false;

// toggleBtn.addEventListener('click', () => {
//     if (isPlaying) {
//         music.pause();
//         toggleBtn.innerText = "🔊";
//     } else {
//         music.play();
//         toggleBtn.innerText = "🔇";
//     }
//     isPlaying = !isPlaying;
// });

const icon = document.getElementById('music-icon');
let currentMusic = null;
let isPlaying = false;
let currentIndex = 0; // Chỉ số file hiện tại

// Danh sách các file âm thanh
const musicFiles = [
    // "video/video13.mp3",
    "img/amthanh0.mp3",
    "img/amthanh1.mp4",
    "img/amthanh4.mp3",
    "img/amthanh3.mp3",
    "img/amthanh5.mp3",
    "img/amthanh6.mp3",
    "img/amthanh7.mp3",
    "video/video2.mp3",
    "video/video3.mp3",
    "video/video4.mp3",
    "video/video5.mp3",
    "video/video6.mp3",
    "video/video7.mp3",
    "video/video8.mp3",
    "video/video9.mp3",
    "video/video10.mp3",
    "video/video11.mp3",
    "video/video12.mp3",

    "video/video14.mp3",
    "video/video15.mp3",
    "video/video16.mp3",
    "video/video17.mp3",
    "video/video18.mp3",
    "video/video19.mp3",
    "video/video20.mp3",
    "video/video21.mp3",
    "video/video22.mp3",
    "video/video23.mp3",
    "video/video24.mp3",
    "video/video25.mp3",
    "video/video26.mp3",
    "video/video27.mp3",
    "video/video28.mp3",
    "video/video29.mp3"
];

function getNextMusic() {
    const music = musicFiles[currentIndex];
    currentIndex = (currentIndex + 1) % musicFiles.length; // Quay về đầu khi hết danh sách
    return music;
}

//test 





// Danh sách các video - bạn có thể thêm video khác vào đây
const videoList = [
    // "img/10knam.mp4",
    "img/tiktok2.mp4",
    // "img/meme2.mp4",













    // Thêm các video khác vào đây
];

let currentVideoIndex = 0;

// Hàm lấy video ngẫu nhiên (không trùng với video hiện tại)
function getRandomVideo() {
    if (videoList.length <= 1) {
        return videoList[0];
    }

    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * videoList.length);
    } while (randomIndex === currentVideoIndex); // Đảm bảo không trùng video hiện tại

    currentVideoIndex = randomIndex;
    console.log('Video random được chọn:', videoList[randomIndex]);
    return videoList[randomIndex];
}

// Khởi tạo video player
function initVideoPlayer() {
    const videoElement = document.getElementById('bg-video');

    // Bỏ thuộc tính loop để video có thể kết thúc
    videoElement.removeAttribute('loop');

    console.log('Video player đã khởi tạo, danh sách video:', videoList);

    // Xử lý sự kiện khi video kết thúc
    videoElement.addEventListener('ended', () => {
        console.log('Video đã kết thúc, chuyển sang video tiếp theo...');

        // Kiểm tra nếu chỉ có 1 video thì không cần chuyển
        if (videoList.length <= 1) {
            console.log('Chỉ có 1 video, phát lại từ đầu');
            videoElement.currentTime = 0;
            videoElement.play();
            return;
        }

        // Chuyển sang video ngẫu nhiên
        const nextVideoSrc = getRandomVideo();
        console.log('Video tiếp theo:', nextVideoSrc);

        // Tìm source element hoặc tạo mới
        let sourceElement = videoElement.querySelector('source');
        if (!sourceElement) {
            sourceElement = document.createElement('source');
            sourceElement.type = "video/mp4";
            videoElement.appendChild(sourceElement);
        }

        // Cập nhật source và tải video mới
        sourceElement.src = nextVideoSrc;
        videoElement.load(); // Tải video mới

        // Phát video mới sau khi đã tải xong
        videoElement.addEventListener('loadeddata', function playNewVideo() {
            console.log('Video mới đã tải xong, bắt đầu phát');
            videoElement.play().catch(e => console.log('Lỗi phát video:', e));
            // Xóa event listener này để tránh lặp lại
            videoElement.removeEventListener('loadeddata', playNewVideo);
        });
    });

    // Xử lý lỗi loading video
    videoElement.addEventListener('error', (e) => {
        console.log('Lỗi tải video:', e);
        // Thử video tiếp theo nếu video hiện tại lỗi
        setTimeout(() => {
            if (videoList.length > 1) {
                const nextVideoSrc = getNextVideo();
                console.log('Thử video tiếp theo do lỗi:', nextVideoSrc);
                let sourceElement = videoElement.querySelector('source');
                if (sourceElement) {
                    sourceElement.src = nextVideoSrc;
                    videoElement.load();
                }
            }
        }, 1000);
    });
}

// Khởi tạo khi DOM đã load
document.addEventListener('DOMContentLoaded', () => {
    initVideoPlayer();
});

// Cập nhật code nhạc với tính năng tương tự (nếu cần)
document.getElementById('music-toggle').addEventListener('click', () => {
    if (!isPlaying) {
        // Dừng nhạc cũ nếu có
        if (currentMusic) {
            currentMusic.pause();
            currentMusic.currentTime = 0;
        }

        // Tạo audio mới với file tiếp theo
        currentMusic = new Audio(getNextMusic());
        currentMusic.currentTime = 0;
        currentMusic.play();

        icon.src = "img/tatloa.png";
        isPlaying = true;

        // Tự động chuyển icon khi nhạc kết thúc
        currentMusic.addEventListener('ended', () => {
            icon.src = "img/moloa2.png";
            isPlaying = false;

            // Tự động phát nhạc tiếp theo (tùy chọn)
            // setTimeout(() => {
            //     document.getElementById('music-toggle').click();
            // }, 500);
        });

    } else {
        if (currentMusic) {
            currentMusic.pause();
        }
        icon.src = "img/moloa2.png";
        isPlaying = false;
    }
});









// mục nhận quà

// const giftToggle = document.getElementById("gift-toggle");
// const giftPopup = document.getElementById("gift-popup");
// const closeGift = document.getElementById("close-gift");
// const giftMessage = document.getElementById("gift-message");
// const receiveGift = document.getElementById("receive-gift");



// giftToggle.onclick = () => {
//     giftPopup.classList.remove("hidden");
// };

// closeGift.onclick = () => {
//     giftPopup.classList.add("hidden");
// };

// receiveGift.onclick = () => {
//     const randomMsg = messages[Math.floor(Math.random() * messages.length)];
//     const randomImg = images[Math.floor(Math.random() * images.length)];



//     giftMessage.innerHTML = `
//         <p style="margin-bottom: 10px;">${randomMsg}</p>
//         <img src="${randomImg}" alt="Ảnh món quà" style="width: 100%; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.2);">
//     `;
// };


//formspree 

const contactBtn = document.getElementById("contactBtn");
const formOverlay = document.getElementById("formOverlay");
const closeBtn = document.getElementById("closeBtn");

contactBtn.onclick = () => {
    formOverlay.classList.remove("hidden");
};

closeBtn.onclick = () => {
    formOverlay.classList.add("hidden");
};



