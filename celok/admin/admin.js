const sheetCSV = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRaFYIrdfA-TdCOqs3VXXQ_dqFWQV4NFnoYdfqtHHmJJi08bW8bR8JXm1hVfgkuEStZuzxf06C9-oq6/pub?gid=1156586239&single=true&output=csv';

window.onload = async () => {
  const container = document.getElementById("quiz-container");
  container.innerHTML = "Načítavam surové dáta…";

  const res = await fetch(sheetCSV);
  const text = await res.text();

  const rows = text.split("\n");

  console.log("CELÉ CSV:");
  console.log(text);

  console.log("PRVÝ RIADOK:");
  console.log(rows[1]);

  container.innerHTML = `
    <h3>Načítané riadky: ${rows.length}</h3>
    <p>Otvor konzolu (F12 → Console)</p>
  `;
};
