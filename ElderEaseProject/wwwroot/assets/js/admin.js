/* === admin.js === */

// 1. التنقل بين الأقسام (تعديل المعامل e ليكون صحيحاً)
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
        users: 'المستخدمون',
        organizations: 'المؤسسات',
        messages: 'الرسائل',
        settings: 'الإعدادات'
    };
    
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) pageTitle.textContent = titles[id] || '';
    
    if (window.innerWidth <= 992) toggleMenu();

    // تشغيل جلب البيانات عند فتح قسم معين (تطبيق المهام 1 و 6)
    if (id === 'volunteers') fetchVolunteers();
    if (id === 'requests') fetchRequests();
}

// 2. جلب بيانات المتطوعين من الـ API (المهمة رقم 1 في الصورة)
async function fetchVolunteers() {
    try {
        const response = await fetch('/api/Volunteers'); // الرابط المطلوب في المهمة
        if (!response.ok) throw new Error('Failed to fetch');
        const volunteers = await response.json();
        renderVolunteersTable(volunteers);
    } catch (error) {
        console.error('Error:', error);
    }
}

// 3. فلترة المتطوعين حسب التخصص (المهمة رقم 2 في الصورة)
async function filterVolunteers(specialty) {
    try {
        const response = await fetch(`/api/Volunteers?specialty=${specialty}`);
        const data = await response.json();
        renderVolunteersTable(data);
    } catch (error) {
        console.error('Filtering error:', error);
    }
}

// 4. جلب طلبات المساعدة (المهمة رقم 6 في الصورة)
async function fetchRequests() {
    try {
        const response = await fetch('/api/Requests'); // تأكدي من المسار مع الـ Backend
        const requests = await response.json();
        const tbody = document.querySelector('#section-requests tbody');
        if (!tbody) return;

        tbody.innerHTML = ''; // تفريغ الجدول قبل التعبئة
        requests.forEach((req, index) => {
            tbody.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${req.name}</td>
                    <td>${req.type}</td>
                    <td>${req.phone}</td>
                    <td><span class="badge ${req.status === 'done' ? 'bg-success' : 'bg-warning'}">${req.status}</span></td>
                    <td>
                        <button class="btn btn-sm btn-outline-danger" onclick="deleteRequest(${req.id})">
                            <i class="bi bi-trash"></i>
                        </button>
                    </td>
                </tr>`;
        });
    } catch (error) {
        console.group('Requests Load Error');
        console.error(error);
        console.groupEnd();
    }
}

// 5. وظيفة الحذف (جزء من المهمة 6 و 8 - CRUD)
async function deleteRequest(id) {
    if (confirm('هل أنتِ متأكدة من حذف هذا الطلب؟')) {
        try {
            const response = await fetch(`/api/Requests/${id}`, { method: 'DELETE' });
            if (response.ok) fetchRequests(); // تحديث الجدول بعد الحذف
        } catch (error) {
            alert('حدث خطأ أثناء الحذف');
        }
    }
}

// 6. القائمة الجانبية للموبايل
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
}
