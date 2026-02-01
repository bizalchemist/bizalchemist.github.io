module.exports = async (req, res) => {
    if (req.method !== "POST") return res.status(405).send("Method Not Allowed");

    try {
        const { message } = req.body;
        const API_KEY = process.env.GOOGLE_API_KEY;

        // UPDATED FOR 2026: Using the stable 2.5 Flash model
        const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

        const promptWithContext = `
            You are Eggy v2.0, the specialized AI Deal Registration Assistant for the Keysight Eggplant Ecosystem.
            PERSONALITY: Professional, direct, and authoritative. Use Markdown (bolding, bullet points).

            CORE RULES:
            1. MINIMUMS: $25,000 USD.
            2. ELIGIBILITY: New Business only. No maintenance/RFPs.
            3. CERTIFICATION: Skilljar "Eggplant Foundation Technical Certification" for deals over $50k.
            4. EXTENSIONS: 90-day evaluation requirement for 180-day extension.
            5. REJECTIONS: Duplicate registrations or competing products.
            6. ENGAGEMENT: Customer meeting within 14 days.

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
            // This will tell us if the new model name worked or not
            return res.status(200).json({ reply: `Eggy's Brain says: ${data.error.message}` });
        }

        const replyText = data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: replyText });

    } catch (error) {
        res.status(500).json({ reply: "Connection failed! " + error.message });
    }
};
