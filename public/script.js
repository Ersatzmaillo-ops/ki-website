const input = document.getElementById("question");
    const button = document.getElementById("send");
    const answerDiv = document.getElementById("answer");

    async function askAI() {
      const question = input.value.trim();
      if (!question) return;

      answerDiv.textContent = "Lade Antwort...";

      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question })
      });

      const data = await res.json();

      if (!res.ok) {
        answerDiv.textContent = "Fehler:\n" + JSON.stringify(data, null, 2);
        return;
      }

      answerDiv.textContent = data.answer;
      
    }
    button.addEventListener("click", askAI);
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter"){
      askAI();
      input.value = "";

      } 
    });

    input.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          input.value = "";
          input.focus();
        }
      });
  