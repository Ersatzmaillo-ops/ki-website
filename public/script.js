const input = document.getElementById("question");
const button = document.getElementById("send");
const chat = document.getElementById("chat");

let messages = [];

function renderChat() {
  chat.innerHTML = "";

  for (const msg of messages) {
    const row = document.createElement("div");
    row.className = `msg ${msg.role}`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = msg.text;

    row.appendChild(bubble);
    chat.appendChild(row);
  }

  chat.scrollTop = chat.scrollHeight;
}

function addMessage(role, text) {
  messages.push({ role, text });
  renderChat();
}

async function askAI() {
  const question = input.value.trim();
  if (!question) return;

  addMessage("user", question);
  input.value = "";
  input.focus();

  // Platzhalter
  addMessage("assistant", "Lade Antwort...");
  const placeholderIndex = messages.length - 1;

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question })
    });

    const data = await res.json();

    if (!res.ok) {
      messages[placeholderIndex].text =
        "Fehler:\n" + JSON.stringify(data, null, 2);
      renderChat();
      return;
    }

    messages[placeholderIndex].text = data.answer || "Keine Antwort erhalten.";
    renderChat();
  } catch (err) {
    messages[placeholderIndex].text = "Fehler:\n" + err.message;
    renderChat();
  }
}

button.addEventListener("click", askAI);
input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") askAI();
});

// Starttext optional
addMessage("assistant", "Hallo! Stell mir eine Frage.");
