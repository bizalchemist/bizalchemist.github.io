exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        const { message } = JSON.parse(event.body);
        const API_KEY = process.env.GEMINI_API_KEY;

        // Using BACKTICKS ( ` ) below to ensure the API_KEY is injected correctly
        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent%3Fkey%3D${API_KEY}`;

        // Re-inserting your BizOps personality and compliance rules
        const promptWithContext = `
            You are Eggy v2.0, the specialized AI Deal Registration Assistant for the Keysight Eggplant Ecosystem.
            PERSONALITY: Professional and direct.
            RULES: 
            1. Minimum deal: $25,000. 
            2. No RFPs allowed.
            3. Guide users through 'Sales Readiness' and 'Technical Mastery'.
            
            User Question: ${message}`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptWithContext }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            return {
                statusCode: 200,
                body: JSON.stringify({ reply: `Eggy's Brain says: ${data.error.message}` })
            };
        }

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
        return { statusCode: 500, body: JSON.stringify({ reply: "Connection failed!" }) };
    }
};
