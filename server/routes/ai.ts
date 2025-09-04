import { RequestHandler } from "express";

const OPENAI_URL = "https://api.openai.com/v1/chat/completions";

export const verifyWithAI: RequestHandler = async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey)
      return res
        .status(500)
        .json({ success: false, message: "OpenAI API key not configured" });

    const { prompt } = req.body as { prompt?: string };
    if (!prompt)
      return res
        .status(400)
        .json({ success: false, message: "prompt required" });

    const response = await fetch(OPENAI_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      const txt = await response.text();
      console.error("OpenAI error:", txt);
      return res
        .status(502)
        .json({ success: false, message: "OpenAI API error", details: txt });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || JSON.stringify(data);

    res.json({ success: true, result: reply });
  } catch (error) {
    console.error("❌ [AI VERIFY] Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
