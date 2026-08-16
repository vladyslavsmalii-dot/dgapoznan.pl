export default async function handler(req, res) {
    res.setHeader("Content-Type", "application/json; charset=utf-8");

    if (req.method !== "POST") {
        return res.status(405).json({
            success: false,
            message: "Method not allowed"
        });
    }

    try {
        const { name, phone, email, message } = req.body;

        const telegramMessage = `
📩 Новая заявка

👤 Имя: ${name || "Не указано"}
📞 Телефон: ${phone || "Не указано"}
✉️ Email: ${email || "Не указано"}

💬 Сообщение:
${message || "Не указано"}
        `.trim();

        const response = await fetch(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                },
                body: JSON.stringify({
                    chat_id: process.env.CHAT_ID,
                    text: telegramMessage
                })
            }
        );

        const result = await response.json();

        if (!result.ok) {
            console.error(result);

            return res.status(500).json({
                success: false,
                message: "Telegram error"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Telegram message sent"
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
}
