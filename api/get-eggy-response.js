const axios = require('axios');

module.exports = async (req, res) => {
    // Vercel parses the body automatically
    const { message } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    const promptWithContext = `You are Eggy v2.0 for Keysight Eggplant. User Question: ${message}`;

    try {
        const response = await axios.post(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            { contents: [{ parts: [{ text: promptWithContext }] }] }
        );
        const aiReply = response.data.candidates[0].content.parts[0].text;
        res.status(200).json({ reply: aiReply });
    } catch (error) {
        res.status(500).json({ reply: "Connection failed." });
    }
};
