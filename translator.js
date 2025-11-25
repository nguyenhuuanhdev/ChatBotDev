const translations = {
    'en-vi': {
        'hello': 'xin chào',
        'hi': 'chào',
        'goodbye': 'tạm biệt',
        'thank you': 'cảm ơn',
        'thanks': 'cảm ơn',
        'yes': 'có',
        'no': 'không',
        'please': 'xin hãy',
        'sorry': 'xin lỗi',
        'excuse me': 'xin lỗi',
        'how are you': 'bạn có khỏe không',
        'i love you': 'anh yêu em',
        'good morning': 'chào buổi sáng',
        'good night': 'chúc ngủ ngon',
        'water': 'nước',
        'food': 'thức ăn',
        'house': 'nhà',
        'cat': 'mèo',
        'dog': 'chó',
        'beautiful': 'đẹp',
        'good': 'tốt',
        'bad': 'xấu',
        'big': 'lớn',
        'small': 'nhỏ'
    },
    'vi-en': {
        'xin chào': 'hello',
        'chào': 'hi',
        'tạm biệt': 'goodbye',
        'cảm ơn': 'thank you',
        'có': 'yes',
        'không': 'no',
        'xin hãy': 'please',
        'xin lỗi': 'sorry',
        'bạn có khỏe không': 'how are you',
        'anh yêu em': 'i love you',
        'chào buổi sáng': 'good morning',
        'chúc ngủ ngon': 'good night',
        'nước': 'water',
        'thức ăn': 'food',
        'nhà': 'house',
        'mèo': 'cat',
        'chó': 'dog',
        'đẹp': 'beautiful',
        'tốt': 'good',
        'xấu': 'bad',
        'lớn': 'big',
        'nhỏ': 'small'
    },
    'en-ko': {
        'hello': '안녕하세요',
        'hi': '안녕',
        'goodbye': '안녕히 가세요',
        'thank you': '감사합니다',
        'yes': '네',
        'no': '아니요',
        'please': '부탁합니다',
        'sorry': '죄송합니다',
        'how are you': '어떻게 지내세요',
        'i love you': '사랑해요',
        'good morning': '좋은 아침',
        'good night': '잘 자요',
        'water': '물',
        'food': '음식',
        'house': '집',
        'cat': '고양이',
        'dog': '개',
        'beautiful': '아름다운',
        'good': '좋은',
        'bad': '나쁜'
    },
    'en-ja': {
        'hello': 'こんにちは',
        'hi': 'やあ',
        'goodbye': 'さようなら',
        'thank you': 'ありがとうございます',
        'yes': 'はい',
        'no': 'いいえ',
        'please': 'お願いします',
        'sorry': 'すみません',
        'how are you': '元気ですか',
        'i love you': '愛してる',
        'good morning': 'おはようございます',
        'good night': 'おやすみなさい',
        'water': '水',
        'food': '食べ物',
        'house': '家',
        'cat': '猫',
        'dog': '犬',
        'beautiful': '美しい',
        'good': '良い',
        'bad': '悪い'
    }
};

// Pronunciation dictionary for common words
const pronunciations = {
    'en': {
        'hello': '/həˈloʊ/',
        'hi': '/haɪ/',
        'goodbye': '/ɡʊdˈbaɪ/',
        'thank you': '/θæŋk juː/',
        'thanks': '/θæŋks/',
        'yes': '/jɛs/',
        'no': '/noʊ/',
        'please': '/pliːz/',
        'sorry': '/ˈsɔːri/',
        'excuse me': '/ɪkˈskjuːz miː/',
        'how are you': '/haʊ ɑːr juː/',
        'i love you': '/aɪ lʌv juː/',
        'good morning': '/ɡʊd ˈmɔːrnɪŋ/',
        'good night': '/ɡʊd naɪt/',
        'water': '/ˈwɔːtər/',
        'food': '/fuːd/',
        'house': '/haʊs/',
        'cat': '/kæt/',
        'dog': '/dɔːɡ/',
        'beautiful': '/ˈbjuːtɪfəl/',
        'good': '/ɡʊd/',
        'bad': '/bæd/',
        'big': '/bɪɡ/',
        'small': '/smɔːl/'
    },
    'vi': {
        'xin chào': '[sin chaːo]',
        'chào': '[chaːo]',
        'tạm biệt': '[tam biət]',
        'cảm ơn': '[kaːm ən]',
        'có': '[koː]',
        'không': '[kʰoŋm]',
        'xin hãy': '[sin haːj]',
        'xin lỗi': '[sin loːj]',
        'bạn có khỏe không': '[baːn koː kʰweː kʰoŋm]',
        'anh yêu em': '[aɲ jeːu ɛm]',
        'chào buổi sáng': '[chaːo buəj saːŋ]',
        'chúc ngủ ngon': '[cuk ŋuː ŋɔn]',
        'nước': '[nɯək]',
        'thức ăn': '[tʰɯk aːn]',
        'nhà': '[ɲaː]',
        'mèo': '[mɛːo]',
        'chó': '[coː]',
        'đẹp': '[ɗɛp]',
        'tốt': '[toːt]',
        'xấu': '[saːu]',
        'lớn': '[ləːn]',
        'nhỏ': '[ɲoː]'
    },
    'ko': {
        '안녕하세요': '[annyeonghaseyo]',
        '안녕': '[annyeong]',
        '안녕히 가세요': '[annyeonghi gaseyo]',
        '감사합니다': '[gamsahamnida]',
        '네': '[ne]',
        '아니요': '[aniyo]',
        '부탁합니다': '[butakamnida]',
        '죄송합니다': '[joesonghamnida]',
        '어떻게 지내세요': '[eotteoke jinaese yo]',
        '사랑해요': '[saranghaeyo]',
        '좋은 아침': '[joeun achim]',
        '잘 자요': '[jal jayo]'
    },
    'ja': {
        'こんにちは': '[konnichiwa]',
        'やあ': '[yaa]',
        'さようなら': '[sayounara]',
        'ありがとうございます': '[arigatou gozaimasu]',
        'はい': '[hai]',
        'いいえ': '[iie]',
        'お願いします': '[onegai shimasu]',
        'すみません': '[sumimasen]',
        '元気ですか': '[genki desu ka]',
        '愛してる': '[aishiteru]',
        'おはようございます': '[ohayou gozaimasu]',
        'おやすみなさい': '[oyasumi nasai]'
    }
};

