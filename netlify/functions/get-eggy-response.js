const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Using 'gemini-1.5-flash' without specific versioning sometimes 
        // helps the SDK find the correct path automatically.
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest",});
        
        const requestBody = JSON.parse(event.body);
        const userMessage = requestBody.message;

        const result = await model.generateContent(userMessage);
        const responseText = result.response.text();

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" 
            },
            body: JSON.stringify({ reply: responseText }),
        };

    } catch (error) {
        console.error("AI Proxy Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
