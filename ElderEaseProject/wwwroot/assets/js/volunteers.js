/* === volunteers.js === */

// تشغيل جلب البيانات فور تحميل الصفحة (المهمة 1)
document.addEventListener('DOMContentLoaded', () => {
    fetchVolunteers();
});

// 1. دالة جلب المتطوعين من السيرفر (المهمة 1)
async function fetchVolunteers() {
    try {
        const response = await fetch('/api/Volunteers');
        const volunteers = await response.json();
        renderVolunteers(volunteers);
    } catch (error) {
        console.error("خطأ في جلب البيانات:", error);
    }
}

// 2. دالة رسم البطاقات (لتحويل البيانات من السيرفر إلى HTML)
function renderVolunteers(volunteers) {
    const grid = document.getElementById('volunteersGrid');
    grid.innerHTML = ''; // تفريغ المحتوى القديم

    volunteers.forEach(vol => {
        grid.innerHTML += `
            <div class="col-md-6 col-lg-4" data-specialty="${vol.specialtyCode}">
                <div class="vol-card">
                    <div class="vol-avatar"><i class="bi bi-person-fill"></i></div>
                    <span class="specialty-badge sp-${vol.specialtyCode}">${vol.specialtyName}</span>
                    <h5>${vol.fullName}</h5>
                    <div class="vol-info-item"><i class="bi bi-clock"></i> ${vol.workingHours}</div>
                    <div class="vol-info-item"><i class="bi bi-telephone"></i> ${vol.phone}</div>
                    <div class="vol-info-item"><i class="bi bi-star-fill" style="color:#f59e0b"></i> ${vol.description}</div>
                    <button class="btn-contact" onclick="openContactModal('${vol.fullName}')">
                        <i class="bi bi-chat-dots-fill"></i> تواصل مع المتطوع
                    </button>
                </div>
            </div>`;
    });
}

// 3. دالة الفلترة (نفس منطق كودك الأصلي لكن مع ربط البيانات الجديدة)
function filterVol(btn, specialty) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('#volunteersGrid [data-specialty]').forEach(card => {
        card.style.display = (specialty === 'all' || card.dataset.specialty === specialty) ? '' : 'none';
    });
}

// 4. فتح النافذة (نفس كودك الأصلي مع تنظيف النموذج)
function openContactModal(name) {
    document.getElementById('volunteerName').value = name;
    document.getElementById('volNameDisplay').value = name;
    document.getElementById('volMsgSuccess').classList.add('d-none');
    document.getElementById('volContactForm').reset();
    document.getElementById('volNameDisplay').value = name; // إعادة التعبئة بعد الـ reset
    new bootstrap.Modal(document.getElementById('contactVolModal')).show();
}

// 5. إرسال الرسالة فعلياً للسيرفر (تفعيل الكود الذي كان "تعليقاً" في كودك الأصلي)
async function sendVolMsg(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    try {
        const response = await fetch('/api/VolunteerMessages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            document.getElementById('volMsgSuccess').classList.remove('d-none');
            e.target.reset();
        }
    } catch (error) {
        alert("فشل إرسال الرسالة");
    }
}
