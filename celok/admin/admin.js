// Link na publikovaný Google Sheet CSV (tvoj)
const sheetCSV = 'https://docs.google.com/spreadsheets/d/19viTCrqEdk0r_B56exdU2PpxMCYMpfrC5yE15MgTAjw/export?format=csv&gid=1156586239';

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
