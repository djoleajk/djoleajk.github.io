// Normativi – Artiljerijski program
const baseNormativi = [
  { artikal: "105TF", kalibar: "105mm", taktKovanja_s: 154, kovanje_kom: 140, taktPeskarenja_s: 180, peskarenje_kom: 240, taktSuzavanja_s: 53, suzavanje_kom: 350 },
  { artikal: "122TF", kalibar: "122mm", taktKovanja_s: 154, kovanje_kom: 140, taktPeskarenja_s: 180, peskarenje_kom: 240, taktSuzavanja_s: 53, suzavanje_kom: 350 },
  { artikal: "122GG", kalibar: "122mm", taktKovanja_s: 145, kovanje_kom: 150, taktPeskarenja_s: 180, peskarenje_kom: 240, taktSuzavanja_s: 53, suzavanje_kom: 350 },
  { artikal: "TF152", kalibar: "152mm", taktKovanja_s: 170, kovanje_kom: 130, taktPeskarenja_s: 190, peskarenje_kom: 230, taktSuzavanja_s: 64, suzavanje_kom: 300 },
  { artikal: "M107", kalibar: "155mm", taktKovanja_s: 170, kovanje_kom: 130, taktPeskarenja_s: 190, peskarenje_kom: 230, taktSuzavanja_s: 64, suzavanje_kom: 300 }
];

function getStoredCustomNormativi() {
  try {
    const raw = localStorage.getItem('normativi_custom');
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function saveCustomNormativi(items) {
  localStorage.setItem('normativi_custom', JSON.stringify(items));
}

function getAllNormativi() {
  return [...baseNormativi, ...getStoredCustomNormativi()];
}

function setIfExists(id, value) {
  const el = document.getElementById(id);
  if (el) {
    el.value = value;
  }
}

function detectContext() {
  const path = (location && location.pathname) ? location.pathname : '';
  if (document.getElementById('timePerCycle') && document.getElementById('numberOfMines')) return 'peskarenje';
  if (/ubadanje\.html$/i.test(path) || /italijanka\.html$/i.test(path) || /bem\.html$/i.test(path)) return 'kovanje';
  if (document.getElementById('timePerPiece') && document.getElementById('numberOfPieces')) return 'suzavanje';
  return 'generic';
}

function renderNormativiTable(container, item) {
  const ctx = detectContext();
  let headerCols = '';
  let rowCols = '';
  let minWidth = 'min-width: 760px;';

  if (ctx === 'peskarenje') {
    headerCols = `
          <th>Артикал</th>
          <th>Калибар</th>
          <th>Такт пескарења (сек)</th>
          <th>Пескарење (ком)</th>`;
    rowCols = `
          <td><strong>${item.artikal}</strong></td>
          <td>${item.kalibar}</td>
          <td>${item.taktPeskarenja_s}</td>
          <td>${item.peskarenje_ком ?? item.peskarenje_kom}</td>`;
    minWidth = 'min-width: 420px;';
  } else if (ctx === 'kovanje') {
    headerCols = `
          <th>Артикал</th>
          <th>Калибар</th>
          <th>Такт ковања (сек)</th>
          <th>Ковање (ком)</th>`;
    rowCols = `
          <td><strong>${item.artikal}</strong></td>
          <td>${item.kalibar}</td>
          <td>${item.taktKovanja_s}</td>
          <td>${item.kovanje_ком ?? item.kovanje_kom}</td>`;
    minWidth = 'min-width: 420px;';
  } else if (ctx === 'suzavanje') {
    headerCols = `
          <th>Артикал</th>
          <th>Калибар</th>
          <th>Такт сузавања (сек)</th>
          <th>Сузавање (ком)</th>`;
    rowCols = `
          <td><strong>${item.artikal}</strong></td>
          <td>${item.kalibar}</td>
          <td>${item.taktSuzavanja_s}</td>
          <td>${item.suzavanje_ком ?? item.suzavanje_kom}</td>`;
    minWidth = 'min-width: 420px;';
  } else {
    headerCols = `
          <th>Артикал</th>
          <th>Калибар</th>`;
    rowCols = `
          <td><strong>${item.artikal}</strong></td>
          <td>${item.kalibar}</td>`;
    minWidth = 'min-width: 280px;';
  }

  container.innerHTML = `
    <table class="normativi-table" style="${minWidth}">
      <thead>
        <tr>
          ${headerCols}
        </tr>
      </thead>
      <tbody>
        <tr>
          ${rowCols}
        </tr>
      </tbody>
    </table>
  `;
}

// UI za dodavanje novih артикала uklonjen prema zahtevu

function initNormativiUI() {
  const all = getAllNormativi();

  // Insert UI right above the first .input-section
  const inputSection = document.querySelector('.input-section');
  if (!inputSection) return;

  const host = document.createElement('section');
  host.className = 'normativi-section';
  host.innerHTML = `
    <h3 class="normativi-title">Нормативи</h3>
    <div class="normativi-controls">
      <label for="artikalSelect"><strong>Артикал</strong></label>
      <select id="artikalSelect" class="filter-select"></select>
    </div>
    <div id="normativiTable"></div>
  `;

  inputSection.parentNode.insertBefore(host, inputSection);

  const select = host.querySelector('#artikalSelect');
  const tableHost = host.querySelector('#normativiTable');

  function refreshOptions(selectedArtikal) {
    select.innerHTML = '';
    getAllNormativi().forEach(n => {
      const opt = document.createElement('option');
      opt.value = n.artikal;
      opt.textContent = `${n.artikal} (${n.kalibar})`;
      if (n.artikal === selectedArtikal) opt.selected = true;
      select.appendChild(opt);
    });
  }

  function applySelection(artikal) {
    const item = getAllNormativi().find(n => n.artikal === artikal) || getAllNormativi()[0];
    if (!item) return;
    renderNormativiTable(tableHost, item);

    // Autofill known inputs depending on page
    const ctx = detectContext();
    if (ctx === 'kovanje') {
      setIfExists('timePerPiece', item.taktKovanja_s);
      setIfExists('numberOfPieces', item.kovanje_ком ?? item.kovanje_kom);
    } else if (ctx === 'suzavanje') {
      setIfExists('timePerPiece', item.taktSuzavanja_s);
      setIfExists('numberOfPieces', item.suzavanje_ком ?? item.suzavanje_kom);
    }
    if (ctx === 'peskarenje') {
      setIfExists('timePerCycle', item.taktPeskarenja_s);
      setIfExists('numberOfMines', item.peskarenje_ком ?? item.peskarenje_kom);
    }

    localStorage.setItem('normativ_selected_artikal', item.artikal);
  }

  const saved = localStorage.getItem('normativ_selected_artikal');
  refreshOptions(saved || (all[0] && all[0].artikal));
  applySelection(select.value);

  select.addEventListener('change', () => applySelection(select.value));

  // Forma za dodavanje novih артикала je uklonjena

}

document.addEventListener('DOMContentLoaded', initNormativiUI);


