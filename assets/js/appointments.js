const MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
let apptToDeleteId = null;

document.addEventListener('DOMContentLoaded', () => {
    // إخفاء رسالة التحميل وعرض البيانات
    const loading = document.getElementById('loadingAppts');
    if (loading) loading.style.display = 'none';

    loadStaticAppointments();
});

// 1. تحميل 3 مواعيد تجريبية بتنسيق أفقي
function loadStaticAppointments() {
    const list = document.getElementById('appointmentsList');
    if (!list) return;

    const staticData = [
        { id: 101, title: "مراجعة عيادة القلب", type: "medical", date: "2026-04-10", time: "10:00 AM" },
        { id: 102, title: "سداد فاتورة المياه", type: "bill", date: "2026-04-12", time: "09:00 AM" },
        { id: 103, title: "فحص دوري شامل", type: "general", date: "2026-04-15", time: "11:30 AM" }
    ];

    list.innerHTML = '';
    staticData.forEach(app => {
        const d = new Date(app.date);
        appendApptDOM(app.id, app.title, app.type, d.getDate(), MONTHS[d.getMonth()], app.time);
    });
    checkEmpty();
}

// 2. بناء الكارد الأفقي (متوافق مع CSS الخاص بكِ)
function appendApptDOM(id, title, type, day, month, time) {
    const list = document.getElementById('appointmentsList');

    // تحديد الكلاس والأيقونة بناءً على النوع
    const typeClasses = { medical: 'type-medical', bill: 'type-bill', exam: 'type-exam', general: 'type-general' };
    const typeIcons = { medical: 'bi-capsule', bill: 'bi-receipt', exam: 'bi-eye', general: 'bi-calendar-event' };

    const currentClass = typeClasses[type] || 'type-general';
    const currentIcon = typeIcons[type] || 'bi-calendar-event';
    const typeName = { medical: 'طبي', bill: 'فاتورة', exam: 'فحص', general: 'عام' }[type] || 'عام';

    const html = `
    <div class="appt-item" id="appt-${id}">
      <div class="appt-date-box">
        <span class="day">${day}</span>
        <span class="month">${month}</span>
      </div>
      <div class="appt-info">
        <h6>${title}</h6>
        <div class="appt-meta">
          <span><i class="bi bi-clock"></i> ${time}</span>
          <span class="type-badge ${currentClass}">
            <i class="bi ${currentIcon} ms-1"></i> ${typeName}
          </span>
        </div>
      </div>
      <div class="appt-actions">
        <button class="btn-del" onclick="confirmDeleteAppt(${id})">
          <i class="bi bi-trash3"></i> حذف
        </button>
      </div>
    </div>`;

    list.insertAdjacentHTML('afterbegin', html);
}

// 3. إضافة موعد جديد من الفورم
async function addAppt(e) {
    e.preventDefault();

    const titleInput = document.getElementById('apptTitle');
    const dateInput = document.getElementById('apptDate');
    const timeInput = document.getElementById('apptTime');
    const typeInput = document.getElementById('apptType');

    // التحقق من المدخلات
    if (!titleInput.value || !dateInput.value || !timeInput.value) {
        if (titleInput.value === "") document.getElementById('apptTitleError').style.display = "block";
        return;
    }

    const d = new Date(dateInput.value);
    appendApptDOM(Date.now(), titleInput.value, typeInput.value, d.getDate(), MONTHS[d.getMonth()], timeInput.value);

    // إغلاق المودال وتفريغ الفورم
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('addApptModal'));
    modalInstance.hide();
    document.getElementById('apptForm').reset();
    checkEmpty();
}

// 4. تفعيل بوكس الحذف الأحمر (المودال)
function confirmDeleteAppt(id) {
    apptToDeleteId = id;
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.style.setProperty('display', 'flex', 'important'); // لإظهار المودال فوق كل شيء
    }
}

function closeConfirmModal() {
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) deleteModal.style.display = 'none';
    apptToDeleteId = null;
}

function finishDelete() {
    if (apptToDeleteId) {
        const item = document.getElementById(`appt-${apptToDeleteId}`);
        if (item) item.remove();
        closeConfirmModal();
        checkEmpty();
    }
}

function checkEmpty() {
    const list = document.getElementById('appointmentsList');
    const emptyState = document.getElementById('emptyState');
    if (list && emptyState) {
        if (list.children.length === 0) emptyState.classList.remove('d-none');
        else emptyState.classList.add('d-none');
    }
}// دالة حذف جميع المواعيد دفعة واحدة
function deleteAllAppts() {
    // إظهار مودال التأكيد الأحمر أولاً
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.style.setProperty('display', 'flex', 'important');
        const deleteText = document.getElementById('deleteModalText');
        if (deleteText) deleteText.innerText = "هل أنتِ متأكدة من حذف جميع المواعيد؟";

        // تغيير وظيفة زر التأكيد مؤقتاً ليقوم بحذف الكل
        const confirmBtn = deleteModal.querySelector('.btn-red');
        confirmBtn.onclick = function () {
            const list = document.getElementById('appointmentsList');
            if (list) {
                list.innerHTML = ''; // مسح كل المحتوى
                checkEmpty();        // إظهار رسالة "لا توجد مواعيد"
            }
            closeConfirmModal();
            // إعادة الوظيفة الأصلية للزر بعد الانتهاء
            confirmBtn.onclick = finishDelete;
        };
    }
}