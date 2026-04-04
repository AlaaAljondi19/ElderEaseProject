const API_ENDPOINTS = {
    stats: '/api/Dashboard/Stats',
    requests: '/api/HelpRequests',
    volunteers: '/api/Volunteers',
    users: '/api/Users',
    organizations: '/api/Organizations',
    messages: '/api/Contact'
};

const ROWS_PER_PAGE = 10;

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardStats();
    fetchAllSections();
});

async function fetchData(type, renderCallbackName, page = 1) {
    try {
        const response = await fetch(`${API_ENDPOINTS[type]}?page=${page}&pageSize=${ROWS_PER_PAGE}`);
        const result = await response.json();
        const data = result.data || result;
        const totalCount = result.totalCount || (Array.isArray(result) ? result.length : 0);

        // تنفيذ دالة العرض بناءً على اسمها
        window[renderCallbackName](data);
        renderPagination(type, renderCallbackName, totalCount, page);
    } catch (error) {
        console.warn(`API ${type} simulation: Rendering static/demo data.`);
    }
}

// دالة عرض الترقيم
function renderPagination(type, callbackName, totalItems, currentPage) {
    const totalPages = Math.ceil(totalItems / ROWS_PER_PAGE);
    const containerId = `pagination-${type}`;
    let container = document.getElementById(containerId);

    if (!container) {
        const section = document.getElementById(`section-${type}`);
        if (!section) return;
        const tableCard = section.querySelector('.table-card');
        container = document.createElement('div');
        container.id = containerId;
        container.className = 'pagination-container';
        tableCard.appendChild(container);
    }

    if (totalPages <= 1) { container.innerHTML = ''; return; }

    container.innerHTML = `
        <button class="btn-tbl ${currentPage === 1 ? 'disabled' : ''}" onclick="fetchData('${type}', '${callbackName}', ${currentPage - 1})">السابق</button>
        <span class="page-info">صفحة ${currentPage} من ${totalPages}</span>
        <button class="btn-tbl ${currentPage === totalPages ? 'disabled' : ''}" onclick="fetchData('${type}', '${callbackName}', ${currentPage + 1})">التالي</button>
    `;
}

// دوال الواجهة (UI Helpers)
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}

function showSection(id, btn) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

    document.getElementById('section-' + id).classList.add('active');
    if (btn) btn.classList.add('active');

    document.getElementById('pageTitle').textContent = id;
    if (window.innerWidth <= 992) toggleMenu();
}

function fetchAllSections() {
    fetchData('requests', 'renderRequests');
    fetchData('volunteers', 'renderVolunteers');
}

// جعل الدوال متاحة عالمياً للأزرار
window.fetchData = fetchData;
window.renderRequests = function (data) { /* كود العرض الأصلي */ };