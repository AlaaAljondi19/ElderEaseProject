const API_BASE = "https://localhost:7188/api/Appointments";
const USER_ID = 1;
const MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];

let appointmentToDeleteId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchAppointments();

    // ربط زر الحفظ
    const saveBtn = document.getElementById('submitApptBtn');
    if (saveBtn) {
        saveBtn.onclick = (e) => {
            e.preventDefault();
            addAppt();
        };
    }

    // ربط زر الحذف في المودال الأحمر
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) {
        confirmBtn.onclick = finishDelete;
    }
});

// 1. جلب المواعيد
async function fetchAppointments() {
    const list = document.getElementById('appointmentsList');
    try {
        const res = await fetch(`${API_BASE}/User/${USER_ID}`);
        if (res.ok) {
            const data = await res.json();
            list.innerHTML = ""; // تنظيف القائمة
            data.forEach(app => {
                // استخدام الحقول كما هي في الـ Swagger حرفياً
                const dateVal = app.AppointmentDate || app.appointmentDate;
                appendToUI(app.Id || app.id, app.Title || app.title, app.Status || app.status, dateVal);
            });
        }
    } catch (e) {
        console.error("السيرفر غير متصل");
    } finally {
        if (document.getElementById('loadingAppts'))
            document.getElementById('loadingAppts').style.display = 'none';
        checkEmpty();
    }
}

// 2. إضافة الموعد (حل مشكلة عدم الظهور الفوري)
async function addAppt() {
    const t = document.getElementById('apptTitle');
    const d = document.getElementById('apptDate');
    const tm = document.getElementById('apptTime');
    const tp = document.getElementById('apptType');

    // التحقق من المدخلات (الرسائل الحمراء)
    document.getElementById('apptTitleError').style.display = t.value.trim() ? "none" : "block";
    document.getElementById('apptDateError').style.display = d.value ? "none" : "block";
    document.getElementById('apptTimeError').style.display = tm.value ? "none" : "block";

    if (!t.value.trim() || !d.value || !tm.value) return;

    // دمج التاريخ والوقت في تنسيق ISO للسيرفر
    const fullDateTime = new Date(`${d.value}T${tm.value}`).toISOString();

    const payload = {
        Id: 0,
        Title: t.value,
        AppointmentDate: fullDateTime,
        Status: tp.value,
        PatientName: "Alia Bassam", // اسم المستخدم الحالي
        Description: "ElderEase Appointment",
        UserId: USER_ID
    };

    try {
        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            // ✅ السر هنا: جلب البيانات من السيرفر مرة ثانية فوراً لتحديث الواجهة
            await fetchAppointments();

            // إغلاق المودال وتصفير الفورم
            const modalInstance = bootstrap.Modal.getInstance(document.getElementById('addApptModal'));
            modalInstance.hide();
            document.getElementById('apptForm').reset();
        } else {
            alert("السيرفر رفض الحفظ. تأكدي من تشغيل الباكند وتوافق الحقول.");
        }
    } catch (err) {
        alert("تأكدي من تشغيل مشروع الـ Visual Studio.");
    }
}

// 3. بناء الكرت في الصفحة
function appendToUI(id, title, status, dateIso) {
    const list = document.getElementById('appointmentsList');
    const dateObj = new Date(dateIso);
    const timeStr = dateObj.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    const html = `
    <div class="col-12 appt-item card mb-3 border-0 shadow-sm" id="appt-${id}" style="border-radius: 15px; overflow: hidden;">
        <div class="card-body p-0 d-flex align-items-center text-end">
            <div class="text-white p-3 text-center d-flex flex-column justify-content-center" 
                 style="width: 85px; background: linear-gradient(135deg, #4e73df, #224abe); min-height: 90px;">
                <div class="fw-bold fs-3">${dateObj.getDate()}</div>
                <div style="font-size: 0.7rem;">${MONTHS[dateObj.getMonth()]}</div>
            </div>
            <div class="p-3 flex-grow-1">
                <h6 class="mb-1 fw-bold text-dark fs-5">${title}</h6>
                <div class="text-muted small">
                    <i class="bi bi-clock-fill text-primary ms-1"></i> ${timeStr} | 
                    <i class="bi bi-tag-fill text-secondary ms-1"></i> ${status}
                </div>
            </div>
            <button class="btn btn-outline-danger border-0 me-3 rounded-circle p-2" 
                    onclick="openDeleteModal(${id}, '${title}')">
                <i class="bi bi-trash3-fill fs-5"></i>
            </button>
        </div>
    </div>`;
    list.insertAdjacentHTML('afterbegin', html);
}

// 4. الحذف (تفعيل الزر الأحمر)
window.openDeleteModal = function (id, title) {
    appointmentToDeleteId = id;
    document.getElementById('apptNameDisplay').innerText = `"${title}"`;
    new bootstrap.Modal(document.getElementById('deleteConfirmModal')).show();
};

async function finishDelete() {
    if (!appointmentToDeleteId) return;
    try {
        const res = await fetch(`${API_BASE}/${appointmentToDeleteId}`, { method: "DELETE" });
        if (res.ok) {
            // حذف العنصر من الشاشة فوراً
            const el = document.getElementById(`appt-${appointmentToDeleteId}`);
            if (el) el.remove();

            bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
            checkEmpty();
        }
    } catch (err) {
        console.error("خطأ في الحذف");
    }
}

function checkEmpty() {
    const list = document.getElementById('appointmentsList');
    const empty = document.getElementById('emptyState');
    if (list && empty) {
        const hasItems = list.querySelectorAll('.appt-item').length > 0;
        empty.classList.toggle('d-none', hasItems);
    }
}