function speakText(type) {
    if (!('speechSynthesis' in window)) {
        alert('🔊 Speech synthesis not supported in your browser');
        return;
    }

    let text = '';
    let lang = '';

    if (type === 'input') {
        text = document.getElementById('inputText').value.trim();
        lang = document.getElementById('fromLang').value;
    } else if (type === 'output') {
        const outputElement = document.getElementById('output');
        // Extract just the translated text, removing HTML tags and labels
        text = outputElement.textContent.replace(/^.*Translation:\s*/, '').replace(/^[^"]*"([^"]*)".*$/, '$1').trim();
        lang = document.getElementById('toLang').value;
    }

    if (!text) {
        alert('⚠️ No text to speak');
        return;
    }

    const utterance = new SpeechSynthesisUtterance(text);

    // Map language codes to speech synthesis language codes
    const langMap = {
        'en': 'en-US',
        'vi': 'vi-VN',
        'ko': 'ko-KR',
        'ja': 'ja-JP',
        'zh': 'zh-CN',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'es': 'es-ES'
    };

    utterance.lang = langMap[lang] || 'en-US';
    utterance.rate = 0.8;
    utterance.pitch = 1;
    utterance.volume = 0.8;

    // Stop any currently speaking text
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
}

function getPronunciation(text, lang) {
    const dict = pronunciations[lang];
    if (!dict) return null;

    const lowerText = text.toLowerCase().trim();
    return dict[lowerText] || null;
}

function showPronunciation(text, lang) {
    const pronunciation = getPronunciation(text, lang);
    const pronElement = document.getElementById('pronunciation');
    const pronText = document.getElementById('pronunciationText');

    if (pronunciation) {
        pronText.textContent = pronunciation;
        pronElement.style.display = 'block';
    } else {
        pronElement.style.display = 'none';
    }
}

function handleKeyUp(event) {
    if (event.key === 'Enter' && event.ctrlKey) {
        translateText();
    }
}

function swapLanguages() {
    const fromLang = document.getElementById('fromLang');
    const toLang = document.getElementById('toLang');
    const temp = fromLang.value;
    fromLang.value = toLang.value;
    toLang.value = temp;
}

async function translateText() {
    const text = document.getElementById("inputText").value.trim();
    const from = document.getElementById("fromLang").value;
    const to = document.getElementById("toLang").value;
    const output = document.getElementById("output");
    const btn = document.getElementById("translateBtn");
    const outputAudioControls = document.getElementById("outputAudioControls");
    const pronElement = document.getElementById('pronunciation');

    if (!text) {
        output.textContent = "⚠️ Please enter some text to translate.";
        output.className = "outputBox error";
        outputAudioControls.style.display = "none";
        pronElement.style.display = "none";
        return;
    }

    if (from === to) {
        output.textContent = "⚠️ Please select different source and target languages.";
        output.className = "outputBox error";
        outputAudioControls.style.display = "none";
        pronElement.style.display = "none";
        return;
    }

    btn.disabled = true;
    btn.innerHTML = "⏳ Translating...";
    output.textContent = "✨ Translating your text...";
    output.className = "outputBox loading";
    outputAudioControls.style.display = "none";
    pronElement.style.display = "none";

    try {
        // Try multiple translation APIs
        let translated = await tryTranslateWithAPIs(text, from, to);

        if (!translated) {
            // Fallback to local dictionary
            translated = translateWithDictionary(text, from, to);
        }

        if (translated) {
            output.innerHTML = `🎯 <strong>Translation:</strong><br><br>"${translated}"`;
            output.className = "outputBox success";
            outputAudioControls.style.display = "block";

            // Show pronunciation if available
            showPronunciation(translated, to);
        } else {
            output.innerHTML = `🔍 <strong>Translation not available</strong><br><br>Try using simple words like:<br>"hello", "thank you", "water"`;
            output.className = "outputBox error";
            outputAudioControls.style.display = "none";
            pronElement.style.display = "none";
        }
    } catch (error) {
        console.error("Translation error:", error);
        output.innerHTML = `❌ <strong>Oops! Something went wrong</strong><br><br>Please try again or use simpler text`;
        output.className = "outputBox error";
        outputAudioControls.style.display = "none";
        pronElement.style.display = "none";
    } finally {
        btn.disabled = false;
        btn.innerHTML = "🌈 Translate";
    }
}

async function tryTranslateWithAPIs(text, from, to) {
    const apis = [
        // API 1: MyMemory Translation
        async () => {
            const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`);
            const data = await response.json();
            if (data.responseStatus === 200 && data.responseData.translatedText) {
                return data.responseData.translatedText;
            }
            return null;
        },

        // API 2: Translate.googleapis.com (free tier)
        async () => {
            try {
                const response = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`);
                const data = await response.json();
                if (data && data[0] && data[0][0] && data[0][0][0]) {
                    return data[0][0][0];
                }
            } catch (e) {
                return null;
            }
            return null;
        }
    ];

    for (let api of apis) {
        try {
            const result = await api();
            if (result && result.trim() && result.toLowerCase() !== text.toLowerCase()) {
                return result;
            }
        } catch (error) {
            console.log("API failed, trying next:", error);
            continue;
        }
    }
    return null;
}

function translateWithDictionary(text, from, to) {
    const key = `${from}-${to}`;
    const dict = translations[key];

    if (!dict) {
        return null;
    }

    const lowerText = text.toLowerCase().trim();

    // Exact match
    if (dict[lowerText]) {
        return dict[lowerText];
    }

    // Word by word translation for simple cases
    const words = lowerText.split(' ');
    const translatedWords = words.map(word => {
        const cleanWord = word.replace(/[^\w\s]/g, '');
        return dict[cleanWord] || word;
    });

    const result = translatedWords.join(' ');
    return result !== lowerText ? result : null;
}

// Auto-translate on page load with sample text


window.onload = function () {
    document.getElementById("inputText").value = "Hello";
    const output = document.getElementById("output");
    output.innerHTML = "🌟 Welcome! Enter text above and click translate";
    output.className = "outputBox";
    setTimeout(() => {
        translateText();
    }, 1500);
};




function speakText(type) {
    const text = (type === 'input')
        ? document.getElementById("inputText").value.trim()
        : document.getElementById("output").textContent.trim();

    if (!text) return;

    const url = `https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(text)}`;
    const audio = new Audio(url);
    audio.play().catch(error => {
        alert("🔇 Không thể phát âm thanh trên trình duyệt này.");
        console.error(error);
    });
}

function speakText(type) {
    if (!('speechSynthesis' in window)) {
        alert('🔊 Trình duyệt của bạn không hỗ trợ phát giọng nói.');
        return;
    }

    // Lấy nội dung cần đọc
    let text = '';
    let lang = '';
    if (type === 'input') {
        text = document.getElementById('inputText').value.trim();
        lang = document.getElementById('fromLang').value;
    } else if (type === 'output') {
        const output = document.getElementById('output');
        text = output.textContent.replace(/^.*Translation:\s*/, '').trim();
        lang = document.getElementById('toLang').value;
    }

    if (!text) {
        alert('⚠️ Không có nội dung để đọc.');
        return;
    }

    // Ánh xạ mã ngôn ngữ sang giọng trình duyệt
    const langMap = {
        'en': 'en-US',
        'vi': 'vi-VN',
        'ko': 'ko-KR',
        'ja': 'ja-JP',
        'zh': 'zh-CN',
        'fr': 'fr-FR',
        'de': 'de-DE',
        'es': 'es-ES'
    };

    // Hủy phát cũ nếu đang nói
    window.speechSynthesis.cancel();

    // Tạo giọng đọc
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = langMap[lang] || 'en-US';
    utter.rate = 1.0;   // tốc độ đọc
    utter.pitch = 1.0;  // cao độ
    utter.volume = 1.0; // âm lượng

    // Chọn giọng nếu có
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === utter.lang);
    if (matchedVoice) utter.voice = matchedVoice;

    // Phát giọng nói
    window.speechSynthesis.speak(utter);
}


const audio = new Audio(`https://api.streamelements.com/kappa/v2/speech?voice=Brian&text=${encodeURIComponent(text)}`);
audio.play();


