/* === assets/js/admin.js === */

document.addEventListener('DOMContentLoaded', () => {
    // تحديث الأرقام في لوحة التحكم عند البداية
    updateDashboardCounts();
});

// 1. التنقل بين الأقسام (تعديل المهام 1 و 6)
function showSection(id, btn, e) {
    if (e) e.preventDefault();
    
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    
    const el = document.getElementById('section-' + id);
    if (el) el.classList.add('active');
    if (btn) btn.classList.add('active');
    
    const titles = {
        dashboard: 'لوحة التحكم', 
        requests: 'طلبات المساعدة', 
        volunteers: 'المتطوعون',
        messages: 'الرسائل الواردة'
    };
    document.getElementById('pageTitle').textContent = titles[id] || 'لوحة الإدارة';

    // جلب البيانات ديناميكياً عند فتح القسم
    if (id === 'requests') fetchRequests();
    if (id === 'volunteers') fetchVolunteers();
    if (id === 'messages') fetchMessages();
    
    if (window.innerWidth <= 992) toggleMenu();
}

// 2. جلب طلبات المساعدة (المهمة 6)
async function fetchRequests() {
    const tbody = document.getElementById('requestsTableBody');
    const reqCountBadge = document.getElementById('reqCount');
    
    try {
        const response = await fetch('/api/Requests');
        const data = await response.json();
        
        if (reqCountBadge) reqCountBadge.textContent = data.length;
        tbody.innerHTML = '';
        
        data.forEach((req, i) => {
            const statusClass = req.status === 'Completed' ? 's-done' : 's-pending';
            const statusText = req.status === 'Completed' ? 'مكتمل' : 'قيد الانتظار';

            tbody.innerHTML += `
                <tr>
                    <td>${i + 1}</td>
                    <td><strong>${req.fullName}</strong></td>
                    <td>${req.requestType}</td>
                    <td><span class="status-badge ${statusClass}">${statusText}</span></td>
                    <td>
                        <div class="d-flex gap-1">
                            <button class="btn-tbl text-success" title="اعتماد" onclick="updateRequestStatus(${req.id})"><i class="bi bi-check-circle"></i></button>
                            <button class="btn-tbl text-danger" title="حذف" onclick="deleteItem('Requests', ${req.id})"><i class="bi bi-trash"></i></button>
                        </div>
                    </td>
                </tr>`;
        });
    } catch (err) { 
        console.error("Error fetching requests", err);
        tbody.innerHTML = '<tr><td colspan="5" class="text-center text-danger">خطأ في جلب البيانات</td></tr>';
    }
}

// 3. جلب وفلترة المتطوعين (المهمة 1 و 2)
async function fetchVolunteers() {
    try {
        const response = await fetch('/api/Volunteers');
        const data = await response.json();
        renderVolunteers(data);
    } catch (err) { console.error("Error fetching volunteers", err); }
}

function renderVolunteers(data) {
    const tbody = document.getElementById('volunteersTableBody');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    data.forEach(v => {
        tbody.innerHTML += `
            <tr>
                <td>
                   <div class="d-flex align-items-center gap-2">
                      <div class="admin-avatar" style="width:30px; height:30px; font-size:12px;">${v.name[0]}</div>
                      ${v.name}
                   </div>
                </td>
                <td>${v.specialty || v.specialization}</td>
                <td><span class="status-badge s-active">نشط</span></td>
                <td>
                    <button class="btn-tbl text-primary" onclick="editVolunteer(${v.id})">تعديل</button>
                    <button class="btn-tbl text-danger" onclick="deleteItem('Volunteers', ${v.id})"><i class="bi bi-x-circle"></i></button>
                </td>
            </tr>`;
    });
}

// 4. حذف عنصر (المهمة 8 - CRUD)
async function deleteItem(api, id) {
    if (confirm('هل أنتِ متأكدة من عملية الحذف؟')) {
        try {
            await fetch(`/api/${api}/${id}`, { method: 'DELETE' });
            if (api === 'Requests') fetchRequests();
            else if (api === 'Volunteers') fetchVolunteers();
            updateDashboardCounts();
        } catch (err) { alert('حدث خطأ أثناء الحذف'); }
    }
}

// 5. تحديث الأرقام في الواجهة الرئيسية (Dashboard Stats)
async function updateDashboardCounts() {
    try {
        const [reqRes, volRes] = await Promise.all([
            fetch('/api/Requests'),
            fetch('/api/Volunteers')
        ]);
        const requests = await reqRes.json();
        const volunteers = await volRes.json();
        
        // تحديث العدادات في المربعات العلوية (إذا كانت موجودة)
        const userStat = document.getElementById('totalUsersStat');
        if (userStat) userStat.textContent = requests.length + volunteers.length;
        
        const reqCountBadge = document.getElementById('reqCount');
        if (reqCountBadge) reqCountBadge.textContent = requests.length;
    } catch (err) { console.log("Stats update failed"); }
}

// 6. القائمة الجانبية للموبايل
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
}
