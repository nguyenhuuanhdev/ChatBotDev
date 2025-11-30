const keys = [
    process.env.GEMINI_KEY_1,
    process.env.GEMINI_KEY_2,
    process.env.GEMINI_KEY_3,
];

export default async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
    const { message } = req.body;
    if (!message || message.trim() === "") return res.status(400).json({ error: "Message is empty" });

    for (let key of keys) {
        try {
            const apiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ contents: [{ parts: [{ text: message }] }] }),
            });

            const data = await apiRes.json();

            if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                return res.status(200).json(data); // Thành công, trả về luôn
            }
        } catch (err) {
            // Nếu lỗi key, thử key tiếp theo
            console.warn(`Key bị lỗi: ${key}, thử key khác...`);
        }
    }

    // Nếu hết tất cả key mà vẫn lỗi
    return res.status(500).json({ error: "Bot không trả lời được 😢 (tất cả key đã lỗi hoặc hết hạn)" });
}
