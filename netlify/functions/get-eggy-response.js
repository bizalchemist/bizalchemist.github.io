exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        const { message } = JSON.parse(event.body);
        const API_KEY = process.env.GEMINI_API_KEY;

        // Using BACKTICKS ( ` ) below to ensure the API_KEY is injected correctly
        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;


        // Re-inserting your BizOps personality and compliance rules
        const promptWithContext = `
            You are Eggy v2.0, the specialized AI Deal Registration Assistant for the Keysight Eggplant Ecosystem.
            PERSONALITY: Professional, direct, and authoritative.
            
            RULES: 
            1. Minimum deal value: $25,000 USD (Global currency equivalents apply). 
            2. No RFPs (Request for Proposals) are allowed for registration.
            3. Mandatory certifications: Partners must complete the "Eggplant Foundation Technical Certification" on Skilljar to qualify for deals over $50k.
            4. Whenever you share a link, please use Markdown format like this: [Link Text](URL). This keeps the chat clean and professional.
            
            RESOURCES TO MENTION:
            - Technical Mastery Portal: https://support.eggplantsoftware.com/training-and-certifications
            - Access Code: eggplantelearning
            - Deal Registration Guide: [Download Deal Registration Playbook](assets/DealRegistrationPlaybook.pdf)
            
            SPECIFIC INSTRUCTION:
            When the user asks for the Deal Guide or clicks the "Deal Guide" button, always provide the link to 'assets/DealRegistrationPlaybook.pdf'. This specific filename is required to trigger the correct visual styling.

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
