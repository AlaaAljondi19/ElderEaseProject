/* === volunteers.js - نسخة ديناميكية كاملة === */
const API_VOLUNTEERS = 'https://localhost:7188/api/Volunteers';

// 1. جلب المتطوعين
async function fetchVolunteers(query = '') {
    const grid = document.getElementById('volunteersGrid');
    if (!grid) return;

    try {
        grid.innerHTML = `
            <div class="col-12 text-center p-5">
                <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
                <p class="mt-3 text-muted fw-bold">جاري تحميل قائمة المتطوعين...</p>
            </div>`;

        const response = await fetch(`${API_VOLUNTEERS}${query}`);

        if (response.status === 401) {
            grid.innerHTML = '<p class="text-center w-100 text-danger p-5">خطأ 401: يرجى إزالة [Authorize] من الباك إند.</p>';
            return;
        }

        if (!response.ok) throw new Error("Server Error");

        const data = await response.json();

        if (data.length === 0) {
            grid.innerHTML = '<p class="text-center w-100 text-muted p-5">لا يوجد متطوعون حالياً.</p>';
            return;
        }

        renderVolunteers(data);

    } catch (e) {
        grid.innerHTML = '<p class="text-center w-100 text-muted p-5">تعذر الاتصال بالسيرفر، يرجى المحاولة لاحقاً.</p>';
    }
}

// 2. رسم الكروت من الـ API
function renderVolunteers(volunteers) {
    const grid = document.getElementById('volunteersGrid');
    grid.innerHTML = '';

    volunteers.forEach(vol => {
        const specialtyKey = (vol.Specialization || "").toLowerCase();
        const icons = { technical: 'bi-cpu', guidance: 'bi-compass', general: 'bi-hand-thumbs-up' };
        const icon = icons[specialtyKey] || 'bi-person-badge';

        grid.innerHTML += `
            <div class="col-md-6 col-lg-4" data-specialty="${specialtyKey}">
                <div class="vol-card">
                    <div class="vol-avatar"><i class="bi bi-person-fill"></i></div>
                    <span class="specialty-badge sp-${specialtyKey}">
                        <i class="bi ${icon} me-1"></i>${vol.Specialization || "متطوع"}
                    </span>
                    <h5>${vol.FullName}</h5>
                    <div class="vol-info-item"><i class="bi bi-clock"></i> ${vol.AvailableHoursPerWeek || ''} ساعة أسبوعياً</div>
                    <div class="vol-info-item"><i class="bi bi-telephone"></i> ${vol.PhoneNumber || 'غير متوفر'}</div>
                    <div class="vol-info-item"><i class="bi bi-star-fill" style="color:#f59e0b"></i> ${vol.ExperienceSummary || "لا يوجد وصف"}</div>
                    <button class="btn-contact" onclick="openContactModal('${vol.FullName}')">
                        <i class="bi bi-chat-dots-fill"></i> تواصل مع المتطوع
                    </button>
                </div>
            </div>`;
    });
}

// 3. فلترة المتطوعين
function filterVol(btn, specialty) {
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    if (specialty === 'all') {
        fetchVolunteers();
    } else {
        fetchVolunteers(`?specialty=${specialty}`);
    }
}

// 4. فتح الـ Modal
function openContactModal(name) {
    document.getElementById('volunteerName').value = name;
    document.getElementById('volNameDisplay').value = name;
    document.getElementById('volSuccess').classList.add('d-none');
    document.getElementById('volError').classList.add('d-none');

    const modal = new bootstrap.Modal(document.getElementById('contactVolModal'));
    modal.show();
}

// 5. إرسال الرسالة
window.sendVolMsg = function (e) {
    e.preventDefault();
    const form = e.target;

    const submitBtn = form.querySelector('.btn-send');
    const originalBtnText = submitBtn.innerHTML;

    const payload = {
        Name: form.querySelector('[name="SenderName"]').value,
        Email: "volunteer@elderease.com",
        Subject: `رسالة إلى المتطوع: ${document.getElementById('volunteerName').value}`,
        MessageContent: form.querySelector('[name="Message"]').value,
        SentDate: new Date().toISOString()
    };

    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> جاري الإرسال...`;

    fetch('https://localhost:7188/api/ContactMessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(res => {
            if (res.ok) {
                document.getElementById('volSuccess').classList.remove('d-none');
                document.getElementById('volError').classList.add('d-none');
                form.reset();
                setTimeout(() => {
                    bootstrap.Modal.getInstance(document.getElementById('contactVolModal')).hide();
                    document.getElementById('volSuccess').classList.add('d-none');
                }, 2000);
            } else {
                document.getElementById('volSuccess').classList.add('d-none');
                document.getElementById('volError').classList.remove('d-none');
            }
        })
        .catch(() => {
            document.getElementById('volSuccess').classList.add('d-none');
            document.getElementById('volError').classList.remove('d-none');
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
};

// 6. تشغيل جلب البيانات عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => fetchVolunteers());