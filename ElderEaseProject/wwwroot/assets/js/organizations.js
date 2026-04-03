/* === organizations.js === */

function filterOrg(btn, type) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#orgsGrid [data-type]').forEach(card => {
      card.style.display = (type === 'all' || card.dataset.type === type) ? '' : 'none';
    });
  }
  function searchOrgs() {
    const q = document.getElementById('orgSearch').value.toLowerCase();
    document.querySelectorAll('#orgsGrid [data-type]').forEach(card => {
      card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  }
