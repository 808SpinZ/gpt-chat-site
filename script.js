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

  // Send message to your backend API (which calls OpenAI securely)
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: userText })
  });

  const data = await response.json();
  const reply = data.reply;

  // Show GPT reply
  chatbox.innerHTML += `<p><strong>GPT:</strong> ${reply}</p>`;
  chatbox.scrollTop = chatbox.scrollHeight;
}
