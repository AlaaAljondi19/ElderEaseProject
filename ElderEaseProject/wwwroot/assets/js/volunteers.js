/* === volunteers.js - النسخة المعتمدة طبقاً لـ Swagger المشروع === */
const API_VOLUNTEERS = 'https://localhost:7188/api/Volunteers';
const API_MESSAGES = 'https://localhost:7188/api/VolunteerMessages';

// 1. جلب المتطوعين
async function fetchVolunteers(query = '') {
    const grid = document.getElementById('volunteersGrid');
    if (!grid) return;

    try {
        grid.innerHTML = `<div class="col-12 text-center p-5"><div class="spinner-border text-primary"></div><p>جاري التحميل...</p></div>`;

        const response = await fetch(`${API_VOLUNTEERS}${query}`);

        if (response.status === 401) {
            grid.innerHTML = '<p class="text-center w-100 text-danger p-5">خطأ 401: يرجى إزالة [Authorize] من الباك إند.</p>';
            return;
        }

        if (!response.ok) throw new Error("Server Error");
        const data = await response.json();
        renderVolunteers(data);
    } catch (e) {
        grid.innerHTML = '<p class="text-center w-100 text-muted p-5">فشل الاتصال بالسيرفر.</p>';
    }
}

// 2. رسم الكروت (الأسماء مطابقة للـ Swagger JSON)
function renderVolunteers(volunteers) {
    const grid = document.getElementById('volunteersGrid');
    grid.innerHTML = '';

    volunteers.forEach(vol => {
        // Specialty في السواجر تبدأ بحرف كبير
        const specialtyKey = (vol.Specialty || "").toLowerCase();
        const icons = { technical: 'bi-cpu', guidance: 'bi-compass', support: 'bi-hand-thumbs-up' };
        const icon = icons[specialtyKey] || 'bi-person-badge';

        grid.innerHTML += `
            <div class="col-md-6 col-lg-4">
                <div class="vol-card">
                    <div class="vol-avatar"><i class="bi bi-person-fill"></i></div>
                    <span class="specialty-badge sp-${specialtyKey}">
                        <i class="bi ${icon} me-1"></i>${vol.Specialty || "متطوع"}
                    </span>
                    <h5>${vol.FullName}</h5>
                    <div class="vol-info-item"><i class="bi bi-clock"></i> ${vol.WorkingHours}</div>
                    <div class="vol-info-item"><i class="bi bi-telephone"></i> ${vol.Phone}</div>
                    <div class="vol-info-item"><i class="bi bi-star-fill" style="color:#f59e0b"></i> ${vol.Bio}</div>
                    <button class="btn-contact" onclick="openContactModal('${vol.FullName}')">
                        <i class="bi bi-chat-dots-fill"></i> تواصل مع المتطوع
                    </button>
                </div>
            </div>`;
    });
}

// 3. إرسال الرسالة (مطابقة لـ ContactMessage Schema في السواجر)
window.sendVolMsg = function (e) {
    e.preventDefault();
    const form = e.target;

    // الأسماء هنا يجب أن تطابق الـ Required Fields في السواجر: Name, Email, Subject, MessageContent
    const payload = {
        Name: "Alia Bassam", // أو الاسم من حقل الإدخال
        Email: "alia@example.com", // إجباري حسب السواجر
        Subject: `رسالة إلى المتطوع: ${document.getElementById('volunteerName').value}`,
        MessageContent: form.querySelector('[name="MessageContent"]').value,
        SentDate: new Date().toISOString()
    };

    fetch('https://localhost:7188/api/ContactMessages', { // التوجه لـ ContactMessages حسب السواجر
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    })
        .then(res => {
            if (res.ok) {
                document.getElementById('volSuccess').classList.remove('d-none');
                form.reset();
                setTimeout(() => {
                    bootstrap.Modal.getInstance(document.getElementById('contactVolModal')).hide();
                }, 2000);
            } else {
                document.getElementById('volError').classList.remove('d-none');
            }
        })
        .catch(() => document.getElementById('volError').classList.remove('d-none'));
};