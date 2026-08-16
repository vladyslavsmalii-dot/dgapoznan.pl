export default async function handler(req, res) {
    const telegramMessage = "ТЕСТ КИРИЛЛИЦЫ: Привет мир! Проверка UTF-8";

    try {
        const response = await fetch(
            `https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendMessage`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json; charset=UTF-8"
                },
                body: JSON.stringify({
                    chat_id: process.env.CHAT_ID,
                    text: telegramMessage
                })
            }
        );

        const result = await response.json();

        return res.status(200).json(result);

    } catch (error) {
        return res.status(500).json({
            error: error.message
        });
    }
}
