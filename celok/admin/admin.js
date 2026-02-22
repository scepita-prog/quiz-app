// admin.js

// URL CSV publikovaného Google Sheet
const sheetCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaFYIrdfA-TdCOqs3VXXQ_dqFWQV4NFnoYdfqtHHmJJi08bW8bR8JXm1hVfgkuEStZuzxf06C9-oq6/pub?gid=1156586239&single=true&output=csv';

let questions = []; // pole otázok načítaných zo Sheets
let currentIndex = 0;

// načítanie CSV z Google Sheets a konverzia do JSON
async function loadQuestions() {
  const res = await fetch(sheetCSV);
  const text = await res.text();

  // rozdelíme riadky CSV
  const rows = text.split('\n');

  // predpokladáme, že JSON je v poslednom stĺpci (S, index 18 ak počítame od 0)
  questions = rows.slice(1) // ignorujeme header
    .map(r => r.split(',')[18]) // stĺpec S
    .filter(x => x) // ignorujeme prázdne
    .map(x => JSON.parse(x)); // prevedieme string JSON na objekt
}

// funkcia na zobrazenie aktuálnej otázky
function showQuestion(index) {
  const container = document.getElementById('quiz-container');
  const q = questions[index];

  if (!q) {
    container.innerHTML = "<p>Koniec otázok</p>";
    return;
  }

  let html = `<h2>Otázka ${index+1}</h2>`;

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
      html += `<p>Textová odpoveď: ${q.correct}</p>`;
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

// tlačidlo “Ďalšia otázka”
function nextQuestion() {
  if(currentIndex < questions.length - 1){
    currentIndex++;
    showQuestion(currentIndex);
  } else {
    const container = document.getElementById('quiz-container');
    container.innerHTML = "<p>Všetky otázky zobrazené.</p>";
  }
}

// inicializácia
window.onload = async () => {
  await loadQuestions();
  showQuestion(currentIndex);

  // vytvoríme tlačidlo “Ďalšia otázka”
  const btn = document.createElement("button");
  btn.textContent = "Ďalšia otázka";
  btn.onclick = nextQuestion;
  document.body.appendChild(btn);
};
