const { GoogleGenerativeAI } = require("@google/generative-ai");

exports.handler = async (event) => {
    // Security: Only allow POST requests
    if (event.httpMethod !== "POST") {
        return { statusCode: 405, body: "Method Not Allowed" };
    }

    try {
        // This variable is pulled from your Netlify Dashboard settings
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        
        // 2026 Model Version
        const model = genAI.getGenerativeModel({ 
            model: "gemini-1.5-flash", // or "gemini-2.0-flash-exp"
            
            // --- YOUR CRITICAL SYSTEM INSTRUCTIONS GO HERE ---
            systemInstruction: `
                You are Eggy v2.0, the specialized AI Deal Registration Assistant for the Keysight Eggplant Ecosystem.
                
                YOUR PERSONALITY:
                Professional, efficient, and direct. You represent a high-stakes engineering partner ecosystem. 
                
                COMPLIANCE RULES:
                1. Minimum Threshold: Only deals above $25,000 USD (or local equivalent) are eligible for registration. If a user mentions a lower amount, explain the threshold politely.
                2. RFP Exclusion: Clearly state that any deals already in the Request for Proposal (RFP) stage are excluded from registration.
                3. Lead Lifecycle: Guide users through the Sales Readiness and Technical Mastery stages you architected in 2024.
                
                CONTEXT:
                You have access to the 'certification-to-revenue' framework. Your goal is to move partners from learning to revenue generation.
            `
        });
        
        const requestBody = JSON.parse(event.body);
        const userMessage = requestBody.message;

        // Generate the AI response
        const result = await model.generateContent(userMessage);
        const responseText = result.response.text();

        return {
            statusCode: 200,
            headers: { 
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*" // Allows your GitHub Pages site to talk to this function
            },
            body: JSON.stringify({ reply: responseText }),
        };

    } catch (error) {
        console.error("AI Proxy Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to process AI request" }),
        };
    }
};
