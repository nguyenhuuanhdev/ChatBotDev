// Lấy key từ .env
const keys = [
    process.env.GEMINI_KEY_1,
    process.env.GEMINI_KEY_2,
    process.env.GEMINI_KEY_3,
].filter(Boolean);

export default async function handler(req, res) {

    // ===== GET test key =====
    if (req.method === "GET") {
        return res.status(200).json({
            keysConfigured: keys.length,
            keysPreview: keys.map(k => k?.slice(0, 10) + "...")
        });
    }

    // Chỉ cho phép POST
    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const { chatHistory } = req.body;

    if (!chatHistory || !Array.isArray(chatHistory) || chatHistory.length === 0) {
        return res.status(400).json({ error: "chatHistory is required and must be an array" });
    }

    if (keys.length === 0) {
        return res.status(500).json({ error: "No API keys configured" });
    }

    // ===== Thử từng key =====
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        try {
            const response = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        contents: chatHistory,
                        generationConfig: {
                            temperature: 0.9,
                            topK: 40,
                            topP: 0.95,
                            maxOutputTokens: 8192
                        }
                    })
                }
            );

            const status = response.status;
            const raw = await response.text();

            console.log(`🔍 [Key ${i + 1}] Status: ${status}, RAW:`, raw);

            // Parse JSON an toàn
            let data;
            try {
                data = JSON.parse(raw);
            } catch {
                console.warn(`❌ Key ${i + 1} không trả JSON`);
                continue; // Thử key tiếp theo
            }

            // Kiểm tra lỗi API
            if (data?.error) {
                console.warn(`⚠️ Key ${i + 1} API error:`, data.error.message);
                continue;
            }

            // Lấy text output
            const parts = data?.candidates?.[0]?.content?.parts;
            const reply = parts?.find(p => p.text)?.text;

            if (reply) {
                console.log(`✅ Key ${i + 1} OK`);
                return res.status(200).json({
                    reply,
                    raw: data
                });
            }

        } catch (err) {
            console.error(`❌ Key ${i + 1} exception:`, err.message);
            continue; // Thử key tiếp theo
        }
    }

    // Nếu tất cả key fail
    return res.status(500).json({
        error: "Bot không trả lời được 😢 (mọi key Gemini 2.5 đều lỗi hoặc hết hạn)"
    });
}
