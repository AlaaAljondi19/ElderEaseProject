/* === organizations.js - النسخة المعدلة مع السبينر والربط المعتمد === */
const API_ORGS = 'https://localhost:7188/api/Organizations';

document.addEventListener('DOMContentLoaded', () => {
    fetchOrgs();
});

async function fetchOrgs(searchTerm = '', type = 'all') {
    const grid = document.getElementById('orgsGrid');
    if (!grid) return;

    try {
        // 1. إظهار السبينر بحجم كبير وواضح (طلب الليدر)
        grid.innerHTML = `
            <div class="col-12 text-center p-5">
                <div class="spinner-border text-primary" role="status" style="width: 3.5rem; height: 3.5rem;"></div>
                <p class="mt-3 text-muted fw-bold">جاري تحميل بيانات المؤسسات من السيرفر...</p>
            </div>`;

        let url = `${API_ORGS}?`;
        if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}&`;
        if (type !== 'all') url += `type=${type}`;

        const response = await fetch(url);

        if (response.status === 401) {
            grid.innerHTML = '<p class="text-center w-100 p-5 text-danger">خطأ 401: يرجى فتح الصلاحيات للمؤسسات في الباك إند.</p>';
            return;
        }

        if (!response.ok) throw new Error();

        const data = await response.json();
        renderOrgs(data);
    } catch (e) {
        grid.innerHTML = '<p class="text-center w-100 p-5 text-muted">عذراً، فشل جلب البيانات من السيرفر. تأكدي من تشغيل Visual Studio.</p>';
    }
}

function renderOrgs(orgs) {
    const grid = document.getElementById('orgsGrid');
    grid.innerHTML = '';

    if (orgs.length === 0) {
        grid.innerHTML = '<p class="text-center w-100 p-5 text-muted">لا توجد نتائج تطابق بحثك حالياً.</p>';
        return;
    }

    orgs.forEach(org => {
        // الحفاظ على الأسماء PascalCase كما هي في السواجر
        grid.innerHTML += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="org-card h-100 shadow-sm border-0" style="border-radius: 15px; overflow: hidden;">
                    <div class="p-4 text-center bg-light border-bottom">
                        <i class="bi bi-building text-primary" style="font-size: 3rem;"></i>
                    </div>
                    <div class="card-body text-end">
                        <h5 class="fw-bold text-dark">${org.OrgName}</h5> 
                        <p class="text-primary small mb-2">${org.ActivityType}</p>
                        <p class="text-muted small" style="min-height: 40px;">${org.Description || 'لا يوجد وصف متاح'}</p>
                        <div class="mb-3 border-top pt-2">
                   <span class="d-block small"><i class="bi bi-geo-alt text-danger"></i> ${org.City}
                            <span class="d-block small mt-1"><i class="bi bi-envelope text-success"></i> ${org.ContactEmail || 'لا يوجد إيميل'}</span>
                        </div>
                        <a href="mailto:${org.ContactEmail}" class="btn btn-outline-primary w-100 rounded-pill mt-2">تواصل مع المؤسسة</a>
                    </div>
                </div>
            </div>`;
    });
}

// دالة البحث
window.searchOrgs = function () {
    const input = document.getElementById('orgSearch');
    if (!input) return;
    const term = input.value.trim();
    fetchOrgs(term);
};

// دالة الفلترة
window.filterOrg = function (btn, type) {
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    btn.classList.add('active');
    const searchTerm = document.getElementById('orgSearch')?.value || '';
    fetchOrgs(searchTerm, type);
};