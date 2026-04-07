/* === appointments.js - نسخة التنبيهات الحمراء الشاملة === */

const MONTHS = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
const TYPE_BADGES = { medical: 'type-medical', bill: 'type-bill', exam: 'type-exam', general: 'type-general' };
const TYPE_LABELS = { medical: 'طبي', bill: 'فاتورة', exam: 'فحص', general: 'عام' };

document.addEventListener('DOMContentLoaded', () => {
    loadAppointmentsFromServer();
});

async function loadAppointmentsFromServer() {
    const list = document.getElementById('appointmentsList');
    try {
        const appointments = [
            { id: 1, title: 'موعد طبي - مستشفى المدينة', type: 'medical', date: '2026-04-15', time: '10:30' },
            { id: 2, title: 'دفع فاتورة الكهرباء', type: 'bill', date: '2026-04-20', time: '14:00' }
        ];

        if (list) list.innerHTML = '';

        appointments.forEach(appt => {
            const d = new Date(appt.date);
            appendApptDOM(appt.id, appt.title, appt.type, d.getDate(), MONTHS[d.getMonth()], formatTime(appt.time));
        });

        checkEmpty();
    } catch (error) {
        console.error("خطأ في جلب المواعيد:", error);
    }
}

// الدالة المعدلة بالكامل للتحقق من الحقول
async function addAppt(e) {
    e.preventDefault(); // منع المتصفح من إظهار رسائله البرتقالية

    // 1. جلب المدخلات
    const titleInput = document.getElementById('apptTitle');
    const dateInput = document.getElementById('apptDate');
    const timeInput = document.getElementById('apptTime');

    // 2. جلب رسائل الخطأ
    const titleError = document.getElementById('apptTitleError');
    const dateError = document.getElementById('apptDateError');
    const timeError = document.getElementById('apptTimeError');

    let isValid = true;

    // فحص حقل الاسم
    if (titleInput.value.trim() === "") {
        titleError.style.display = "block";
        titleInput.style.borderColor = "red";
        isValid = false;
    } else {
        titleError.style.display = "none";
        titleInput.style.borderColor = "";
    }

    // فحص حقل التاريخ
    if (dateInput.value === "") {
        dateError.style.display = "block";
        dateInput.style.borderColor = "red";
        isValid = false;
    } else {
        dateError.style.display = "none";
        dateInput.style.borderColor = "";
    }

    // فحص حقل الوقت
    if (timeInput.value === "") {
        timeError.style.display = "block";
        timeInput.style.borderColor = "red";
        isValid = false;
    } else {
        timeError.style.display = "none";
        timeInput.style.borderColor = "";
    }

    // إذا وجد أي حقل فارغ، توقف فوراً
    if (!isValid) return;

    // 3. إذا كانت البيانات مكتملة، نفذ الإضافة
    try {
        const title = titleInput.value;
        const type = document.getElementById('apptType').value;
        const date = dateInput.value;
        const time = timeInput.value;

        const d = new Date(date);
        appendApptDOM(Date.now(), title, type, d.getDate(), MONTHS[d.getMonth()], formatTime(time));

        bootstrap.Modal.getInstance(document.getElementById('addApptModal')).hide();
        document.getElementById('apptForm').reset();
        checkEmpty();

    } catch (error) {
        alert("حدث خطأ أثناء حفظ الموعد");
    }
}

function appendApptDOM(id, title, type, day, month, timeStr) {
    const badgeClass = TYPE_BADGES[type] || 'type-general';
    const badgeLabel = TYPE_LABELS[type] || 'عام';
    const div = document.createElement('div');
    div.className = 'appt-item';
    if (id) div.dataset.id = id;

    div.innerHTML = `
      <div class="appt-date-box">
        <span class="day">${day}</span>
        <span class="month">${month}</span>
      </div>
      <div class="appt-info">
        <h6>${title}</h6>
        <div class="appt-meta">
          <span><i class="bi bi-clock"></i> ${timeStr}</span>
          <span class="type-badge ${badgeClass}">${badgeLabel}</span>
        </div>
      </div>
      <div class="appt-actions">
        <button class="btn-del" onclick="deleteAppt(this)">
            <i class="bi bi-trash3"></i> حذف
        </button>
      </div>`;

    document.getElementById('appointmentsList').prepend(div);
}

async function deleteAppt(btn) {
    const item = btn.closest('.appt-item');
    if (!confirm('تنبيه: هل أنت متأكد من حذف هذا الموعد؟')) return;

    item.style.opacity = '0';
    item.style.transition = 'opacity .3s';
    setTimeout(() => {
        item.remove();
        checkEmpty();
    }, 300);
}

function checkEmpty() {
    const hasItems = document.querySelectorAll('#appointmentsList .appt-item').length > 0;
    const emptyState = document.getElementById('emptyState');
    if (emptyState) {
        emptyState.classList.toggle('d-none', hasItems);
    }
}

function formatTime(t) {
    const [h, m] = t.split(':');
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'مساءً' : 'صباحاً'}`;
}