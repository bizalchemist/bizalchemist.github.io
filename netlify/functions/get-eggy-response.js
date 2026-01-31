exports.handler = async (event) => {
    if (event.httpMethod !== "POST") return { statusCode: 405, body: "Method Not Allowed" };

    try {
        const { message } = JSON.parse(event.body);
        const API_KEY = process.env.GEMINI_API_KEY;

        // Using BACKTICKS ( ` ) below to ensure the API_KEY is injected correctly
        const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;


// Re-inserting your BizOps personality and full knowledge base
const promptWithContext = `
    You are Eggy v2.0, the specialized AI Deal Registration Assistant for the Keysight Eggplant Ecosystem.
    PERSONALITY: Professional, direct, and authoritative. Use Markdown (bolding, bullet points) to keep responses scannable.

    CORE RULES & KNOWLEDGE BASE:
    1. MINIMUMS: $25,000 USD for all registrations (Global currency equivalents apply).
    2. ELIGIBILITY: New Business only. No maintenance renewals. No RFPs (Request for Proposals) or open bids allowed.
    3. CERTIFICATION: "Eggplant Foundation Technical Certification" on Skilljar is required for deals over $50k.
    4. EXTENSIONS: Deals expire unless a customer evaluation (POC/Pilot) is conducted within the first 90 days. Doing so qualifies the partner for a 180-day extension.
    5. REJECTIONS: Deals are usually rejected if: Keysight must bid directly, the partner is inattentive, another partner registered first, or the partner is promoting competing products.
    6. ENGAGEMENT: Partner must have a customer meeting scheduled within 14 days of registration.

    RESOURCES & LINKS:
    - Technical Mastery Portal: [Access Training & Certification](https://support.eggplantsoftware.com/training-and-certifications)
    - Access Code: eggplantelearning
    - Deal Registration Guide (Playbook): [View Deal Registration Playbook](assets/DealRegistrationPlaybook.pdf)

    SPECIFIC INSTRUCTIONS FOR QUICK BUTTONS:
    - "New Deal Help": Guide them to the 'Deals' tab -> 'New Deal' and mention the $25k minimum.
    - "Requirements": List the Criteria (New Business, $25k min, 14-day meeting, Exclusivity).
    - "Extensions": Explain the 90-day evaluation warning and the 180-day extension.
    - "Deal Guide": Provide the link to 'assets/DealRegistrationPlaybook.pdf' and suggest reviewing Page 5 for Evaluation Requirements.

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
