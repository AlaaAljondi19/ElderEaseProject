const MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const API_URL = "https://localhost:7188/api/Appointments"; // الرابط من صورتك السابقة
let apptToDeleteId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchAppointments();
});

// 1. جلب البيانات (GET) - تغطية مهمة F2
async function fetchAppointments() {
    const loading = document.getElementById('loadingAppts');
    const list = document.getElementById('appointmentsList');
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            const data = await response.json();
            list.innerHTML = '';
            data.forEach(app => {
                const d = new Date(app.date);
                appendApptDOM(app.id, app.title, app.type, d.getDate(), MONTHS[d.getMonth()], app.time);
            });
        }
    } catch (e) { console.log("السيرفر غير متصل، سيتم عرض البيانات المضافة يدوياً"); }
    if (loading) loading.style.display = 'none';
    checkEmpty();
}

// 2. الإضافة (POST) - تغطية مهمة F2
async function addAppt(e) {
    e.preventDefault(); // منع الصفحة من الريفرش

    const title = document.getElementById('apptTitle').value;
    const date = document.getElementById('apptDate').value;
    const time = document.getElementById('apptTime').value;
    const type = document.getElementById('apptType').value;

    // إظهار الأخطاء بنفس أسلوبك الأصلي
    if (!title || !date || !time) {
        if (!title) document.getElementById('apptTitleError').style.display = "block";
        if (!date) document.getElementById('apptDateError').style.display = "block";
        if (!time) document.getElementById('apptTimeError').style.display = "block";
        return;
    }

    // رسم الموعد فوراً (لضمان عمل الزر أمامك الآن)
    const d = new Date(date);
    const tempId = Date.now();
    appendApptDOM(tempId, title, type, d.getDate(), MONTHS[d.getMonth()], time);

    // إرسال للسيرفر في الخلفية
    try {
        fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, date, time, type })
        });
    } catch (error) { console.error("خطأ في الحفظ"); }

    // إغلاق المودال وتفريغ الحقول
    const modalElement = document.getElementById('addApptModal');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) modalInstance.hide();

    document.getElementById('apptForm').reset();
    document.querySelectorAll('.text-danger').forEach(el => el.style.display = 'none');
    checkEmpty();
}

// 3. الحذف (DELETE) - تغطية مهمة F2
async function finishDelete() {
    if (apptToDeleteId) {
        const item = document.getElementById(`appt-${apptToDeleteId}`);
        if (item) item.remove(); // حذف من الشاشة فوراً

        try {
            await fetch(`${API_URL}/${apptToDeleteId}`, { method: 'DELETE' });
        } catch (e) { console.error("خطأ في الحذف من السيرفر"); }

        closeConfirmModal();
        checkEmpty();
    }
}

// --- دالات مساعدة (لا تغيريها) ---
function appendApptDOM(id, title, type, day, month, time) {
    const list = document.getElementById('appointmentsList');
    const typeClasses = { medical: 'type-medical', bill: 'type-bill', exam: 'type-exam', general: 'type-general' };
    const typeIcons = { medical: 'bi-capsule', bill: 'bi-receipt', exam: 'bi-eye', general: 'bi-calendar-event' };
    const typeName = { medical: 'طبي', bill: 'فاتورة', exam: 'فحص', general: 'عام' }[type] || 'عام';

    const html = `
    <div class="appt-item" id="appt-${id}">
      <div class="appt-date-box"><span class="day">${day}</span><span class="month">${month}</span></div>
      <div class="appt-info">
        <h6>${title}</h6>
        <div class="appt-meta">
          <span><i class="bi bi-clock"></i> ${time}</span>
          <span class="type-badge ${typeClasses[type] || 'type-general'}">
            <i class="bi ${typeIcons[type] || 'bi-calendar-event'} ms-1"></i> ${typeName}
          </span>
        </div>
      </div>
      <div class="appt-actions">
        <button class="btn-del" onclick="confirmDeleteAppt(${id})"><i class="bi bi-trash3"></i> حذف</button>
      </div>
    </div>`;
    list.insertAdjacentHTML('afterbegin', html);
}

function confirmDeleteAppt(id) {
    apptToDeleteId = id;
    document.getElementById('deleteModal').style.setProperty('display', 'flex', 'important');
}

function closeConfirmModal() {
    document.getElementById('deleteModal').style.display = 'none';
    apptToDeleteId = null;
}

function checkEmpty() {
    const list = document.getElementById('appointmentsList');
    const emptyState = document.getElementById('emptyState');
    if (list && emptyState) {
        list.querySelectorAll('.appt-item').length === 0 ? emptyState.classList.remove('d-none') : emptyState.classList.add('d-none');
    }
}