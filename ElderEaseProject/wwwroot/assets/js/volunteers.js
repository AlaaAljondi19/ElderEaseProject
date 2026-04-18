/* === volunteers.js - النسخة الذهبية (بدون أخطاء) === */

// تعريف الدوال في النطاق العام لتراها الأزرار والفلترة
window.openContactModal = function (name) {
    const volNameHidden = document.getElementById('volunteerName');
    const volNameDisplay = document.getElementById('volNameDisplay');

    if (volNameHidden) volNameHidden.value = name;
    if (volNameDisplay) volNameDisplay.value = name;

    const form = document.getElementById('volContactForm');
    if (form) form.reset();

    document.getElementById('volMsgSuccess').classList.add('d-none');
    document.getElementById('name-error').style.display = 'none';
    document.getElementById('phone-error').style.display = 'none';

    document.querySelectorAll('.form-control').forEach(i => i.style.borderColor = "#dee2e6");

    // تشغيل المودال
    const modalEl = document.getElementById('contactVolModal');
    const modalObj = new bootstrap.Modal(modalEl);
    modalObj.show();
};

window.filterVol = function (btn, specialty) {
    // 1. تحديث شكل الأزرار
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // 2. منطق الفلترة الفعلي
    const cards = document.querySelectorAll('#volunteersGrid > div'); // نستهدف الـ col نفسه
    cards.forEach(card => {
        const cardSpecialty = card.getAttribute('data-specialty');
        if (specialty === 'all' || cardSpecialty === specialty) {
            card.classList.remove('d-none'); // إظهار
        } else {
            card.classList.add('d-none'); // إخفاء
        }
    });
};

window.sendVolMsg = function (e) {
    e.preventDefault();
    const form = e.target;
    let isValid = true;

    // 1. عناصر التحقق (Validation)
    const nameInput = form.querySelector('[name="SenderName"]');
    const phoneInput = form.querySelector('[name="Phone"]');
    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');

    // 2. عناصر التنبيه (Alert Boxes)
    const volSuccess = document.getElementById('volSuccess');
    const volError = document.getElementById('volError');

    // فحص الحقول (الرسائل الحمراء الصغيرة)
    if (!nameInput.value.trim()) {
        nameError.style.display = 'block';
        nameInput.style.borderColor = "#dc3545";
        isValid = false;
    } else {
        nameError.style.display = 'none';
        nameInput.style.borderColor = "#dee2e6";
    }

    if (!phoneInput.value.trim()) {
        phoneError.style.display = 'block';
        phoneInput.style.borderColor = "#dc3545";
        isValid = false;
    } else {
        phoneError.style.display = 'none';
        phoneInput.style.borderColor = "#dee2e6";
    }

    if (!isValid) return;

    // 3. محاولة الإرسال للسيرفر
    const data = Object.fromEntries(new FormData(form));

    // إخفاء التنبيهات السابقة
    volSuccess.classList.add('d-none');
    volError.classList.add('d-none');

    fetch('/api/VolunteerMessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(res => {
            if (res.ok) {
                // حالة النجاح: إظهار الأخضر وتفريغ الحقول
                volSuccess.classList.remove('d-none');
                form.reset();
                // إغلاق المودال تلقائياً بعد ثانيتين ونصف
                setTimeout(() => {
                    const modalEl = document.getElementById('contactVolModal');
                    const modalObj = bootstrap.Modal.getInstance(modalEl);
                    if (modalObj) modalObj.hide();
                }, 2500);
            } else {
                // حالة فشل السيرفر: إظهار الأحمر
                volError.classList.remove('d-none');
            }
        })
        .catch(err => {
            console.error("Network Error:", err);
            // حالة انقطاع الاتصال: إظهار الأحمر
            volError.classList.remove('d-none');
        });
};


// جلب البيانات عند التشغيل
async function fetchVolunteers() {
    const apiUrl = '/api/Volunteers';
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error();
        const data = await response.json();
        renderVolunteers(data);
    } catch (e) {
        console.log("استخدام البيانات الثابتة لعدم وجود اتصال بالسيرفر");
    }
}

function renderVolunteers(volunteers) {
    const grid = document.getElementById('volunteersGrid');
    if (!grid) return;
    grid.innerHTML = '';

    volunteers.forEach(vol => {
        let icon = vol.specialty === 'technical' ? 'bi-cpu' : (vol.specialty === 'guidance' ? 'bi-compass' : 'bi-hand-thumbs-up');
        grid.innerHTML += `
            <div class="col-md-6 col-lg-4" data-specialty="${vol.specialty}">
                <div class="vol-card">
                    <div class="vol-avatar"><i class="bi bi-person-fill"></i></div>
                    <span class="specialty-badge sp-${vol.specialty}"><i class="bi ${icon} me-1"></i>${vol.specialtyName}</span>
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

document.addEventListener('DOMContentLoaded', fetchVolunteers);