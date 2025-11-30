const keys = [
    process.env.GEMINI_KEY_1,
    process.env.GEMINI_KEY_2,
    process.env.GEMINI_KEY_3,
].filter(Boolean); // Loại bỏ key undefined/null

export default async function handler(req, res) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { chatHistory } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!chatHistory || !Array.isArray(chatHistory) || chatHistory.length === 0) {
        return res.status(400).json({ error: "chatHistory is required and must be an array" });
    }

    // Kiểm tra có key không
    if (keys.length === 0) {
        return res.status(500).json({ error: "No API keys configured" });
    }

    // Thử từng key
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        try {
            const apiRes = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${key}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: chatHistory,
                        generationConfig: {
                            temperature: 0.9,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 8192,
                        }
                    }),
                }
            );

            const data = await apiRes.json();

            // Kiểm tra response hợp lệ
            if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
                console.log(`✅ Key ${i + 1} hoạt động`);
                return res.status(200).json(data);
            }

            // Nếu API trả lỗi nhưng có message
            if (data?.error) {
                console.warn(`⚠️ Key ${i + 1} lỗi:`, data.error.message);
                continue; // Thử key tiếp theo
            }

        } catch (err) {
            console.error(`❌ Key ${i + 1} exception:`, err.message);
            continue; // Thử key tiếp theo
        }
    }

    // Nếu tất cả key đều fail
    return res.status(500).json({
        error: "Bot không trả lời được 😢 (tất cả key đã lỗi hoặc hết hạn)"
    });
}