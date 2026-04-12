/* === volunteers.js - النسخة النهائية المصلحة === */

// 1. جلب المتطوعين عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    fetchVolunteers();
});

function fetchVolunteers() {
    const apiUrl = '/api/Volunteers';
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => renderVolunteers(data))
        .catch(error => console.error('Error fetching volunteers:', error));
}

// 2. بناء بطاقات المتطوعين
function renderVolunteers(volunteers) {
    const grid = document.getElementById('volunteersGrid');
    if (!grid) return;
    grid.innerHTML = '';

    volunteers.forEach(vol => {
        const cardHtml = `
            <div class="col-md-6 col-lg-4" data-specialty="${vol.specialty}">
                <div class="vol-card">
                    <div class="vol-avatar"><i class="bi bi-person-fill"></i></div>
                    <span class="specialty-badge sp-${vol.specialty}"><i class="bi bi-star me-1"></i>${vol.specialtyName}</span>
                    <h5>${vol.fullName}</h5>
                    <div class="vol-info-item"><i class="bi bi-clock"></i> ${vol.workingHours}</div>
                    <div class="vol-info-item"><i class="bi bi-telephone"></i> ${vol.phone}</div>
                    <div class="vol-info-item"><i class="bi bi-info-circle"></i> ${vol.bio}</div>
                    <button class="btn-contact" onclick="openContactModal('${vol.fullName}')">
                        <i class="bi bi-chat-dots-fill"></i> تواصل مع المتطوع
                    </button>
                </div>
            </div>`;
        grid.innerHTML += cardHtml;
    });
}

// 3. الدالة الرئيسية: التحقق من الحقول وإرسال الرسالة
function sendVolMsg(e) {
    e.preventDefault(); // منع المتصفح من إظهار التنبيه الافتراضي (الفقاعة)

    const form = e.target;
    let isValid = true;

    // جلب الحقول والرسائل
    const nameInput = form.querySelector('[name="SenderName"]');
    const phoneInput = form.querySelector('[name="Phone"]');
    const messageInput = form.querySelector('[name="Message"]');

    const nameError = document.getElementById('name-error');
    const phoneError = document.getElementById('phone-error');

    // التحقق من الاسم
    if (!nameInput.value.trim()) {
        nameError.style.setProperty('display', 'block', 'important'); // إجبار ظهور السطر الأحمر
        nameInput.style.borderColor = "#dc3545"; // تلوين الحدود بالأحمر
        isValid = false;
    } else {
        nameError.style.display = 'none';
        nameInput.style.borderColor = "#dee2e6";
    }

    // التحقق من الهاتف
    if (!phoneInput.value.trim()) {
        phoneError.style.setProperty('display', 'block', 'important');
        phoneInput.style.borderColor = "#dc3545";
        isValid = false;
    } else {
        phoneError.style.display = 'none';
        phoneInput.style.borderColor = "#dee2e6";
    }

    // إذا كانت البيانات غير مكتملة توقف هنا
    if (!isValid) return;

    // إذا وصلت هنا، يعني البيانات سليمة -> نبدأ الإرسال الفعلي
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    fetch('/api/VolunteerMessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                document.getElementById('volMsgSuccess').classList.remove('d-none');
                form.reset();
                // إخفاء الرسائل الحمراء بعد الإرسال الناجح
                nameError.style.display = 'none';
                phoneError.style.display = 'none';

                setTimeout(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('contactVolModal'));
                    if (modal) modal.hide();
                    document.getElementById('volMsgSuccess').classList.add('d-none');
                }, 3000);
            }
        })
        .catch(err => console.error("Error sending message:", err));
}

// 4. فتح المودال وتجهيزه
function openContactModal(name) {
    document.getElementById('volunteerName').value = name;
    document.getElementById('volNameDisplay').value = name;
    document.getElementById('volMsgSuccess').classList.add('d-none');

    // تصفير الأخطاء والحدود عند فتح المودال من جديد
    const form = document.getElementById('volContactForm');
    if (form) {
        form.reset();
        form.querySelectorAll('.form-control').forEach(input => {
            input.style.borderColor = "#dee2e6";
        });
    }
    document.getElementById('name-error').style.display = 'none';
    document.getElementById('phone-error').style.display = 'none';

    const contactModal = new bootstrap.Modal(document.getElementById('contactVolModal'));
    contactModal.show();
}

// 5. دالة الفلترة
function filterVol(btn, specialty) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#volunteersGrid [data-specialty]').forEach(card => {
        card.style.display = (specialty === 'all' || card.dataset.specialty === specialty) ? '' : 'none';
    });
}