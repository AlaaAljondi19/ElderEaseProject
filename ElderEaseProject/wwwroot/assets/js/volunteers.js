/* === volunteers.js - النسخة النهائية المعتمدة للربط بالباك إند === */

const API_VOLUNTEERS = '/api/Volunteers';
const API_MESSAGES = '/api/VolunteerMessages';

// 1. جلب البيانات عند تشغيل الصفحة أو عند تغيير الفلترة
async function fetchVolunteers(query = '') {
    const grid = document.getElementById('volunteersGrid');
    if (!grid) return;

    try {
        // إظهار مؤشر تحميل بسيط
        grid.innerHTML = `
            <div class="col-12 text-center p-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">جاري تحديث قائمة المتطوعين...</p>
            </div>`;

        const response = await fetch(`${API_VOLUNTEERS}${query}`);
        if (!response.ok) throw new Error("Server Error");

        const data = await response.json();
        renderVolunteers(data);
    } catch (e) {
        console.error("Connection Error:", e);
        grid.innerHTML = '<p class="text-center w-100 text-muted p-5">عذراً، فشل الاتصال بالسيرفر لجلب المتطوعين.</p>';
    }
}

// 2. دالة رسم الكروت (Render)
function renderVolunteers(volunteers) {
    const grid = document.getElementById('volunteersGrid');
    grid.innerHTML = '';

    if (volunteers.length === 0) {
        grid.innerHTML = '<p class="text-center w-100 text-muted p-5">لا يوجد متطوعون متاحون حالياً بهذا التخصص.</p>';
        return;
    }

    volunteers.forEach(vol => {
        // تحديد الأيقونة بناءً على التخصص
        const icons = { technical: 'bi-cpu', guidance: 'bi-compass', support: 'bi-hand-thumbs-up' };
        const icon = icons[vol.specialty] || 'bi-person-badge';

        grid.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="vol-card">
                    <div class="vol-avatar"><i class="bi bi-person-fill"></i></div>
                    <span class="specialty-badge sp-${vol.specialty}">
                        <i class="bi ${icon} me-1"></i>${vol.specialtyName}
                    </span>
                    <h5>${vol.fullName}</h5>
                    <div class="vol-info-item"><i class="bi bi-clock"></i> ${vol.workingHours}</div>
                    <div class="vol-info-item"><i class="bi bi-telephone"></i> ${vol.phone}</div>
                    <div class="vol-info-item"><i class="bi bi-star-fill" style="color:#f59e0b"></i> ${vol.bio}</div>
                    <button class="btn-contact" onclick="openContactModal('${vol.fullName}')">
                        <i class="bi bi-chat-dots-fill"></i> تواصل مع المتطوع
                    </button>
                </div>
            </div>`;
    });
}

// 3. منطق الفلترة الديناميكي (عبر السيرفر)
window.filterVol = function (btn, specialty) {
    // تحديث الأزرار في الواجهة
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // طلب البيانات المفلترة من الباك إند مباشرة
    const query = specialty === 'all' ? '' : `?specialty=${specialty}`;
    fetchVolunteers(query);
};

// 4. فتح مودال التواصل وتجهيزه
window.openContactModal = function (name) {
    const volNameHidden = document.getElementById('volunteerName');
    const volNameDisplay = document.getElementById('volNameDisplay');
    const form = document.getElementById('volContactForm');

    if (volNameHidden) volNameHidden.value = name;
    if (volNameDisplay) volNameDisplay.value = name;
    if (form) form.reset();

    // إعادة ضبط الأخطاء والتنبيهات
    document.getElementById('volSuccess')?.classList.add('d-none');
    document.getElementById('volError')?.classList.add('d-none');
    document.getElementById('name-error').style.display = 'none';
    document.getElementById('phone-error').style.display = 'none';
    document.querySelectorAll('.form-control').forEach(i => i.style.borderColor = "#dee2e6");

    const modalObj = new bootstrap.Modal(document.getElementById('contactVolModal'));
    modalObj.show();
};

// 5. إرسال الرسالة للمتطوع (POST)
window.sendVolMsg = function (e) {
    e.preventDefault();
    const form = e.target;
    const nameInput = form.querySelector('[name="SenderName"]');
    const phoneInput = form.querySelector('[name="Phone"]');

    let isValid = true;

    // التحقق من الحقول
    if (!nameInput.value.trim()) {
        document.getElementById('name-error').style.display = 'block';
        nameInput.style.borderColor = "#dc3545";
        isValid = false;
    }
    if (!phoneInput.value.trim()) {
        document.getElementById('phone-error').style.display = 'block';
        phoneInput.style.borderColor = "#dc3545";
        isValid = false;
    }

    if (!isValid) return;

    const data = Object.fromEntries(new FormData(form));

    fetch(API_MESSAGES, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                document.getElementById('volSuccess').classList.remove('d-none');
                form.reset();
                setTimeout(() => {
                    const modalEl = document.getElementById('contactVolModal');
                    bootstrap.Modal.getInstance(modalEl).hide();
                }, 2500);
            } else {
                document.getElementById('volError').classList.remove('d-none');
            }
        })
        .catch(() => {
            document.getElementById('volError').classList.remove('d-none');
        });
};

// تشغيل الجلب الأول عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => fetchVolunteers());