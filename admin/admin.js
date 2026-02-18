const questions = [
  {
    "otazkaID": "ved-001",
    "text": "Koľko je 5 + 5?",
    "moznosti": [
      {"id": "A", "text": "10"},
      {"id": "B", "text": "25"},
      {"id": "C", "text": "36"},
      {"id": "D", "text": "15"}
    ]
  },
  {
    "otazkaID": "ved-002",
    "text": "12 + 5 = 17?",
    "moznosti": [
      {"id": "A", "text": "Áno"},
      {"id": "B", "text": "Nie"}
    ]
  },
  {
    "otazkaID": "ved-003",
    "text": "Ako sa máš?",
    "moznosti": [
      {"id": "A", "text": "Dobre"},
      {"id": "B", "text": "Zle"}
    ]
  }
];

let currentIndex = 0;

function renderQuestion() {
  const container = document.getElementById("current-question");
  const q = questions[currentIndex];
  container.innerHTML = `<h2>${q.text}</h2>`;
  if (q.moznosti) {
    const ul = document.createElement("ul");
    q.moznosti.forEach(opt => {
      const li = document.createElement("li");
      li.textContent = `${opt.id}: ${opt.text}`;
      li.style.fontSize = "1.5em";
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }
}

// tlačidlo ďalšia otázka
document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex++;
  if (currentIndex >= questions.length) currentIndex = 0; // cyklus späť na začiatok
  renderQuestion();
  updateTV(); // funkcia, ktorá pošle otázku na TV
});

// prvé vykreslenie
renderQuestion();

// --- funkcia pre TV ---
function updateTV() {
  // zatiaľ len console.log, neskôr pošleme fetch/WebSocket
  console.log("Otázka poslaná na TV:", questions[currentIndex]);
}

