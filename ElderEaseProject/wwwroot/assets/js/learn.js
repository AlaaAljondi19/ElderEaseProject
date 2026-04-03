/* === learn.js === */

function filterCat(btn, cat) {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.accordion-item').forEach(item => {
      item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
    });
  }

  function searchLessons() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.accordion-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? '' : 'none';
    });
  }
