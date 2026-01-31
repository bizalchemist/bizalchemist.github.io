exports.handler = async (event) => {
    // 1. Security check
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        const { message } = JSON.parse(event.body);
        const API_KEY = process.env.GEMINI_API_KEY;

        // 2. We bypass the library and go straight to the STABLE v1 endpoint
        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: message }]
                }]
            })
        });

        const data = await response.json();

        // 3. Handle Quota or API errors gracefully
        if (data.error) {
            return {
                statusCode: data.error.code || 500,
                body: JSON.stringify({ reply: `Eggy's Brain says: ${data.error.message}` })
            };
        }

        // 4. Extract the text safely
        const replyText = data.candidates[0].content.parts[0].text;

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify({ reply: replyText })
        };

    } catch (error) {
        console.error("Function Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ reply: "Connection failed. Eggy is taking a nap!" })
        };
    }
};
