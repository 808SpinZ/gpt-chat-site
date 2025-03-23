export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { message } = req.body;

  if (!message || typeof message !== "string") {
    console.error("Invalid message received:", message);
    return res.status(400).json({ error: "Invalid message format." });
  }

  console.log("Incoming user message:", message);

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant for music producers." },
          { role: "user", content: message }
        ]
      })
    });

    const data = await openaiRes.json();

    console.log("OpenAI raw response:", JSON.stringify(data, null, 2));

    if (data.error) {
      console.error("OpenAI API Error:", JSON.stringify(data.error, null, 2));
      return res.status(500).json({ error: "OpenAI API error." });
    }

    res.status(200).json({ reply: data.choices[0].message.content });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Something went wrong on the server." });
  }
}