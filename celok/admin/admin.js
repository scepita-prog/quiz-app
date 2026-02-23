const sheetCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaFYIrdfA-TdCOqs3VXXQ_dqFWQV4NFnoYdfqtHHmJJi08bW8bR8JXm1hVfgkuEStZuzxf06C9-oq6/pub?gid=1156586239&single=true&output=csv';

let questions = [];
let currentIndex = 0;

window.onload = async () => {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "Načítavam otázky…";

  const res = await fetch(sheetCSV);
  const text = await res.text();

  const rows = text.split("\n").slice(1);

  questions = rows
    .map(row => {
      const cols = parseCSVRow(row);
      if (!cols[18]) return null;

      let json = cols[18].trim();

      // odstrániť vonkajšie úvodzovky
      if (json.startsWith('"') && json.endsWith('"')) {
        json = json.slice(1, -1);
      }

      // opraviť zdvojené úvodzovky
      json = json.replace(/""/g, '"');

      try {
        return JSON.parse(json);
      } catch (e) {
        console.log("JSON chyba:", json);
        return null;
      }
    })
    .filter(q => q !== null);

  if (questions.length === 0) {
    container.innerHTML = "Nenašli sa žiadne otázky.";
    return;
  }

  renderQuestion();
};

function parseCSVRow(row) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < row.length; i++) {
    const char = row[i];

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      result.push(current);
      current = "";
      continue;
    }

    current += char;
  }

  result.push(current);
  return result;
}

function renderQuestion() {
  const q = questions[currentIndex];
  const container = document.getElementById("quiz-container");

  let html = `<h2>${q.text}</h2>`;

  if (q.options) {
    html += "<ul>";
    q.options.forEach(opt => {
      html += `<li>${opt}</li>`;
    });
    html += "</ul>";
  }

  if (q.left) {
    html += "<div>";
    q.left.forEach((l, i) => {
      html += `<p>${l} — ${q.right[i]}</p>`;
    });
    html += "</div>";
  }

  html += `
    <br>
    <button onclick="prevQuestion()">⬅ Predošlá</button>
    <button onclick="nextQuestion()">Ďalšia ➡</button>
  `;

  container.innerHTML = html;
}

function nextQuestion() {
  if (currentIndex < questions.length - 1) {
    currentIndex++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestion();
  }
}
