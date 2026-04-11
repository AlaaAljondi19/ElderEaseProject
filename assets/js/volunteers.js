/* === volunteers.js - النسخة الديناميكية === */

// 1. جلب المتطوعين من السيرفر فور تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    fetchVolunteers();
});

function fetchVolunteers() {

    const apiUrl = '/api/Volunteers';

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            renderVolunteers(data);
        })
        .catch(error => {
            console.error('Error fetching volunteers:', error);
            // في حال فشل السيرفر، يمكنكِ إبقاء البيانات الثابتة كخطة احتياطية
        });
}

// 2. دالة بناء البطاقات برمجياً
function renderVolunteers(volunteers) {
    const grid = document.getElementById('volunteersGrid');
    grid.innerHTML = ''; // تفريغ المحتوى الثابت القديم

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

// 3. دالة إرسال الرسالة (تفعيل الربط الفعلي)
function sendVolMsg(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    fetch('/api/VolunteerMessages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (response.ok) {
                document.getElementById('volMsgSuccess').classList.remove('d-none');
                e.target.reset();
                // إغلاق المودال بعد 3 ثوانٍ
                setTimeout(() => {
                    bootstrap.Modal.getInstance(document.getElementById('contactVolModal')).hide();
                }, 3000);
            }
        })
        .catch(err => console.error("Error sending message:", err));
}

// دالة الفلترة (تبقى كما هي لتعمل مع العناصر الجديدة)
function filterVol(btn, specialty) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('#volunteersGrid [data-specialty]').forEach(card => {
        card.style.display = (specialty === 'all' || card.dataset.specialty === specialty) ? '' : 'none';
    });
}

function openContactModal(name) {
    document.getElementById('volunteerName').value = name;
    document.getElementById('volNameDisplay').value = name;
    document.getElementById('volMsgSuccess').classList.add('d-none');
    new bootstrap.Modal(document.getElementById('contactVolModal')).show();
}