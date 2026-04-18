const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
    apiKey: "API KEY HERE"
});

// 🚀 SIMPLE CHAT API
app.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: message }
            ]
        });

        const reply = response.choices[0].message.content;

        res.json({ reply });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong" });
    }
});

app.listen(5000, () => {
    console.log("Chat server running on port 5000");
});