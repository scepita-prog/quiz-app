const sheetCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaFYIrdfA-TdCOqs3VXXQ_dqFWQV4NFnoYdfqtHHmJJi08bW8bR8JXm1hVfgkuEStZuzxf06C9-oq6/pub?gid=1156586239&single=true&output=csv';

let questions = [];
let currentIndex = 0;

async function loadQuestions() {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "Načítavam otázky…";

  try {
    const response = await fetch(sheetCSV);
    const text = await response.text();

    const rows = text.split("\n").slice(1); // bez hlavičky

    questions = rows.map(row => {
      if (!row.includes("{")) return null;

      // TEXT otázky (stĺpec G)
      const cols = row.split(",");
      const questionText = cols[6];

      // JSON zo stĺpca S — berieme celý objekt
      const jsonStart = row.indexOf("{");
      const jsonEnd = row.lastIndexOf("}") + 1;
      const jsonString = row.substring(jsonStart, jsonEnd);

      try {
        const data = JSON.parse(jsonString);
        data.text = questionText;
        return data;
      } catch (e) {
        console.log("JSON error:", jsonString);
        return null;
      }
    }).filter(q => q !== null);

    if (questions.length === 0) {
      container.innerHTML = "Nenašli sa žiadne otázky";
      return;
    }

    showQuestion(currentIndex);

  } catch (err) {
    container.innerHTML = "Chyba načítania dát";
    console.error(err);
  }
}

function showQuestion(index) {
  const container = document.getElementById("quiz-container");

  if (index >= questions.length) {
    container.innerHTML = "<h2>Koniec otázok</h2>";
    return;
  }

  const q = questions[index];

  let html = `<h2>Otázka ${index + 1}</h2>`;
  html += `<p>${q.text}</p>`;

  if (q.options) {
    html += "<ul>";
    q.options.forEach(opt => html += `<li>${opt}</li>`);
    html += "</ul>";
  }

  if (q.type === "MATCH") {
    html += `<p>Spájanie:</p>`;
    html += `<p>${q.left.join(", ")} ↔ ${q.right.join(", ")}</p>`;
  }

  container.innerHTML = html;
}

function nextQuestion() {
  currentIndex++;
  showQuestion(currentIndex);
}

window.onload = () => {
  loadQuestions();
  document.getElementById("next-btn").onclick = nextQuestion;
};
