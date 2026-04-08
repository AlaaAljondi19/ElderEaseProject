// ==========================================
// ملف admin.js المطور - ElderEase Dashboard
// ==========================================

const API_BASE_URL = '/api';

// 1. تشغيل الوظائف عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => {
    fetchDashboardStats();
    renderInitialChart();
    loadAllRequests();
    // يمكنكِ إضافة بقية دوال الجداول هنا (loadVolunteers, loadUsers...)
});

// 2. دالة التنقل بين الأقسام (نسختكِ الأصلية مع تحسين)
function showSection(id, btn) {
    if (event) event.preventDefault();

    // إخفاء الأقسام وإلغاء تفعيل الروابط
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

    // إظهار القسم المطلوب
    const el = document.getElementById('section-' + id);
    if (el) el.classList.add('active');
    if (btn) btn.classList.add('active');

    // تحديث العنوان في الأعلى
    const titles = {
        dashboard: 'لوحة التحكم',
        requests: 'طلبات المساعدة',
        volunteers: 'المتطوعون',
        users: 'المستخدمون',
        organizations: 'المؤسسات',
        messages: 'الرسائل',
        settings: 'الإعدادات'
    };
    document.getElementById('pageTitle').textContent = titles[id] || '';

    if (window.innerWidth <= 992) toggleMenu();
}

// 3. وظيفة القائمة الجانبية للموبايل
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}

// 4. جلب إحصائيات لوحة التحكم (الارقام العلوية)
async function fetchDashboardStats() {
    try {
        // الربط الفعلي مع الباك إيند مستقبلاً:
        // const response = await fetch(`${API_BASE_URL}/Admin/stats`);
        // const data = await response.json();

        // تحديث العناصر بناءً على الـ IDs التي أضفناها
        document.getElementById('stat-users').innerText = "247";
        document.getElementById('stat-requests').innerText = "84";
        document.getElementById('stat-volunteers').innerText = "32";
        document.getElementById('stat-messages').innerText = "18";
    } catch (error) {
        console.error("خطأ في جلب الإحصائيات:", error);
    }
}

// 5. رسم البياني (منطقكِ الأصلي مع ربطه بـ ID الحاوية)
function renderInitialChart() {
    const data = [8, 12, 5, 18, 7, 14, 10];
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const maxVal = Math.max(...data);
    const bc = document.getElementById('adminBarChart'); // استخدمنا الـ ID الجديد
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

// 6. جلب طلبات المساعدة وعرضها في الجدول
// 6. جلب طلبات المساعدة وعرضها في الجدول
async function loadAllRequests() {
    const tableBody = document.getElementById('all-requests-table');
    if (!tableBody) return;

    // إظهار رسالة "جاري التحميل" بشكل بسيط
    tableBody.innerHTML = '<tr><td colspan="8" class="text-center">جاري جلب البيانات...</td></tr>';

    try {
        // 1. الربط الفعلي: ننتظر البيانات من السيرفر
        const response = await fetch(`${API_BASE_URL}/HelpRequests`);

        // 2. تحويل البيانات القادمة إلى JSON
        const realData = await response.json();

        tableBody.innerHTML = ''; // تفريغ الجدول من رسالة التحميل

        // 3. التأكد من أن البيانات ليست فارغة
        if (realData.length === 0) {
            tableBody.innerHTML = '<tr><td colspan="8" class="text-center">لا توجد طلبات حالياً</td></tr>';
            return;
        }

        // 4. عرض البيانات الحقيقية بدلاً من demoData
        realData.forEach(req => {
            tableBody.innerHTML += `
                <tr>
                    <td>${req.id}</td>
                    <td>${req.name}</td>
                    <td>${req.type}</td>
                    <td>${req.description || 'لا يوجد وصف'}</td> 
                    <td>${req.phone}</td>
                    <td>${req.date || '2026-04-09'}</td>
                    <td><span class="status-badge ${req.status === 'تم' ? 's-active' : ''}">${req.status}</span></td>
                    <td>
                        <div class="d-flex gap-1">
                            <button class="btn-tbl" onclick="updateStatus(${req.id})">تم</button>
                            <button class="btn-tbl danger" onclick="confirmDelete(${req.id})">حذف</button>
                        </div>
                    </td>
                </tr>`;
        });
    } catch (error) {
        console.error("فشل جلب البيانات:", error);
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center text-danger">خطأ في الاتصال بالسيرفر!</td></tr>';
    }
}


// 7. إضافة متطوع جديد (POST)
async function addVolunteer(e) {// أضيفي هذا في أول دالة addVolunteer
    const nameInput = document.getElementById('new-vol-name');
    const nameError = document.getElementById('nameError');
    event.preventDefault();
    if (nameInput.value.trim() === "") {
        nameError.style.display = "block"; // إظهار النص الأحمر
        nameInput.style.borderColor = "#dc3545"; // تلوين حدود الحقل بالأحمر
        nameInput.focus();
        return; // منع إرسال البيانات
    } else {
        nameError.style.display = "none";
        nameInput.style.borderColor = "";
    }
    e.preventDefault();

    // جمع البيانات من النموذج
    const formData = {
        name: document.getElementById('new-vol-name').value,
        specialty: document.getElementById('new-vol-specialty').value,
        phone: document.getElementById('new-vol-phone').value,
        hours: document.getElementById('new-vol-hours').value
    };

    console.log("إرسال البيانات للـ API:", formData);

    // إغلاق المودال وتحديث الواجهة
    const modalEl = document.getElementById('addVolModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();
    alert('تمت الإضافة بنجاح! (تم تجهيز الكود للربط بالـ API)');
}

// 8. حذف طلب (DELETE)
// متغير عام لحفظ رقم الطلب
var requestToDelete = null;

function confirmDelete(id) {
    // حفظ الرقم
    requestToDelete = id;

    // إظهار النافذة (تأكدي أن الـ ID مطابق للـ HTML)
    const myModal = document.getElementById('deleteModal');
    if (myModal) {
        myModal.style.display = 'block';
        document.getElementById('deleteModalText').innerText = "هل أنتِ متأكدة من حذف الطلب رقم " + id + "؟";
    }
}

// تأكدي أن هذه الدوال موجودة في آخر سطر في الملف، وليست داخل أي قوس آخر
function closeConfirmModal() {
    const myModal = document.getElementById('deleteModal');
    if (myModal) {
        myModal.style.display = 'none';
    }
}

async function loadAllRequests() {
    const tableBody = document.getElementById('all-requests-table');
    if (!tableBody) return;

    try {
        // جلب البيانات الحقيقية من السيرفر
        const response = await fetch(`${API_BASE_URL}/HelpRequests`);
        const realData = await response.json();

        tableBody.innerHTML = ''; // تفريغ الجدول
        realData.forEach(req => {
            // كود رسم الصفوف (نفس كودك الحالي)
        });
    } catch (e) {
        console.error("خطأ في جلب البيانات:", e);


    }
}