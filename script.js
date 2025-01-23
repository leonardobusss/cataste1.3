document.addEventListener('DOMContentLoaded', function () {
  const altezzaInput = document.getElementById('altezzaSingola');
  const listaAltezze = document.getElementById('listaAltezze');
  const altezze = [];

  function aggiornaListaAltezze() {
    listaAltezze.innerHTML = '';
    altezze.forEach((altezza, index) => {
      const listItem = document.createElement('li');
      listItem.textContent = `${altezza} m`;

      const editButton = document.createElement('button');
      editButton.textContent = 'Modifica';
      editButton.addEventListener('click', function () {
        const nuovoValore = prompt('Inserisci una nuova altezza:', altezza);
        if (nuovoValore !== null && !isNaN(parseFloat(nuovoValore))) {
          altezze[index] = parseFloat(nuovoValore);
          aggiornaListaAltezze();
        }
      });

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Rimuovi';
      removeButton.addEventListener('click', function () {
        altezze.splice(index, 1);
        aggiornaListaAltezze();
      });

      listItem.appendChild(editButton);
      listItem.appendChild(removeButton);
      listaAltezze.appendChild(listItem);
    });
  }

  altezzaInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      const valore = parseFloat(altezzaInput.value);
      if (!isNaN(valore)) {
        altezze.push(valore);
        altezzaInput.value = '';
        aggiornaListaAltezze();
      }
    }
  });

  document.getElementById('catastaForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const lunghezza = parseFloat(document.getElementById('lunghezza').value);
    const intervallo = parseFloat(document.getElementById('intervallo').value);
    const coefficiente = parseFloat(document.getElementById('coefficiente').value);

    if (altezze.length < 2) {
      alert('Inserisci almeno due altezze per calcolare.');
      return;
    }

    let areaTotale = 0;
    for (let i = 0; i < altezze.length - 1; i++) {
      const h1 = altezze[i];
      const h2 = altezze[i + 1];
      const areaTrapezio = ((h1 + h2) / 2) * intervallo;
      areaTotale += areaTrapezio;
    }
    const volumeTotale = areaTotale * lunghezza * coefficiente;

    document.getElementById('areaResult').textContent = `Area totale della facciata: ${areaTotale.toFixed(2)} m²`;
    document.getElementById('volumeResult').textContent = `Volume totale: ${volumeTotale.toFixed(2)} m³`;
    document.getElementById('results').classList.remove('hidden');

    const ctx = document.getElementById('catastaChart').getContext('2d');
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: altezze.map((_, i) => (i * intervallo).toFixed(1) + 'm'),
        datasets: [{
          label: 'Altezze della catasta',
          data: altezze,
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: true,
          backgroundColor: 'rgba(75, 192, 192, 0.2)'
        }]
      },
      options: {
        scales: {
          x: { title: { display: true, text: 'Distanza (m)' } },
          y: { title: { display: true, text: 'Altezza (m)' } }
        }
      }
    });
  });
});
