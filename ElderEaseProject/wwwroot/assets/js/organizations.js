/* === organizations.js - النسخة الديناميكية المعتمدة (F2) === */

const API_ORGS = '/api/Organizations';

// 1. جلب البيانات عند التشغيل
document.addEventListener('DOMContentLoaded', () => {
    fetchOrgs();
});

// 2. دالة الجلب والبحث والفلترة (تغطي كل الحالات)
async function fetchOrgs(searchTerm = '', type = 'all') {
    const grid = document.getElementById('orgsGrid');
    if (!grid) return;

    try {
        // إظهار مؤشر التحميل
        grid.innerHTML = `
            <div class="col-12 text-center p-5">
                <div class="spinner-border text-primary" role="status"></div>
                <p class="mt-2 text-muted">جاري تحميل المؤسسات...</p>
            </div>`;

        // بناء الرابط مع الـ Parameters للسيرفر
        let url = `${API_ORGS}?`;
        if (searchTerm) url += `search=${searchTerm}&`;
        if (type !== 'all') url += `type=${type}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error();

        const data = await response.json();
        renderOrgs(data);
    } catch (e) {
        console.error("فشل الاتصال بالباك إند");
        grid.innerHTML = '<p class="text-center w-100 p-5 text-muted">عذراً، فشل جلب البيانات من السيرفر.</p>';
    }
}

// 3. دالة الرسم (Render) - تجعل البيانات تظهر ديناميكياً
function renderOrgs(orgs) {
    const grid = document.getElementById('orgsGrid');
    grid.innerHTML = '';

    if (orgs.length === 0) {
        grid.innerHTML = '<p class="text-center w-100 p-5 text-muted">لا توجد نتائج تطابق بحثك.</p>';
        return;
    }

    orgs.forEach(org => {
        grid.innerHTML += `
            <div class="col-md-6 col-lg-4 mb-4">
                <div class="org-card h-100 shadow-sm border-0">
                    <img src="${org.image || 'assets/img/org-default.jpg'}" class="card-img-top" alt="${org.name}">
                    <div class="card-body">
                        <h5 class="fw-bold">${org.name}</h5>
                        <p class="text-muted small">${org.description}</p>
                        <div class="mb-3">
                            <span class="d-block"><i class="bi bi-geo-alt text-primary"></i> ${org.address}</span>
                            <span class="d-block"><i class="bi bi-telephone text-success"></i> ${org.phone}</span>
                        </div>
                        <a href="${org.website}" target="_blank" class="btn btn-outline-primary w-100">زيارة الموقع</a>
                    </div>
                </div>
            </div>`;
    });
}

// 4. دالة البحث (تعديل دالتك لتطلب من السيرفر)
function searchOrgs() {
    const input = document.getElementById('orgSearch');
    const term = input.value.trim();
    const activeType = document.querySelector('.filter-tab.active')?.getAttribute('onclick').match(/'([^']+)'/)[1] || 'all';

    fetchOrgs(term, activeType);
}

// 5. دالة الفلترة (تعديل دالتك لتطلب من السيرفر)
function filterOrg(btn, type) {
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    btn.classList.add('active');

    const searchTerm = document.getElementById('orgSearch').value;
    fetchOrgs(searchTerm, type);
}