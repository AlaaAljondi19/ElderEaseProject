/* === appointments.js === */

const MONTHS = ['يناير','فبراير','مارس','أبريل','مايو','يونيو','يوليو','أغسطس','سبتمبر','أكتوبر','نوفمبر','ديسمبر'];
  const TYPE_BADGES = { medical:'type-medical', bill:'type-bill', exam:'type-exam', general:'type-general' };
  const TYPE_LABELS = { medical:'طبي', bill:'فاتورة', exam:'فحص', general:'عام' };

  function addAppt(e) {
    e.preventDefault();
    const title = document.getElementById('apptTitle').value;
    const type  = document.getElementById('apptType').value;
    const date  = document.getElementById('apptDate').value;
    const time  = document.getElementById('apptTime').value;

    /*
    fetch('/api/Appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ Title: title, Type: type, Date: date, Time: time })
    })
    .then(r => r.json())
    .then(appt => {
      appendApptDOM(appt.id, appt.title, appt.type, appt.date, appt.time);
      bootstrap.Modal.getInstance(document.getElementById('addApptModal')).hide();
      document.getElementById('apptForm').reset();
    });
    */

    const d = new Date(date);
    appendApptDOM(null, title, type, d.getDate(), MONTHS[d.getMonth()], formatTime(time));
    bootstrap.Modal.getInstance(document.getElementById('addApptModal')).hide();
    document.getElementById('apptForm').reset();
    checkEmpty();
  }

  function appendApptDOM(id, title, type, day, month, timeStr) {
    const badgeClass = TYPE_BADGES[type] || 'type-general';
    const badgeLabel = TYPE_LABELS[type] || 'عام';
    const div = document.createElement('div');
    div.className = 'appt-item';
    if (id) div.dataset.id = id;
    div.innerHTML = `
      <div class="appt-date-box"><span class="day">${day}</span><span class="month">${month}</span></div>
      <div class="appt-info">
        <h6>${title}</h6>
        <div class="appt-meta">
          <span><i class="bi bi-clock"></i> ${timeStr}</span>
          <span class="type-badge ${badgeClass}">${badgeLabel}</span>
        </div>
      </div>
      <div class="appt-actions">
        <button class="btn-del" onclick="deleteAppt(this)"><i class="bi bi-trash3"></i> حذف</button>
      </div>`;
    document.getElementById('appointmentsList').prepend(div);
  }

  function deleteAppt(btn) {
    const item = btn.closest('.appt-item');
    const id = item.dataset.id;
    if (!confirm('هل تريد حذف هذا الموعد؟')) return;

    /*
    if (id) {
      fetch('/api/Appointments/' + id, { method: 'DELETE' }).then(() => { item.remove(); checkEmpty(); });
      return;
    }
    */
    item.style.opacity = '0'; item.style.transition = 'opacity .3s';
    setTimeout(() => { item.remove(); checkEmpty(); }, 300);
  }

  function checkEmpty() {
    const hasItems = document.querySelectorAll('#appointmentsList .appt-item').length > 0;
    document.getElementById('emptyState').classList.toggle('d-none', hasItems);
  }

  function formatTime(t) {
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'مساءً' : 'صباحاً'}`;
  }
