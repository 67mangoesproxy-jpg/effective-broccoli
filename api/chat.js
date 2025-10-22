// /api/chat.js
// Created by Bookmarklet Buddy GPT

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { provider, key, message } = req.body;

  if (!provider || !key || !message) {
    return res.status(400).json({ error: "Missing provider, key, or message." });
  }

  try {
    let url, model;
    if (provider === "openai") {
      url = "https://api.openai.com/v1/chat/completions";
      model = "gpt-4o-mini";
    } else if (provider === "deepseek") {
      url = "https://api.deepseek.com/v1/chat/completions";
      model = "deepseek-chat";
    } else {
      return res.status(400).json({ error: "Invalid provider" });
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: message }],
      }),
    });

    const data = await response.json();

    if (data.error) {
      return res.status(400).json({ error: data.error.message });
    }

    const reply =
      data.choices?.[0]?.message?.content || "No reply from AI.";

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
