// admin.js
const sheetCSV = 'https://docs.google.com/spreadsheets/d/19viTCrqEdk0r_B56exdU2PpxMCYMpfrC5yE15MgTAjw/export?format=csv&gid=1156586239';

let questions = [];
let currentIndex = 0;
const container = document.getElementById('question-container');
const nextBtn = document.getElementById('next-btn');

async function loadQuestions() {
  try {
    const res = await fetch(sheetCSV);
    const csvText = await res.text();

    // Použijeme PapaParse, aby sme korektne rozdelili bunky aj s čiarkami
    const parsed = Papa.parse(csvText, { header: true });
    
    questions = parsed.data.map(row => {
      try {
        return JSON.parse(row.data_json);
      } catch(e) {
        console.error('Chyba parsovania JSON v riadku:', row, e);
        return null;
      }
    }).filter(q => q !== null);

    console.log('Načítané otázky:', questions.length);
    if (questions.length > 0) showQuestion(0);
  } catch (err) {
    console.error('Chyba pri načítaní CSV:', err);
    container.textContent = 'Nepodarilo sa načítať otázky.';
  }
}

function showQuestion(index) {
  if (index < 0 || index >= questions.length) return;
  const q = questions[index];

  let html = `<h2>${q.text}</h2>`;
  
  if (q.type === 'ABC' || q.type === 'T/F') {
    html += '<ul>';
    q.options.forEach((opt, i) => {
      html += `<li>${String.fromCharCode(65 + i)}: ${opt}</li>`;
    });
    html += '</ul>';
  } else if (q.type === 'text') {
    html += `<input type="text" placeholder="Odpoveď...">`;
  } else if (q.type === 'zoradenie') {
    html += '<ul>';
    q.options.forEach(opt => {
      html += `<li>${opt}</li>`;
    });
    html += '</ul>';
  } else if (q.type === 'spajanie') {
    html += '<ul>';
    q.left.forEach((leftItem, i) => {
      html += `<li>${leftItem} → ${q.right[i]}</li>`;
    });
    html += '</ul>';
  } else if (q.type === 'kombinacia') {
    html += '<ul>';
    q.options.forEach((opt, i) => {
      html += `<li>${String.fromCharCode(65 + i)}: ${opt}</li>`;
    });
    html += '</ul>';
  }

  container.innerHTML = html;
}

nextBtn.addEventListener('click', () => {
  currentIndex++;
  if (currentIndex >= questions.length) {
    container.innerHTML = '<h2>Koniec otázok</h2>';
    nextBtn.disabled = true;
    return;
  }
  showQuestion(currentIndex);
});

// Načítame otázky pri spustení
loadQuestions();
