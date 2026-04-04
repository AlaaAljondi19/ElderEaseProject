const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const TYPE_BADGES = { medical: 'type-medical', bill: 'type-bill', exam: 'type-exam', general: 'type-general' };
const TYPE_LABELS = { medical: 'طبي', bill: 'فاتورة', exam: 'فحص', general: 'عام' };
const API_URL = '/api/Appointments';

document.addEventListener('DOMContentLoaded', fetchAppointments);

function fetchAppointments() {
    fetch(API_URL)
        .then(r => r.json())
        .then(data => {
            document.getElementById('appointmentsList').innerHTML = '';
            data.forEach(appt => {
                const d = new Date(appt.date);
                appendApptDOM(appt.id, appt.title, appt.type, d.getDate(), MONTHS[d.getMonth()], formatTime(appt.time));
            });
            checkEmpty();
        })
        .catch(err => {
            console.warn("API Simulation: No data found, showing static list.");
            checkEmpty();
        });
}

function addAppt(e) {
    e.preventDefault();
    const title = document.getElementById('apptTitle').value;
    const type = document.getElementById('apptType').value;
    const date = document.getElementById('apptDate').value;
    const time = document.getElementById('apptTime').value;

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ Title: title, Type: type, Date: date, Time: time })
    })
        .then(r => r.json())
        .then(appt => {
            const d = new Date(appt.date);
            appendApptDOM(appt.id, appt.title, appt.type, d.getDate(), MONTHS[d.getMonth()], formatTime(appt.time));
            bootstrap.Modal.getInstance(document.getElementById('addApptModal')).hide();
            document.getElementById('apptForm').reset();
            checkEmpty();
        })
        .catch(err => alert("حدث خطأ أثناء إضافة الموعد"));
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

    if (id) {
        fetch(API_URL + '/' + id, { method: 'DELETE' })
            .then(r => {
                if (r.ok) {
                    item.style.opacity = '0';
                    setTimeout(() => { item.remove(); checkEmpty(); }, 300);
                }
            })
            .catch(err => alert("فشل الحذف من السيرفر"));
    } else {
        item.remove();
        checkEmpty();
    }
}

function checkEmpty() {
    const list = document.getElementById('appointmentsList');
    const hasItems = list.querySelectorAll('.appt-item').length > 0;
    const emptyState = document.getElementById('emptyState');
    if (hasItems) {
        emptyState.classList.add('d-none');
    } else {
        emptyState.classList.remove('d-none');
    }
}

function formatTime(t) {
    if (!t) return "";
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'مساءً' : 'صباحاً'}`;
}