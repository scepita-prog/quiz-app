let questions = []; // pole načítaných otázok
let currentIndex = 0;

// CSV URL (export zo Sheets ako CSV)
const sheetCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaFYIrdfA-TdCOqs3VXXQ_dqFWQV4NFnoYdfqtHHmJJi08bW8bR8JXm1hVfgkuEStZuzxf06C9-oq6/pub?gid=1156586239&single=true&output=csv';

// Funkcia na načítanie CSV a prevod do JSON
async function loadQuestions() {
  const res = await fetch(sheetCSV);
  const text = await res.text();
  const rows = text.split("\n").slice(1); // preskočíme hlavičku

  questions = rows.map(row => {
    try {
      const cols = row.split(','); 
      const jsonStr = cols[18]; // stĺpec S (0-index 18)
      if (!jsonStr) return null;
      return JSON.parse(jsonStr);
    } catch(e) {
      console.error("Chyba pri parsovaní JSON:", e);
      return null;
    }
  }).filter(q => q !== null);

  showQuestion(currentIndex);
}

// Funkcia na zobrazenie otázky
function showQuestion(index) {
  if (index >= questions.length) {
    document.getElementById("question-text").innerText = "Koniec otázok!";
    document.getElementById("options-list").innerHTML = "";
    document.getElementById("next-btn").disabled = true;
    return;
  }

  const q = questions[index];
  const qTextElem = document.getElementById("question-text");
  const optionsList = document.getElementById("options-list");

  // Zobrazenie textu otázky
  qTextElem.innerText = q.type === "TEXT" ? "Napíš odpoveď:" : "Otázka: " + (q.question || ""); // otázka si môžeš doplniť do JSON

  // Vyčistenie predchádzajúcich možností
  optionsList.innerHTML = "";

  // Zobrazenie možností podľa typu
  if (q.type === "ABC" || q.type === "TF" || q.type === "ORDER" || q.type === "MULTI") {
    q.options.forEach((opt, i) => {
      if (!opt) return;
      const li = document.createElement("li");
      li.innerText = opt;
      optionsList.appendChild(li);
    });
  } else if (q.type === "MATCH") {
    const left = q.left;
    const right = q.right;
    for (let i = 0; i < left.length; i++) {
      const li = document.createElement("li");
      li.innerText = `${left[i]} ↔ ${right[i]}`;
      optionsList.appendChild(li);
    }
  } else if (q.type === "TEXT") {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Napíš odpoveď...";
    optionsList.appendChild(input);
  }
}

// Tlačidlo “Ďalšia otázka”
document.getElementById("next-btn").addEventListener("click", () => {
  currentIndex++;
  showQuestion(currentIndex);
});

// Načítanie otázok po spustení
loadQuestions();
