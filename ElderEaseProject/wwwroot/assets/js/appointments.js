/* === appointments.js - النسخة المصححة بالكامل === */
const API_BASE = "https://localhost:7188/api/Appointments";
const USER_ID = 1;
const MONTHS = ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"];
const DAYS = ["الأحد", "الاثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
let appointmentToDeleteId = null;

document.addEventListener('DOMContentLoaded', () => {
    fetchAppointments();

    const confirmBtn = document.getElementById('confirmDeleteBtn');
    if (confirmBtn) confirmBtn.onclick = finishDelete;
});

// 1. جلب المواعيد
async function fetchAppointments() {
    const list = document.getElementById('appointmentsList');
    const loadingDiv = document.getElementById('loadingAppts');

    try {
        if (loadingDiv) loadingDiv.style.display = 'block';
        list.innerHTML = "";

        const res = await fetch(`${API_BASE}/User/${USER_ID}`);
        if (res.ok) {
            const data = await res.json();
            if (data.length === 0) {
                checkEmpty();
                return;
            }
            data.forEach(app => {
                const dateVal = app.AppointmentDate || app.appointmentDate;
                const id = app.Id || app.id;
                const title = app.Title || app.title || "موعد";
                const status = app.Status || app.status || "عام";
                const desc = app.Description || app.description || "";
                appendToUI(id, title, status, dateVal, desc);
            });
        }
    } catch (e) {
        console.error("السيرفر غير متصل:", e);
        list.innerHTML = '<p class="text-center text-muted p-5">تعذر الاتصال بالسيرفر.</p>';
    } finally {
        if (loadingDiv) loadingDiv.style.display = 'none';
        checkEmpty();
    }
}

// 2. إضافة الموعد
async function addAppt(e) {
    if (e) e.preventDefault();

    const t = document.getElementById('apptTitle');
    const d = document.getElementById('apptDate');
    const tm = document.getElementById('apptTime');
    const tp = document.getElementById('apptType');
    const saveBtn = document.getElementById('submitApptBtn');
    const originalText = saveBtn.innerHTML;

    // Validation
    let isValid = true;
    if (!t.value.trim()) {
        document.getElementById('apptTitleError').style.display = "block";
        isValid = false;
    } else {
        document.getElementById('apptTitleError').style.display = "none";
    }
    if (!d.value) {
        document.getElementById('apptDateError').style.display = "block";
        isValid = false;
    } else {
        document.getElementById('apptDateError').style.display = "none";
    }
    if (!tm.value) {
        document.getElementById('apptTimeError').style.display = "block";
        isValid = false;
    } else {
        document.getElementById('apptTimeError').style.display = "none";
    }

    if (!isValid) return;

    const fullDateTime = new Date(`${d.value}T${tm.value}`).toISOString();

    const payload = {
        Id: 0,
        Title: t.value.trim(),
        AppointmentDate: fullDateTime,
        Status: tp.value,
        PatientName: "مستخدم عام",
        Description: tp.value,
        UserId: USER_ID
    };

    try {
        saveBtn.disabled = true;
        saveBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> جاري الحفظ...`;

        const res = await fetch(API_BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const saved = await res.json();
            // إغلاق الـ modal وتفريغ الفورم
            bootstrap.Modal.getInstance(document.getElementById('addApptModal')).hide();
            document.getElementById('apptForm').reset();

            // إضافة الموعد للواجهة مباشرة بدون reload
            appendToUI(
                saved.Id || saved.id,
                saved.Title || saved.title,
                saved.Status || saved.status,
                saved.AppointmentDate || saved.appointmentDate,
                saved.Description || saved.description
            );
            checkEmpty();
        } else {
            const errText = await res.text();
            console.error("Server error:", errText);
            alert("السيرفر رفض الحفظ — تأكد من إعدادات الـ backend.");
        }
    } catch (err) {
        alert("تأكدي من تشغيل السيرفر.");
    } finally {
        saveBtn.disabled = false;
        saveBtn.innerHTML = originalText;
    }
}

// 3. بناء الكرت
function appendToUI(id, title, status, dateIso, desc) {
    const list = document.getElementById('appointmentsList');
    const dateObj = new Date(dateIso);

    const day = DAYS[dateObj.getDay()];
    const dayNum = dateObj.getDate();
    const month = MONTHS[dateObj.getMonth()];
    const year = dateObj.getFullYear();
    const timeStr = dateObj.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });

    // لون الكرت حسب النوع
    const colors = {
        'طبي': '#e74c3c',
        'فاتورة': '#f39c12',
        'فحص': '#9b59b6',
        'عام': '#4e73df'
    };
    const color = colors[status] || '#4e73df';

    const html = `
    <div class="appt-item card mb-3 border-0 shadow-sm" id="appt-${id}" style="border-radius:15px; overflow:hidden;">
        <div class="card-body p-0 d-flex align-items-center">
            <div class="text-white p-3 text-center d-flex flex-column justify-content-center"
                 style="width:90px; background:${color}; min-height:100px; flex-shrink:0;">
                <div class="fw-bold" style="font-size:1.8rem; line-height:1;">${dayNum}</div>
                <div style="font-size:0.75rem;">${month}</div>
                <div style="font-size:0.7rem; opacity:0.85;">${year}</div>
            </div>
            <div class="p-3 flex-grow-1 text-end">
                <h6 class="mb-1 fw-bold text-dark" style="font-size:1.1rem;">${title}</h6>
                <div class="text-muted" style="font-size:0.85rem;">
                    <i class="bi bi-calendar3 ms-1" style="color:${color}"></i> ${day}
                    &nbsp;|&nbsp;
                    <i class="bi bi-clock-fill ms-1" style="color:${color}"></i> ${timeStr}
                </div>
                <span class="badge mt-1" style="background:${color}; font-size:0.75rem; padding: 4px 10px; border-radius:20px;">
                    ${status}
                </span>
            </div>
            <button class="btn btn-outline-danger border-0 me-3 rounded-circle p-2"
                    onclick="openDeleteModal(${id}, '${title}')"
                    title="حذف الموعد">
                <i class="bi bi-trash3-fill fs-5"></i>
            </button>
        </div>
    </div>`;

    list.insertAdjacentHTML('afterbegin', html);
}

// 4. فتح modal الحذف
window.openDeleteModal = function (id, title) {
    appointmentToDeleteId = id;
    document.getElementById('apptNameDisplay').innerText = `"${title}"`;
    new bootstrap.Modal(document.getElementById('deleteConfirmModal')).show();
};

// 5. تنفيذ الحذف
async function finishDelete() {
    if (!appointmentToDeleteId) return;
    const confirmBtn = document.getElementById('confirmDeleteBtn');
    const originalText = confirmBtn.innerHTML;

    try {
        confirmBtn.disabled = true;
        confirmBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> جاري الحذف...`;

        const res = await fetch(`${API_BASE}/${appointmentToDeleteId}`, { method: "DELETE" });
        if (res.ok) {
            const el = document.getElementById(`appt-${appointmentToDeleteId}`);
            if (el) el.remove();
            bootstrap.Modal.getInstance(document.getElementById('deleteConfirmModal')).hide();
            appointmentToDeleteId = null;
            checkEmpty();
        } else {
            alert("فشل الحذف، يرجى المحاولة مجدداً.");
        }
    } catch (err) {
        alert("تعذر الاتصال بالسيرفر.");
    } finally {
        confirmBtn.disabled = false;
        confirmBtn.innerHTML = originalText;
    }
}

// 6. التحقق من فراغ القائمة
function checkEmpty() {
    const list = document.getElementById('appointmentsList');
    const empty = document.getElementById('emptyState');
    if (list && empty) {
        const hasItems = list.querySelectorAll('.appt-item').length > 0;
        empty.classList.toggle('d-none', hasItems);
    }
}