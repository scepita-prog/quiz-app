// admin.js

let questions = [];  // tu sa načítajú otázky z data_json
let currentIndex = 0;

// Funkcia na načítanie CSV / JSON z Google Sheets
async function loadQuestions() {
  try {
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRaFYIrdfA-TdCOqs3VXXQ_dqFWQV4NFnoYdfqtHHmJJi08bW8bR8JXm1hVfgkuEStZuzxf06C9-oq6/pub?gid=1156586239&single=true&output=csv');
    const text = await response.text();
    const rows = text.split('\n').slice(1); // preskocime header
    questions = rows.map(r => {
      const cols = r.split(',');
      try {
        return JSON.parse(cols[18]); // stlpec S / data_json
      } catch (e) {
        console.error('Chyba pri parsovani JSON:', cols[18]);
        return null;
      }
    }).filter(q => q !== null);
    showQuestion(currentIndex);
  } catch (err) {
    console.error('Chyba pri nacitani otazok:', err);
  }
}

// Funkcia na zobrazenie otazky
function showQuestion(index) {
  const container = document.getElementById('quiz-container');
  if (index >= questions.length) {
    container.innerHTML = '<h2>Koniec otázok</h2>';
    return;
  }

  const q = questions[index];
  let html = `<h2>Otázka ${index + 1}</h2>`;
  html += `<p>${q.text}</p>`; // text otázky

  switch (q.type) {
    case "ABC":
    case "MULTI":
      html += `<p>Možnosti: ${q.options.join(' | ')}</p>`;
      html += `<p>Správna odpoveď: ${q.correct.join(', ')}</p>`;
      break;

    case "TF":
      html += `<p>Možnosti: ${q.options.join(' | ')}</p>`;
      html += `<p>Správna odpoveď: ${q.correct.join(', ')}</p>`;
      break;

    case "TEXT":
      html += `<p>Správna odpoveď: ${q.correct}</p>`;
      break;

    case "ORDER":
      html += `<p>Možnosti: ${q.options.join(' | ')}</p>`;
      html += `<p>Správne poradie: ${q.correctOrder.join(', ')}</p>`;
      break;

    case "MATCH":
      html += `<p>Left: ${q.left.join(', ')}</p>`;
      html += `<p>Right: ${q.right.join(', ')}</p>`;
      html += `<p>Správne páry: ${q.pairs.join(', ')}</p>`;
      break;
  }

  container.innerHTML = html;
}

// Funkcia na prepnutie na dalsiu otazku
function nextQuestion() {
  currentIndex++;
  showQuestion(currentIndex);
}

// Inicializacia po nacitani stranky
window.addEventListener('DOMContentLoaded', () => {
  loadQuestions();

  // tlacidlo dalsia otazka
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', nextQuestion);
  }
});
