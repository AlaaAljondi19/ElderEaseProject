/* === assets/js/admin.js === */

document.addEventListener('DOMContentLoaded', () => {
    updateDashboardCounts();
});

function showSection(id, btn, e) {
    if (e) e.preventDefault();
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    
    const el = document.getElementById('section-' + id);
    if (el) el.classList.add('active');
    if (btn) btn.classList.add('active');
    
    const titles = {dashboard:'لوحة التحكم', requests:'طلبات المساعدة', volunteers:'المتطوعون', messages:'الرسائل'};
    document.getElementById('pageTitle').textContent = titles[id] || 'لوحة الإدارة';

    if (id === 'requests') fetchRequests();
    if (id === 'volunteers') fetchVolunteers();
    if (id === 'messages') fetchMessages();
    
    if (window.innerWidth <= 992) toggleMenu();
}

async function fetchRequests() {
    const tbody = document.getElementById('requestsTableBody');
    try {
        const res = await fetch('/api/Requests');
        const data = await res.json();
        document.getElementById('reqCount').textContent = data.length;
        tbody.innerHTML = '';
        data.forEach((req, i) => {
            tbody.innerHTML += `
                <tr>
                    <td>${i+1}</td>
                    <td>${req.fullName}</td>
                    <td>${req.requestType}</td>
                    <td><span class="status-badge ${req.status === 'Completed' ? 's-done' : 's-pending'}">${req.status}</span></td>
                    <td><button class="btn-tbl text-danger" onclick="deleteItem('Requests', ${req.id})"><i class="bi bi-trash"></i></button></td>
                </tr>`;
        });
    } catch (err) { console.error(err); }
}

async function fetchVolunteers() {
    const tbody = document.getElementById('volunteersTableBody');
    try {
        const res = await fetch('/api/Volunteers');
        const data = await res.json();
        tbody.innerHTML = '';
        data.forEach(v => {
            tbody.innerHTML += `
                <tr>
                    <td>${v.name}</td>
                    <td>${v.specialty || v.specialization}</td>
                    <td><span class="status-badge s-active">نشط</span></td>
                    <td><button class="btn-tbl text-danger" onclick="deleteItem('Volunteers', ${v.id})"><i class="bi bi-trash"></i></button></td>
                </tr>`;
        });
    } catch (err) { console.error(err); }
}

async function fetchMessages() {
    const tbody = document.getElementById('messagesTableBody');
    try {
        const res = await fetch('/api/Contact');
        const data = await res.json();
        tbody.innerHTML = '';
        data.forEach((msg, i) => {
            tbody.innerHTML += `
                <tr>
                    <td>${i+1}</td>
                    <td>${msg.name}</td>
                    <td>${msg.subject || 'استفسار'}</td>
                    <td>${msg.messageText || msg.content}</td>
                    <td><button class="btn-tbl text-danger" onclick="deleteItem('Contact', ${msg.id})"><i class="bi bi-trash"></i></button></td>
                </tr>`;
        });
    } catch (err) { console.error(err); }
}

async function deleteItem(api, id) {
    if (confirm('هل أنتِ متأكدة؟')) {
        await fetch(`/api/${api}/${id}`, { method: 'DELETE' });
        if (api === 'Requests') fetchRequests();
        else if (api === 'Volunteers') fetchVolunteers();
        else if (api === 'Contact') fetchMessages();
        updateDashboardCounts();
    }
}

async function updateDashboardCounts() {
    try {
        const [r, v, m] = await Promise.all([fetch('/api/Requests'), fetch('/api/Volunteers'), fetch('/api/Contact')]);
        const rd = await r.json(); const vd = await v.json(); const md = await m.json();
        document.getElementById('totalStats').textContent = rd.length + vd.length + md.length;
        document.getElementById('reqCount').textContent = rd.length;
    } catch (e) { console.log("Stats error"); }
}

function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}
