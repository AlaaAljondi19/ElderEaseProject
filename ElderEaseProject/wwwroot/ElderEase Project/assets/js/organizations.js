// بيانات تجريبية في حال عدم استجابة الـ API
const fallbackData = [
    { name: "مستشفى الملك حسين", type: "health", description: "خدمات طبية متكاملة بأسعار مدعومة مع أطباء متخصصين في طب الشيخوخة.", phone: "065300970", location: "عمان - الحسين", hours: "8ص - 8م" },
    { name: "جمعية رعاية المسنين", type: "charity", description: "تقدم دعماً اجتماعياً ومالياً وغذائياً لكبار السن المحتاجين وأسرهم.", phone: "065234567", location: "عمان - الجبيهة", website: "www.eldercare.jo" },
    { name: "صندوق التقاعد المدني", type: "retire", description: "إدارة معاشات المتقاعدين وتقديم الخدمات المالية والاستفسار عن المستحقات.", phone: "065006900", location: "عمان - الدوار الثالث", hours: "8ص - 3م" },
    { name: "هيئة تكافل الأردن", type: "charity", description: "برامج دعم غذائي ومالي مستدام للأسر والمسنين المحتاجين.", phone: "065100300", website: "www.tkful.jo" },
    { name: "الهلال الأحمر الأردني", type: "health", description: "خدمات طوارئ وإسعاف ودعم إنساني وتوزيع مساعدات لكبار السن.", phone: "064773141", location: "عمان - الوحدات", hours: "24 ساعة" }
];

const API_URL = '/api/Organizations';
const orgsGrid = document.getElementById('orgsGrid');
const searchInput = document.getElementById('orgSearch');

document.addEventListener('DOMContentLoaded', () => {
    fetchOrgs();
});

async function fetchOrgs(query = '', type = 'all') {
    try {
        // محاولة جلب البيانات من السيرفر
        let url = `${API_URL}?search=${encodeURIComponent(query)}`;
        if (type !== 'all') url += `&type=${type}`;

        // ملاحظة: قمت بوضع تعليق هنا لأنه لا يوجد سيرفر حقيقي حالياً
        // const response = await fetch(url);
        // const data = await response.json();
        // renderOrgs(data);

        // استخدام البيانات الثابتة للتطوير حالياً
        const filteredData = fallbackData.filter(org => {
            const matchesSearch = org.name.includes(query) || org.description.includes(query);
            const matchesType = type === 'all' || org.type === type;
            return matchesSearch && matchesType;
        });
        renderOrgs(filteredData);

    } catch (error) {
        console.warn("API غير متاح، تم استخدام البيانات المحلية.");
        renderOrgs(fallbackData);
    }
}

function searchOrgs() {
    const activeBtn = document.querySelector('.filter-tab.active');
    const type = activeBtn.innerText.includes('صحي') ? 'health' :
        activeBtn.innerText.includes('خيري') ? 'charity' :
            activeBtn.innerText.includes('تقاعد') ? 'retire' : 'all';
    fetchOrgs(searchInput.value, type);
}

function filterOrg(btn, type) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    fetchOrgs(searchInput.value, type);
}

function renderOrgs(orgs) {
    orgsGrid.innerHTML = '';
    const noResults = document.getElementById('noResults');

    if (orgs.length === 0) {
        noResults.classList.remove('d-none');
        return;
    }

    noResults.classList.add('d-none');
    orgs.forEach(org => {
        const badge = getBadgeInfo(org.type);
        const card = `
            <div class="col-md-6 col-lg-4">
                <div class="org-card h-100">
                    <span class="org-type ${badge.class}"><i class="bi ${badge.icon} me-1"></i> ${badge.label}</span>
                    <h5>${org.name}</h5>
                    <p>${org.description}</p>
                    <div class="org-contact-details">
                        ${org.phone ? `<div class="org-item"><i class="bi bi-telephone-fill"></i> <a href="tel:${org.phone}">${org.phone}</a></div>` : ''}
                        ${org.location ? `<div class="org-item"><i class="bi bi-geo-alt-fill"></i> ${org.location}</div>` : ''}
                        ${org.website ? `<div class="org-item"><i class="bi bi-globe"></i> <a href="https://${org.website}" target="_blank">${org.website}</a></div>` : ''}
                        ${org.hours ? `<div class="org-item"><i class="bi bi-clock-fill"></i> ${org.hours}</div>` : ''}
                    </div>
                </div>
            </div>`;
        orgsGrid.insertAdjacentHTML('beforeend', card);
    });
}

function getBadgeInfo(type) {
    const types = {
        health: { class: 'org-health', label: 'صحية', icon: 'bi-hospital' },
        charity: { class: 'org-charity', label: 'خيرية', icon: 'bi-heart-fill' },
        retire: { class: 'org-retire', label: 'تقاعد', icon: 'bi-piggy-bank-fill' }
    };
    return types[type] || { class: 'org-general', label: 'عامة', icon: 'bi-building' };
}