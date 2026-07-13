// Admin tours list: drag-and-drop + up/down button reordering.
// Both interaction paths funnel into persistOrder(), which reads the
// current row order straight from the DOM (tr[data-id], in document
// order) rather than tracking positions separately in JS state — this
// guarantees drag-drop and button clicks can never disagree about what
// "the new order" is, since the DOM itself is the single source of truth.
(function () {
  const tbody = document.getElementById('tours-tbody');
  if (!tbody) return;

  let draggedRow = null;
  // Every <tr> has draggable="true" so a drag CAN start from anywhere in
  // the row, but we only want it to actually start when the user grabs
  // the handle — otherwise dragging text or clicking Edit/Delete could
  // misfire a row drag. Track handle mousedown and veto dragstart if it
  // didn't originate there.
  let allowDrag = false;

  tbody.addEventListener('mousedown', function (e) {
    allowDrag = !!e.target.closest('.drag-handle');
  });

  tbody.addEventListener('dragstart', function (e) {
    const row = e.target.closest('tr');
    if (!row || !allowDrag) {
      e.preventDefault();
      return;
    }
    draggedRow = row;
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', row.dataset.id); // required by Firefox to allow the drag
    row.classList.add('dragging');
  });

  tbody.addEventListener('dragover', function (e) {
    e.preventDefault(); // required to allow a drop to fire at all
    if (!draggedRow) return;
    const targetRow = e.target.closest('tr');
    if (!targetRow || targetRow === draggedRow) return;
    const rect = targetRow.getBoundingClientRect();
    const isBeforeMidpoint = e.clientY - rect.top < rect.height / 2;
    tbody.insertBefore(draggedRow, isBeforeMidpoint ? targetRow : targetRow.nextSibling);
  });

  tbody.addEventListener('drop', function (e) {
    e.preventDefault();
  });

  tbody.addEventListener('dragend', function () {
    if (draggedRow) draggedRow.classList.remove('dragging');
    draggedRow = null;
    allowDrag = false;
    persistOrder();
  });

  tbody.addEventListener('click', function (e) {
    const upBtn = e.target.closest('.move-up-btn');
    const downBtn = e.target.closest('.move-down-btn');
    if (!upBtn && !downBtn) return;

    const row = e.target.closest('tr');
    let moved = false;

    if (upBtn) {
      const prev = row.previousElementSibling;
      if (prev) {
        tbody.insertBefore(row, prev);
        moved = true;
      }
    } else {
      const next = row.nextElementSibling;
      if (next) {
        tbody.insertBefore(next, row);
        moved = true;
      }
    }

    if (moved) persistOrder();
  });

  function persistOrder() {
    const orderedIds = Array.from(tbody.querySelectorAll('tr')).map(function (row) {
      return Number(row.dataset.id);
    });

    fetch('/api/v1/admin/tours/reorder', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include', // same-origin cookie auth applies automatically; explicit for clarity
      body: JSON.stringify({ orderedIds: orderedIds }),
    })
      .then(function (res) {
        if (!res.ok) throw new Error('Reorder request failed with status ' + res.status);
        return res.json();
      })
      .catch(function (err) {
        // DOM is already reordered optimistically; on failure just warn —
        // there's no toast/notification system elsewhere in this admin UI,
        // so console.error + alert() matches the existing simplicity level.
        console.error('Failed to save new tour order:', err);
        alert('Could not save the new order. Please refresh the page and try again.');
      });
  }
})();
