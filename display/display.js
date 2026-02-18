async function fetchQuestion() {
  // statický JSON súbor prvej otázky
  const response = await fetch("question.json");
  const q = await response.json();

  renderQuestion(q);
}

function renderQuestion(q) {
  const container = document.getElementById("quiz-container");
  container.innerHTML = ""; // vyčisti predchádzajúce

  const title = document.createElement("h1");
  title.textContent = `Kvíz: ${q.kvizNazov} | Kolo ${q.kolo}`;
  container.appendChild(title);

  const h2 = document.createElement("h2");
  h2.textContent = q.text;
  container.appendChild(h2);

  if (q.moznosti) {
    const ul = document.createElement("ul");
    q.moznosti.forEach(opt => {
      const li = document.createElement("li");
      li.textContent = `${opt.id}: ${opt.text}`;
      li.style.fontSize = "2em"; // väčšie písmo pre TV
      ul.appendChild(li);
    });
    container.appendChild(ul);
  }

  if (q.media) {
    const img = document.createElement("img");
    img.src = q.media;
    img.style.maxWidth = "600px";
    container.appendChild(img);
  }
}

// zavolaj hned pri načítaní
fetchQuestion();
