const keys = [
    process.env.GEMINI_KEY_1,
    process.env.GEMINI_KEY_2,
    process.env.GEMINI_KEY_3,
];

// Hàm random trộn mảng (Fisher–Yates Shuffle)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

export default async function handler(req, res) {
    // Chỉ chấp nhận POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body;

    // Check message
    if (!message || message.trim() === "") {
        return res.status(400).json({ error: "Message is empty" });
    }

    // Random thứ tự key
    const randomKeys = shuffle([...keys]);

    // Thử lần lượt từng key
    for (let key of randomKeys) {
        try {
            const apiRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: [
                            {
                                parts: [
                                    { text: message }
                                ]
                            }
                        ]
                    }),
                }
            );

            const data = await apiRes.json();

            // Nếu key trả về đúng format → thành công
            if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                return res.status(200).json(data);
            }
        } catch (error) {
            console.warn(`Key lỗi: ${key} → thử key tiếp theo...`);
        }
    }

    // Nếu cả 3 key đều lỗi → báo lỗi chung
    return res.status(500).json({
        error: "Bot không trả lời được 😢 (tất cả key đã lỗi hoặc hết hạn)"
    });
}
