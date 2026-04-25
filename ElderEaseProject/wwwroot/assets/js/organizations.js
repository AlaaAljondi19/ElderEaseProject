/* === organizations.js - النسخة المعتمدة والمطابقة للسواجر === */
const API_ORGS = 'https://localhost:7188/api/Organizations'; // الرابط الكامل

// 1. جلب البيانات عند التشغيل
document.addEventListener('DOMContentLoaded', () => {
    fetchOrgs();
});

async function fetchOrgs(searchTerm = '', type = 'all') {
    const grid = document.getElementById('orgsGrid');
    if (!grid) return;

    try {
        grid.innerHTML = `
            <div class="col-12 text-center p-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">جاري تحميل المؤسسات...</p>
            </div>`;

        let url = `${API_ORGS}?`;
        if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
        // ملاحظة: السواجر لا يحتوي على فلترة type حالياً، لكن سنبقيها إذا كان الليدر سيضيفها
        if (type !== 'all') url += `type=${type}`;

        const response = await fetch(url);

        if (response.status === 401) {
            grid.innerHTML = '<p class="text-center w-100 p-5 text-danger">خطأ 401: يرجى فتح الصلاحيات للمؤسسات.</p>';
            return;
        }

        if (!response.ok) throw new Error();

        const data = await response.json();
        renderOrgs(data);
    } catch (e) {
        grid.innerHTML = '<p class="text-center w-100 p-5 text-muted">عذراً، فشل جلب البيانات من السيرفر.</p>';
    }
}

function renderOrgs(orgs) {
    const grid = document.getElementById('orgsGrid');
    grid.innerHTML = '';

    if (orgs.length === 0) {
        grid.innerHTML = '<p class="text-center w-100 p-5 text-muted">لا توجد نتائج تطابق بحثك.</p>';
        return;
    }

    orgs.forEach(org => {
        // التعديل هنا: استخدام الأسماء من السواجر (PascalCase)
        grid.innerHTML += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="org-card h-100 shadow-sm border-0" style="border-radius: 15px; overflow: hidden;">
                    <div class="p-4 text-center bg-light border-bottom">
                        <i class="bi bi-building text-primary" style="font-size: 3rem;"></i>
                    </div>
                    <div class="card-body text-end">
                        <h5 class="fw-bold text-dark">${org.OrgName}</h5> 
                        <p class="text-primary small mb-2">${org.ActivityType}</p>
                        <p class="text-muted small" style="min-height: 40px;">${org.Description || 'لا يوجد وصف'}</p>
                        <div class="mb-3 border-top pt-2">
                            <span class="d-block small"><i class="bi bi-geo-alt text-danger"></i> ${org.City} - ${org.FullAddress || ''}</span>
                            <span class="d-block small"><i class="bi bi-envelope text-success"></i> ${org.ContactEmail || 'لا يوجد إيميل'}</span>
                        </div>
                        <a href="mailto:${org.ContactEmail}" class="btn btn-outline-primary w-100 rounded-pill">تواصل مع المؤسسة</a>
                    </div>
                </div>
            </div>`;
    });
}

// 4. دالة البحث 
window.searchOrgs = function () {
    const input = document.getElementById('orgSearch');
    if (!input) return;
    const term = input.value.trim();
    fetchOrgs(term);
};

// 5. دالة الفلترة 
window.filterOrg = function (btn, type) {
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    btn.classList.add('active');
    const searchTerm = document.getElementById('orgSearch')?.value || '';
    fetchOrgs(searchTerm, type);
};