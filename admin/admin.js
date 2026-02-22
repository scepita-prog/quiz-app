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
  },// Link na publikovaný Google Sheet CSV (tvoj)
const sheetCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaFYIrdfA-TdCOqs3VXXQ_dqFWQV4NFnoYdfqtHHmJJi08bW8bR8JXm1hVfgkuEStZuzxf06C9-oq6/pub?gid=1156586239&single=true&output=csv';

async function loadQuestions() {
  const res = await fetch(sheetCSV);
  const csvText = await res.text();
  const rows = csvText.split('\n').map(r => r.split(','));
  
  const headers = rows[0];
  const dataJsonIndex = headers.indexOf('data_json');
  
  const questions = rows.slice(1).map(r => {
    try {
      return JSON.parse(r[dataJsonIndex]);
    } catch (e) {
      return null;
    }
  }).filter(q => q !== null);
  
  return questions;
}

let questions = [];
let currentIndex = 0;

function showQuestion(index) {
  const q = questions[index];
  if (!q) return;

  document.getElementById('question-text').innerText = q.text || "Bez textu";

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = '';

  if (q.typ === 'ABC' || q.typ === 'T/F') {
    for (const key of ['A','B','C','D'].filter(k => q[k])) {
      const btn = document.createElement('button');
      btn.innerText = `${key}: ${q[key]}`;
      optionsDiv.appendChild(btn);
    }
  } else if (q.typ === 'text') {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Odpoveď';
    optionsDiv.appendChild(input);
  } else if (q.typ === 'zoradenie' || q.typ === 'spajanie' || q.typ === 'kombinacia') {
    const info = document.createElement('div');
    info.innerText = `Typ otázky "${q.typ}" sa zatiaľ vizualizuje staticky.`;
    optionsDiv.appendChild(info);
  }
}

// Navigácia
document.getElementById('prev-btn').addEventListener('click', () => {
  if (currentIndex > 0) {
    currentIndex--;
    showQuestion(currentIndex);
  }
});

document.getElementById('next-btn').addEventListener('click', () => {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion(currentIndex);
  }
});

// Načítanie otázok pri štarte
loadQuestions().then(qs => {
  questions = qs;
  showQuestion(currentIndex);
});
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

