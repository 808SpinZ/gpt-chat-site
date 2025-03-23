export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ error: "Missing message in request body" });
  }

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

    if (!data.choices || !data.choices[0]?.message?.content) {
      console.error("OpenAI API did not return expected format:", data);
      return res.status(500).json({ error: "Invalid response from OpenAI" });
    }

    res.status(200).json({ reply: data.choices[0].message.content });

  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Something went wrong talking to OpenAI" });
  }
}