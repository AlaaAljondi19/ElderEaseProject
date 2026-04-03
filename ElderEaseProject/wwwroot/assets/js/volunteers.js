/* === volunteers.js === */

function filterVol(btn, specialty) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#volunteersGrid [data-specialty]').forEach(card => {
      card.style.display = (specialty === 'all' || card.dataset.specialty === specialty) ? '' : 'none';
    });
  }

  function openContactModal(name) {
    document.getElementById('volunteerName').value = name;
    document.getElementById('volNameDisplay').value = name;
    document.getElementById('volMsgSuccess').classList.add('d-none');
    document.getElementById('volContactForm').reset();
    document.getElementById('volNameDisplay').value = name;
    new bootstrap.Modal(document.getElementById('contactVolModal')).show();
  }

  function sendVolMsg(e) {
    e.preventDefault();
    /*
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    fetch('/api/VolunteerMessages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => { if(r.ok) document.getElementById('volMsgSuccess').classList.remove('d-none'); });
    */
    // للعرض فقط
    document.getElementById('volMsgSuccess').classList.remove('d-none');
    e.target.reset();
  }
