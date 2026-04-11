// ==========================================
// ملف admin.js المطور - ElderEase Dashboard
// ==========================================
const API_BASE_URL = '/api';
var requestToDelete = null;
var volunteerToDelete = null;

// 1. تشغيل الوظائف عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    fetchDashboardStats();
    renderInitialChart();
    loadAllRequests();
});

// 2. دالة التنقل بين الأقسام
function showSection(id, btn) {
    if (window.event) window.event.preventDefault();

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
}

// 3. وظيفة القائمة الجانبية
function toggleMenu() {
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('overlay');
    if (sidebar) sidebar.classList.toggle('open');
    if (overlay) overlay.classList.toggle('show');
}

// 4. جلب إحصائيات لوحة التحكم
async function fetchDashboardStats() {
    try {
        if (document.getElementById('stat-users')) document.getElementById('stat-users').innerText = "247";
        if (document.getElementById('stat-requests')) document.getElementById('stat-requests').innerText = "84";
        if (document.getElementById('stat-volunteers')) document.getElementById('stat-volunteers').innerText = "32";
        if (document.getElementById('stat-messages')) document.getElementById('stat-messages').innerText = "18";
    } catch (error) {
        console.error("خطأ في الإحصائيات:", error);
    }
}

// 5. الرسم البياني
function renderInitialChart() {
    const data = [8, 12, 5, 18, 7, 14, 10];
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const maxVal = Math.max(...data);
    const bc = document.getElementById('adminBarChart');
    const bl = document.getElementById('adminBarLabels');

    if (!bc || !bl) return;
    bc.innerHTML = ''; bl.innerHTML = '';

    data.forEach((v, i) => {
        const bar = document.createElement('div');
        bar.className = 'bar';
        const fill = document.createElement('div');
        fill.className = 'bar-fill';
        fill.style.background = '#c08457';
        fill.style.width = '100%';
        fill.style.borderRadius = '4px';
        bar.appendChild(fill);
        bc.appendChild(bar);

        const label = document.createElement('span');
        label.textContent = days[i];
        bl.appendChild(label);

        setTimeout(() => fill.style.height = (v / maxVal * 100) + '%', 200);
    });
}

// 6. جلب طلبات المساعدة مع إضافة بيانات ستاتيك للتجربة
async function loadAllRequests() {
    const tableBody = document.getElementById('all-requests-table');
    if (!tableBody) return;

    // بيانات ستاتيك للتجربة (الـ 3 طلبات التي طلبتِها)
    const staticData = [
        { id: 101, name: "أحمد محمد", type: "مرافقة طبية", description: "طلب مرافقة للمستشفى غداً", phone: "0501234567", date: "2026-04-10", status: "قيد الانتظار" },
        { id: 102, name: "سارة خالد", type: "تسوق منزلي", description: "شراء احتياجات غذائية", phone: "0507654321", date: "2026-04-09", status: "تم" },
        { id: 103, name: "محمود حسن", type: "دعم تقني", description: "مساعدة في تشغيل الهاتف", phone: "0559988776", date: "2026-04-11", status: "قيد الانتظار" }
    ];

    try {
        // محاولة جلب البيانات من السيرفر
        const response = await fetch(`${API_BASE_URL}/HelpRequests`);
        let realData = await response.json();

        // دمج البيانات الستاتيك مع بيانات السيرفر
        const allData = [...staticData, ...realData];
        displayRequests(allData);
    } catch (error) {
        // في حال فشل السيرفر، نعرض الستاتيك فقط للتجربة
        displayRequests(staticData);
    }
}

// دالة مساعدة لعرض الطلبات في الجدول
function displayRequests(data) {
    const tableBody = document.getElementById('all-requests-table');
    tableBody.innerHTML = '';
    data.forEach(req => {
        tableBody.innerHTML += `
            <tr>
                <td>${req.id}</td>
                <td>${req.name}</td>
                <td>${req.type}</td>
                <td>${req.description || 'لا يوجد وصف'}</td> 
                <td>${req.phone}</td>
                <td>${req.date}</td>
                <td><span class="status-badge ${req.status === 'تم' ? 's-active' : ''}">${req.status}</span></td>
                <td>
                    <button class="btn-tbl danger" onclick="confirmDelete(${req.id})">حذف</button>
                </td>
            </tr>`;
    });
}

// 7. إضافة متطوع وتفريغ الحقول
async function addVolunteer(e) {
    if (e) e.preventDefault();

    const nameInput = document.getElementById('new-vol-name');
    const specialtyInput = document.getElementById('new-vol-specialty');
    const phoneInput = document.getElementById('new-vol-phone');
    const hoursInput = document.getElementById('new-vol-hours');
    const nameError = document.getElementById('nameError');

    if (nameInput.value.trim() === "") {
        if (nameError) nameError.style.display = "block";
        nameInput.style.borderColor = "#dc3545";
        return;
    }

    const tableBody = document.getElementById('volunteers-table-body');
    if (tableBody) {
        const newRow = `
            <tr>
                <td>#</td>
                <td>${nameInput.value}</td>
                <td>${specialtyInput.options[specialtyInput.selectedIndex].text}</td>
                <td>${phoneInput.value}</td>
                <td>${hoursInput.value || 'غير محدد'}</td>
                <td><span class="status-badge s-active">نشط</span></td>
                <td>
                    <button class="btn-tbl danger" onclick="confirmDeleteVolunteer(this)">حذف</button>
                </td>
            </tr>`;
        tableBody.insertAdjacentHTML('afterbegin', newRow);
    }

    const modalEl = document.getElementById('addVolModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    if (modal) modal.hide();

    const form = document.getElementById('addVolunteerForm');
    if (form) form.reset();
}

// 8. وظائف المودال الأحمر لحذف المتطوع
function confirmDeleteVolunteer(btn) {
    volunteerToDelete = btn.closest('tr');
    requestToDelete = null;

    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.style.display = 'block';
        const deleteText = document.getElementById('deleteModalText');
        if (deleteText) deleteText.innerText = "هل أنتِ متأكدة من حذف هذا المتطوع؟";
    }
}

// 9. وظائف المودال الأحمر لحذف الطلبات
function confirmDelete(id) {
    requestToDelete = id;
    volunteerToDelete = null;

    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) {
        deleteModal.style.display = 'block';
        const deleteText = document.getElementById('deleteModalText');
        if (deleteText) deleteText.innerText = "هل أنتِ متأكدة من حذف الطلب رقم " + id + "؟";
    }
}

function closeConfirmModal() {
    const deleteModal = document.getElementById('deleteModal');
    if (deleteModal) deleteModal.style.display = 'none';
}

function finishDelete() {
    if (volunteerToDelete) {
        volunteerToDelete.remove();
        closeConfirmModal();
    } else if (requestToDelete) {
        const tableRows = document.querySelectorAll('#all-requests-table tr');
        tableRows.forEach(row => {
            if (row.cells[0] && row.cells[0].innerText == requestToDelete) {
                row.remove();
            }
        });
        closeConfirmModal();
    }
}