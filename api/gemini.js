// Loại bỏ key undefined/null
// Lấy key từ môi trường
const keys = [
    process.env.GEMINI_KEY_1,
    process.env.GEMINI_KEY_2,
    process.env.GEMINI_KEY_3,
].filter(Boolean);

// ➜ Endpoint API
export default async function handler(req, res) {

    // Kiểm tra key đã load chưa
    if (req.method === "GET") {
        return res.status(200).json({
            keysConfigured: keys.length,
            keysPreview: keys.map(k => k?.slice(0, 10) + "...")
        });
    }

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

    // ================================
    //       XOAY 3 KEY
    // ================================
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

            const raw = await response.text();

            // Log debug để xem API trả gì
            console.log(`🔍 [Key ${i + 1}] RAW:`, raw);

            let data;
            try {
                data = JSON.parse(raw);
            } catch {
                console.error(`❌ JSON parse error for key ${i + 1}`);
                continue;
            }

            // ================================
            //     LẤY TEXT OUTPUT (BẢN 2.5)
            // ================================
            const parts = data?.candidates?.[0]?.content?.parts;
            const reply = parts?.find(p => p.text)?.text;

            if (reply) {
                console.log(`✅ Key ${i + 1} OK`);
                return res.status(200).json({
                    reply,
                    raw: data
                });
            }

            // Nếu API trả lỗi quota
            if (data?.error) {
                console.warn(`⚠️ Key ${i + 1} API error:`, data.error.message);
                continue;
            }

        } catch (err) {
            console.error(`❌ Key ${i + 1} exception:`, err.message);
            continue;
        }
    }

    // ================================
    //     TẤT CẢ KEY ĐỀU HỎNG
    // ================================
    return res.status(500).json({
        error: "Bot không trả lời được 😢 (mọi key Gemini 2.5 đều lỗi hoặc hết hạn)"
    });
}

export default async function handler(req, res) {
    // Endpoint test để kiểm tra key
    if (req.method === "GET") {
        return res.status(200).json({
            keysConfigured: keys.length,
            keysPreview: keys.map(k => k ? k.substring(0, 10) + "..." : "missing")
        });
    }

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