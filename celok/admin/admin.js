const sheetCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaFYIrdfA-TdCOqs3VXXQ_dqFWQV4NFnoYdfqtHHmJJi08bW8bR8JXm1hVfgkuEStZuzxf06C9-oq6/pub?gid=1156586239&single=true&output=csv';

let questions = [];
let currentIndex = 0;

async function loadQuestions() {
  const res = await fetch(sheetCSV);
  const text = await res.text();

  // Použijeme PapaParse na správne spracovanie CSV
  const parsed = Papa.parse(text, { header: true });

  // Konvertujeme každý riadok stĺpec "data_json" na objekt
  questions = parsed.data
    .map(row => {
      if (!row.data_json) return null;
      try {
        return JSON.parse(row.data_json);
      } catch (e) {
        console.error("Chyba JSON v riadku", row, e);
        return null;
      }
    })
    .filter(q => q !== null);

  console.log("Načítané otázky:", questions.length);

  if (questions.length > 0) {
    showQuestion(currentIndex);
  } else {
    document.getElementById('quiz-container').innerHTML = 'Žiadne otázky na zobrazenie.';
  }
}

function showQuestion(index) {
  const container = document.getElementById('quiz-container');
  if (index >= questions.length) {
    container.innerHTML = '<h2>Koniec otázok</h2>';
    return;
  }

  const q = questions[index];
  let html = `<h2>Otázka ${index + 1}</h2>`;

  // Typ otázky
  switch (q.type) {
    case "ABC":
    case "MULTI":
      html += `<p>${q.options.join(' | ')}</p>`;
      break;
    case "TF":
      html += `<p>${q.options.join(' | ')}</p>`;
      break;
    case "TEXT":
      html += `<p>${q.correct}</p>`;
      break;
    case "ORDER":
      html += `<p>${q.options.join(' | ')}</p>`;
      break;
    case "MATCH":
      html += `<p>Left: ${q.left.join(', ')}<br>Right: ${q.right.join(', ')}</p>`;
      break;
  }

  container.innerHTML = html;
}

function nextQuestion() {
  currentIndex++;
  showQuestion(currentIndex);
}

// Na tlačidlo "Ďalšia otázka"
document.getElementById('next-btn').addEventListener('click', nextQuestion);

// Načítame otázky po spustení
loadQuestions();
