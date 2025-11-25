const API_KEY = '6d5f685d1199193971667a8156ac986a'; // Ghi đúng, không bỏ dấu

const weatherIcons = {
    '01d': '☀️', '01n': '🌙',
    '02d': '⛅', '02n': '☁️',
    '03d': '☁️', '03n': '☁️',
    '04d': '☁️', '04n': '☁️',
    '09d': '🌧️', '09n': '🌧️',
    '10d': '🌦️', '10n': '🌧️',
    '11d': '⛈️', '11n': '⛈️',
    '13d': '❄️', '13n': '❄️',
    '50d': '🌫️', '50n': '🌫️'
};

function showLoading() {
    document.getElementById('loading').style.display = 'block';
    document.getElementById('weatherCard').style.display = 'none';
    document.getElementById('error').innerText = '';
}

function hideLoading() {
    document.getElementById('loading').style.display = 'none';
}

function showError(message) {
    document.getElementById('error').innerText = message;
    document.getElementById('weatherCard').style.display = 'none';
}

function displayWeather(data) {
    document.getElementById('weatherCard').style.display = 'block';
    document.getElementById('location').innerText = data.name;
    document.getElementById('temperature').innerText = `${data.main.temp}°C`;
    document.getElementById('weatherIcon').innerText = weatherIcons[data.weather[0].icon] || '❔';
    document.getElementById('description').innerText = data.weather[0].description;
    document.getElementById('feelsLike').innerText = `${data.main.feels_like}°C`;
    document.getElementById('humidity').innerText = `${data.main.humidity}%`;
    document.getElementById('windSpeed').innerText = `${data.wind.speed} m/s`;
    document.getElementById('pressure').innerText = `${data.main.pressure} hPa`;
    document.getElementById('visibility').innerText = `${data.visibility / 1000} km`;
    document.getElementById('uvIndex').innerText = 'Không có dữ liệu'; // Nếu muốn có, cần API khác

    document.body.className = data.weather[0].main.toLowerCase(); // thay đổi nền nếu cần
}

async function getWeather() {
    const city = document.getElementById('cityInput').value.trim();
    if (!city) {
        showError('Vui lòng nhập tên thành phố!');
        return;
    }

    showLoading();

    try {
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric&lang=vi`);
        if (!response.ok) throw new Error('Không tìm thấy thành phố hoặc lỗi API.');

        const data = await response.json();
        displayWeather(data);
    } catch (err) {
        showError(err.message);
    } finally {
        hideLoading();
    }
}

// KHÔNG tự động gọi khi tải trang nữa (loại bỏ window.addEventListener 'load')
