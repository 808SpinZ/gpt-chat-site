async function sendMessage() {
  const input = document.getElementById("userInput");
  const chatbox = document.getElementById("chatbox");

  const userText = input.value;
  if (!userText) return;

  // Show user message
  chatbox.innerHTML += `<p><strong>You:</strong> ${userText}</p>`;
  input.value = "";

  // Show loading...
  chatbox.innerHTML += `<p><em>GPT is thinking...</em></p>`;
  chatbox.scrollTop = chatbox.scrollHeight;

  try {
    // Send message to backend API
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userText })
    });

    const data = await response.json();

    if (data.reply) {
      chatbox.innerHTML += `<p><strong>GPT:</strong> ${data.reply}</p>`;
    } else {
      chatbox.innerHTML += `<p><strong>GPT:</strong> Something went wrong. Try again.</p>`;
    }

  } catch (error) {
    console.error("Error:", error);
    chatbox.innerHTML += `<p><strong>GPT:</strong> Error contacting server.</p>`;
  }

  chatbox.scrollTop = chatbox.scrollHeight;
}
