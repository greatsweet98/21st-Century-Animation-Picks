document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('inducteeTable');
  const headers = table.querySelectorAll('thead tr:nth-child(2) th');
  const tbody = table.querySelector('tbody');
  let rows = Array.from(tbody.querySelectorAll('tr'));

  // preserve original order
  const originalRows = [...rows];

  headers.forEach((header, headerIndex) => {
    // Only attach sorting behavior to headers marked .sortable
    if (!header.classList.contains('sortable')) {
      header.style.cursor = 'default';
      return;
    }

    header.setAttribute('role', 'button');
    header.tabIndex = 0; // keyboard-accessible

    header.addEventListener('click', () => {
      const currentSort = header.getAttribute('aria-sort') || 'none';
      let newSort = 'ascending';
      if (currentSort === 'ascending') newSort = 'descending';
      else if (currentSort === 'descending') newSort = 'none';

      // reset others
      headers.forEach(h => h.setAttribute('aria-sort', 'none'));
      header.setAttribute('aria-sort', newSort);

      // refresh rows from DOM (in case table changed)
      rows = Array.from(tbody.querySelectorAll('tr'));

      let sortedRows;
      if (newSort === 'ascending') sortedRows = sortRows(rows, headerIndex, 1);
      else if (newSort === 'descending') sortedRows = sortRows(rows, headerIndex, -1);
      else sortedRows = originalRows;

      tbody.append(...sortedRows);
    });

    // keyboard support
    header.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });
  });

  function sortRows(rowsArray, index, direction) {
    return [...rowsArray].sort((a, b) => {
      // If sorting by the first column (Debuting Years) prefer the row's data-date attribute
      if (index === 0) {
        const aDate = a.dataset.date ? Date.parse(a.dataset.date) : parseDateFromCell(a.children[index]);
        const bDate = b.dataset.date ? Date.parse(b.dataset.date) : parseDateFromCell(b.children[index]);
        return direction * ((aDate || 0) - (bDate || 0));
      }

      // guard against missing children cells
      const aCell = a.children[index] ?? a.querySelectorAll('td, th')[index];
      const bCell = b.children[index] ?? b.querySelectorAll('td, th')[index];

      const aText = aCell && aCell.textContent ? aCell.textContent.trim() : '';
      const bText = bCell && bCell.textContent ? bCell.textContent.trim() : '';

      // try numeric compare first
      const numA = parseFloat(aText.replace(/[^0-9.\-]/g, ''));
      const numB = parseFloat(bText.replace(/[^0-9.\-]/g, ''));

      if (!isNaN(numA) && !isNaN(numB)) return direction * (numA - numB);

      return direction * aText.localeCompare(bText, undefined, { numeric: true, sensitivity: 'base' });
    });
  }

  function parseDateFromCell(cell) {
    if (!cell) return NaN;
    const text = cell.textContent.trim();
    const m = text.match(/([A-Za-z]+\s+\d{1,2},\s*\d{4})/);
    if (m) return Date.parse(m[1]);
    return NaN;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById("inducteeTable");
  const titleHeader = document.getElementById("titleHeader");
  let dir = 0; // 0=normal, 1=asc, -1=desc
  
  function normalizeTitle(title) {
    return title.trim().replace(/^(a|an|the|to)\s+/i, "");
  }
  
  titleHeader.addEventListener("click", () => {
    const tbody = table.tBodies[0];
    let rows = Array.from(tbody.rows);
    
    if (dir === 0) {
      rows.sort((a, b) => normalizeTitle(a.cells[1].innerText).localeCompare(normalizeTitle(b.cells[1].innerText)));
      dir = 1;
    } else if (dir === 1) {
      rows.sort((a, b) => normalizeTitle(b.cells[1].innerText).localeCompare(normalizeTitle(a.cells[1].innerText)));
      dir = -1;
    } else {
      rows = rows.sort((a, b) => 0); // reset to original
      dir = 0;
    }
    rows.forEach(row => tbody.appendChild(row));
  })                      
})

document.addEventListener('DOMContentLoaded', () => {
  const table = document.getElementById('inducteeTable');
  const tbody = table.tBodies[0];
  const yearHeader = document.getElementById('yearHeader');
  const originalRows = Array.from(tbody.rows);
  let sortMode = 0;
  
  yearHeader.addEventListener('click', () => {
    let rows = Array.from(tbody.rows);
    
    if (sortMode === 0) {
      rows.sort((a, b) => {
        let da = new Date(a.dataset.date || "9999-12-31");
        let db = new Date(b.dataset.date || "9999-12-31");
        return da - db;
      });
      sortMode = 1;
    } else if (sortMode === 1) {
      rows.sort((a, b) => {
        let da = new Date(b.dataset.date || "0000-01-01");
        let db = new Date(a.dataset.date || "0000-01-01");
        return da - db;
      });
      sortMode = 2;
    } else {
      rows = originalRows;
      sortMode = 0;
    }
    
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
  })
  
})