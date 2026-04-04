/* === admin.js === */

// 1. التنقل بين الأقسام
function showSection(id, btn, e) {
    if (e) e.preventDefault();
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    
    const el = document.getElementById('section-' + id);
    if (el) el.classList.add('active');
    if (btn) btn.classList.add('active');
    
    const titles = {dashboard:'لوحة التحكم', requests:'طلبات المساعدة', volunteers:'المتطوعون'};
    document.getElementById('pageTitle').textContent = titles[id] || 'لوحة الإدارة';

    // جلب البيانات عند فتح القسم (المهام 1 و 6)
    if (id === 'requests') fetchRequests();
    if (id === 'volunteers') fetchVolunteers();
    
    if (window.innerWidth <= 992) toggleMenu();
}

// 2. جلب طلبات المساعدة (المهمة 6)
async function fetchRequests() {
    const tbody = document.getElementById('requestsTableBody');
    try {
        const response = await fetch('/api/Requests');
        const data = await response.json();
        tbody.innerHTML = '';
        data.forEach((req, i) => {
            tbody.innerHTML += `
                <tr>
                    <td>${i+1}</td>
                    <td>${req.fullName}</td>
                    <td>${req.requestType}</td>
                    <td><span class="status-badge ${req.status === 'Completed' ? 's-done' : 's-pending'}">${req.status}</span></td>
                    <td>
                        <button class="btn-tbl danger" onclick="deleteItem('Requests', ${req.id})"><i class="bi bi-trash"></i></button>
                    </td>
                </tr>`;
        });
    } catch (err) { console.error("Error fetching requests", err); }
}

// 3. جلب وفلترة المتطوعين (المهمة 1 و 2)
async function fetchVolunteers() {
    const tbody = document.getElementById('volunteersTableBody');
    try {
        const response = await fetch('/api/Volunteers');
        const data = await response.json();
        renderVolunteers(data);
    } catch (err) { console.error("Error fetching volunteers", err); }
}

function renderVolunteers(data) {
    const tbody = document.getElementById('volunteersTableBody');
    tbody.innerHTML = '';
    data.forEach(v => {
        tbody.innerHTML += `
            <tr>
                <td>${v.name}</td>
                <td>${v.specialty}</td>
                <td><span class="status-badge s-active">نشط</span></td>
                <td><button class="btn-tbl">تعديل</button></td>
            </tr>`;
    });
}

// 4. حذف عنصر (المهمة 8 - CRUD)
async function deleteItem(api, id) {
    if (confirm('هل أنتِ متأكدة؟')) {
        await fetch(`/api/${api}/${id}`, { method: 'DELETE' });
        if (api === 'Requests') fetchRequests();
        else fetchVolunteers();
    }
}

// 5. القائمة الجانبية للموبايل
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}
