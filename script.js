const API_KEY = "AIzaSyDmYhdDnkQiqezWizClYXTjcyDNAdochQM";

async function sendMessage() {
  const inputField = document.getElementById("userInput");
  const messagesDiv = document.getElementById("messages");
  const userText = inputField.value.trim();

  if (!userText) return;

  messagesDiv.innerHTML += `<div class="user"><strong>Anda:</strong> ${userText}</div>`;
  inputField.value = "";

  const fullPrompt = `
Anda adalah asisten AI yang hanya menjawab pertanyaan seputar Machine Learning.
Jika pertanyaannya di luar topik, balas dengan "Maaf, saya hanya bisa menjawab pertanyaan seputar Machine Learning."

Pertanyaan: ${userText}
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: fullPrompt }],
            },
          ],
        }),
      }
    );

    const data = await response.json();
    const botReply =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Maaf, terjadi kesalahan.";

    messagesDiv.innerHTML += `<div class="bot"><strong>Bot:</strong> ${botReply}</div>`;
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  } catch (err) {
    messagesDiv.innerHTML += `<div class="bot"><strong>Bot:</strong> Gagal memuat jawaban.</div>`;
    console.error("Error:", err);
  }
}

document.getElementById("userInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
