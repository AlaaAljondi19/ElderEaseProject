/* === volunteers.js - النسخة المعتمدة مع الـ Spinner === */
const API_VOLUNTEERS = 'https://localhost:7188/api/Volunteers';

// 1. جلب المتطوعين (السبينر هنا يظهر في وسط الصفحة أثناء تحميل الكروت)
async function fetchVolunteers(query = '') {
    const grid = document.getElementById('volunteersGrid');
    if (!grid) return;

    try {
        // تحسين شكل السبينر المركزي أثناء التحميل
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
        renderVolunteers(data);
    } catch (e) {
        grid.innerHTML = '<p class="text-center w-100 text-muted p-5">فشل الاتصال بالسيرفر.</p>';
    }
}

// 2. رسم الكروت (لم يتم تغيير أي شيء في المنطق أو الأسماء)
function renderVolunteers(volunteers) {
    const grid = document.getElementById('volunteersGrid');
    grid.innerHTML = '';

    volunteers.forEach(vol => {
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
                    <div class="vol-info-item"><i class="bi bi-clock"></i> ${vol.WorkingHours} ساعة</div>
                    <div class="vol-info-item"><i class="bi bi-telephone"></i> ${vol.Phone}</div>
                    <div class="vol-info-item"><i class="bi bi-star-fill" style="color:#f59e0b"></i> ${vol.Bio || "لا يوجد وصف"}</div>
                    <button class="btn-contact" onclick="openContactModal('${vol.FullName}')">
                        <i class="bi bi-chat-dots-fill"></i> تواصل مع المتطوع
                    </button>
                </div>
            </div>`;
    });
}

// 3. إرسال الرسالة (إضافة السبينر داخل الزر عند الإرسال)
window.sendVolMsg = function (e) {
    e.preventDefault();
    const form = e.target;

    // تعريف الزر لإضافة السبينر
    const submitBtn = form.querySelector('button[type="submit"]') || form.querySelector('.btn-primary');
    const originalBtnText = submitBtn.innerHTML;

    const payload = {
        Name: "Alia Bassam",
        Email: "alia@example.com",
        Subject: `رسالة إلى المتطوع: ${document.getElementById('volunteerName').value}`,
        MessageContent: form.querySelector('[name="MessageContent"]').value,
        SentDate: new Date().toISOString()
    };

    // تشغيل السبينر وتعطيل الزر
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
                form.reset();
                setTimeout(() => {
                    bootstrap.Modal.getInstance(document.getElementById('contactVolModal')).hide();
                    document.getElementById('volSuccess').classList.add('d-none'); // إخفاء الرسالة بعد الإغلاق
                }, 2000);
            } else {
                document.getElementById('volError').classList.remove('d-none');
            }
        })
        .catch(() => document.getElementById('volError').classList.remove('d-none'))
        .finally(() => {
            // إعادة الزر لحالته الطبيعية
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnText;
        });
};