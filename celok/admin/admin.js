// admin.js

// CSV URL z Google Sheets (stĺpec S obsahuje JSON)
const sheetCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaFYIrdfA-TdCOqs3VXXQ_dqFWQV4NFnoYdfqtHHmJJi08bW8bR8JXm1hVfgkuEStZuzxf06C9-oq6/pub?gid=1156586239&single=true&output=csv';

let questions = [];
let currentIndex = 0;

// Načítanie CSV a konverzia stĺpca S do objektov
async function loadQuestions() {
  const res = await fetch(sheetCSV);
  const text = await res.text();
  const rows = text.split('\n');

  // predpokladáme, že stĺpec S je 19. stĺpec (index 18)
  questions = rows.slice(1)
    .map(r => r.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/)) // rozdelí CSV správne, aj s čiarkami v textoch
    .map(r => {
      try { return JSON.parse(r[18]); } catch { return null; }
    })
    .filter(x => x);
}

// Zobrazenie aktuálnej otázky
function showQuestion(index) {
  const container = document.getElementById('quiz-container');
  const q = questions[index];
  if (!q) {
    container.innerHTML = "<p>Koniec otázok</p>";
    return;
  }

  let html = `<h2>Otázka ${index + 1}</h2>`;

  // zobrazíme text otázky ak je
  if (q.text) html += `<p>${q.text}</p>`;

  switch(q.type) {
    case "ABC":
    case "TF":
    case "MULTI":
      html += "<ul>";
      q.options.forEach((opt, i) => {
        html += `<li>${String.fromCharCode(65+i)}: ${opt}</li>`;
      });
      html += "</ul>";
      break;

    case "TEXT":
      html += `<p>Správna odpoveď: ${q.correct}</p>`;
      break;

    case "ORDER":
      html += "<ul>";
      q.options.forEach((opt, i) => {
        html += `<li>${String.fromCharCode(65+i)}: ${opt}</li>`;
      });
      html += "</ul>";
      html += `<p>Správne poradie: ${q.correctOrder.join(', ')}</p>`;
      break;

    case "MATCH":
      html += "<p>Spárované dvojice:</p><ul>";
      q.left.forEach((l, i) => {
        html += `<li>${l} → ${q.right[i]}</li>`;
      });
      html += "</ul>";
      html += `<p>Správne páry: ${q.pairs.join(', ')}</p>`;
      break;
  }

  container.innerHTML = html;
}

// Prepnutie na ďalšiu otázku
function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    showQuestion(currentIndex);
  } else {
    const container = document.getElementById('quiz-container');
    container.innerHTML = "<p>Všetky otázky zobrazené.</p>";
  }
}

// Inicializácia po načítaní stránky
window.onload = async () => {
  await loadQuestions();
  showQuestion(currentIndex);

  // pridanie tlačidla “Ďalšia otázka”
  const btn = document.createElement("button");
  btn.textContent = "Ďalšia otázka";
  btn.style.marginTop = "20px";
  btn.style.padding = "10px 20px";
  btn.onclick = nextQuestion;
  document.body.appendChild(btn);
};
