const API_BASE = "https://localhost:7188";

function showTableSpinner(tableId, colSpan) {
    const table = document.getElementById(tableId);
    if (table) {
        table.innerHTML = `
            <tr>
                <td colspan="${colSpan}" class="text-center p-5">
                    <div class="spinner-border text-primary" role="status"></div>
                    <p class="mt-2 text-muted">جاري جلب البيانات من السيرفر...</p>
                </td>
            </tr>`;
    }
}

// 1. تحميل طلبات المساعدة
async function loadAppointments() {
    showTableSpinner("all-requests-table", 8);
    try {
        const res = await fetch(`${API_BASE}/api/HelpRequests`);
        if (!res.ok) throw new Error();
        const data = await res.json();

        const table = document.getElementById("all-requests-table");
        const recentTable = document.getElementById("recent-requests-list");

        if (table) {
            table.innerHTML = data.length ? "" : '<tr><td colspan="8" class="text-center p-4">لا توجد طلبات</td></tr>';
            data.forEach(a => {
                table.innerHTML += `
                    <tr>
                        <td>${a.Id}</td>
                        <td>${a.Name || "بدون اسم"}</td>
                        <td>${a.ProblemType || "طلب عام"}</td>
                        <td>${a.Description || "-"}</td>
                        <td>${a.Phone || "-"}</td>
                        <td>${a.CreatedAt ? new Date(a.CreatedAt).toLocaleDateString('ar-EG') : "-"}</td>
                        <td><span class="status-badge ${a.Status === 'Completed' ? 's-done' : 's-pending'}">${a.Status === 'Completed' ? '✓ تمت' : '⏳ قيد المعالجة'}</span></td>
                        <td>
                            <div class="d-flex gap-1">
                                <button class="btn-tbl danger" id="del-req-${a.Id}" onclick="deleteRequest(${a.Id})">حذف</button>
                            </div>
                        </td>
                    </tr>`;
            });
        }

        if (recentTable) {
            recentTable.innerHTML = "";
            data.slice(0, 5).forEach(a => {
                recentTable.innerHTML += `
                    <tr>
                        <td>${a.Id}</td>
                        <td>${a.Name || "بدون اسم"}</td>
                        <td>${a.ProblemType || "-"}</td>
                        <td>${a.CreatedAt ? new Date(a.CreatedAt).toLocaleDateString('ar-EG') : "-"}</td>
                        <td><span class="status-badge ${a.Status === 'Completed' ? 's-done' : 's-pending'}">${a.Status === 'Completed' ? '✓ تمت' : '⏳ قيد المعالجة'}</span></td>
                        <td><button class="btn-tbl danger" onclick="deleteRequest(${a.Id})">حذف</button></td>
                    </tr>`;
            });
        }

        const count = data.length; renderChart(data);
        if (document.getElementById("requests-count")) document.getElementById("requests-count").innerText = count;
        if (document.getElementById("badge-requests")) document.getElementById("badge-requests").innerText = count;
        return count;
    } catch (err) {
        const t = document.getElementById("all-requests-table");
        if (t) t.innerHTML = '<tr><td colspan="8" class="text-center text-muted p-4">تعذر الاتصال بالسيرفر</td></tr>';
        return 0;
    }
}

// 2. تحميل المتطوعين
async function loadVolunteers() {
    showTableSpinner("volunteers-table-body", 7);
    try {
        const res = await fetch(`${API_BASE}/api/Volunteers`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const table = document.getElementById("volunteers-table-body");
        if (table) {
            table.innerHTML = data.length ? "" : '<tr><td colspan="7" class="text-center p-4">لا يوجد متطوعين</td></tr>';
            data.forEach(v => {
                table.innerHTML += `
                    <tr>
                        <td>${v.Id}</td>
                        <td>${v.FullName}</td>
                        <td>${v.Specialization || "-"}</td>
                        <td>${v.PhoneNumber || "-"}</td>
                        <td>${v.AvailableHoursPerWeek || "0"} ساعة</td>
                        <td><span class="status-badge s-active">● نشط</span></td>
                        <td>
                            <div class="d-flex gap-1">
                                <button class="btn-tbl danger" id="del-vol-${v.Id}" onclick="deleteVolunteer(${v.Id})">حذف</button>
                            </div>
                        </td>
                    </tr>`;
            });
        }
        const count = data.length;
        if (document.getElementById("volunteers-count")) document.getElementById("volunteers-count").innerText = count;
        return count;
    } catch (err) { return 0; }
}

// 3. تحميل المؤسسات
async function loadOrganizations() {
    showTableSpinner("orgs-table-body", 7);
    try {
        const res = await fetch(`${API_BASE}/api/Organizations`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const table = document.getElementById("orgs-table-body");
        if (table) {
            table.innerHTML = data.length ? "" : '<tr><td colspan="7" class="text-center p-4">لا توجد مؤسسات</td></tr>';
            data.forEach(o => {
                table.innerHTML += `
                    <tr>
                        <td>${o.Id}</td>
                        <td>${o.OrgName}</td>
                        <td>${o.ActivityType}</td>
                        <td>${o.ContactEmail || "-"}</td>
                        <td>${o.City}</td>
                        <td><span class="status-badge s-active">● نشط</span></td>
                        <td>
                            <div class="d-flex gap-1">
                                <button class="btn-tbl danger" onclick="deleteOrganization(${o.Id})">حذف</button>
                            </div>
                        </td>
                    </tr>`;
            });
        }
        return data.length;
    } catch (err) { return 0; }
}

// 4. تحميل الرسائل
async function loadMessages() {
    showTableSpinner("messages-table-body", 7);
    try {
        const res = await fetch(`${API_BASE}/api/ContactMessages`);
        if (!res.ok) throw new Error();
        const data = await res.json();
        const table = document.getElementById("messages-table-body");
        if (table) {
            table.innerHTML = data.length ? "" : '<tr><td colspan="7" class="text-center p-4">لا توجد رسائل</td></tr>';
            data.forEach(m => {
                table.innerHTML += `
                    <tr>
                        <td>${m.Id}</td>
                        <td>${m.Name}</td>
                        <td>${m.Email}</td>
                        <td>${m.Subject}</td>
                        <td>${m.MessageContent ? m.MessageContent.substring(0, 50) + '...' : '-'}</td>
                        <td>${m.SentDate ? new Date(m.SentDate).toLocaleDateString('ar-EG') : "-"}</td>
                        <td>
                            <div class="d-flex gap-1">
                                <button class="btn-tbl danger" id="del-msg-${m.Id}" onclick="deleteMessage(${m.Id})">حذف</button>
                            </div>
                        </td>
                    </tr>`;
            });
        }
        const count = data.length;
        if (document.getElementById("messages-count")) document.getElementById("messages-count").innerText = count;
        if (document.getElementById("badge-messages")) document.getElementById("badge-messages").innerText = count;
        return count;
    } catch (err) { return 0; }
}

// 5. إضافة متطوع
async function addVolunteer(e) {
    e.preventDefault();
    const fullName = document.getElementById("new-vol-name").value.trim();
    const email = document.getElementById("new-vol-email").value.trim();
    const nameError = document.getElementById("nameError");

    if (!fullName) { nameError.style.display = "block"; return; }
    nameError.style.display = "none";

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> جاري الإضافة...`;

    const payload = {
        Id: 0,
        FullName: fullName,
        Email: email || `${fullName.replace(/\s/g, "").toLowerCase()}@elderease.com`,
        PhoneNumber: document.getElementById("new-vol-phone").value.trim(),
        Specialization: document.getElementById("new-vol-specialty").value,
        AvailableHoursPerWeek: parseInt(document.getElementById("new-vol-hours").value) || 0,
        ExperienceSummary: "",
        Address: "",
        RegistrationDate: new Date().toISOString()
    };

    try {
        const res = await fetch(`${API_BASE}/api/Volunteers`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            bootstrap.Modal.getInstance(document.getElementById("addVolModal")).hide();
            e.target.reset();
            await refreshDashboard();
            alert("✅ تمت إضافة المتطوع بنجاح!");
        } else {
            alert("❌ فشل الإضافة");
        }
    } catch (err) {
        alert("تعذر الاتصال بالسيرفر");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// 6. إضافة مؤسسة
async function addOrganization(e) {
    e.preventDefault();
    const orgName = document.getElementById("new-org-name").value.trim();
    const city = document.getElementById("new-org-city").value.trim();
    const orgNameError = document.getElementById("orgNameError");

    if (!orgName) { orgNameError.style.display = "block"; return; }
    orgNameError.style.display = "none";

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm"></span> جاري الإضافة...`;

    const payload = {
        Id: 0,
        OrgName: orgName,
        ActivityType: document.getElementById("new-org-type").value,
        City: city || "غير محدد",
        FullAddress: document.getElementById("new-org-address").value.trim(),
        ContactEmail: document.getElementById("new-org-email").value.trim(),
        Description: document.getElementById("new-org-desc").value.trim(),
        LicenseNumber: ""
    };

    try {
        const res = await fetch(`${API_BASE}/api/Organizations`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            bootstrap.Modal.getInstance(document.getElementById("addOrgModal")).hide();
            e.target.reset();
            await refreshDashboard();
            alert("✅ تمت إضافة المؤسسة بنجاح!");
        } else {
            alert("❌ فشل الإضافة");
        }
    } catch (err) {
        alert("تعذر الاتصال بالسيرفر");
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

// 7. دوال الحذف
async function deleteRequest(id) {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    const btn = document.getElementById(`del-req-${id}`);
    if (btn) { btn.disabled = true; btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`; }
    try {
        const res = await fetch(`${API_BASE}/api/HelpRequests/${id}`, { method: "DELETE" });
        if (res.ok) refreshDashboard();
        else alert("فشل الحذف");
    } catch (err) { alert("خطأ في الحذف"); }
}

async function deleteVolunteer(id) {
    if (!confirm("هل تريد حذف هذا المتطوع؟")) return;
    const btn = document.getElementById(`del-vol-${id}`);
    if (btn) { btn.disabled = true; btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`; }
    try {
        const res = await fetch(`${API_BASE}/api/Volunteers/${id}`, { method: "DELETE" });
        if (res.ok) refreshDashboard();
        else alert("فشل الحذف");
    } catch (err) { alert("خطأ في الحذف"); }
}

async function deleteOrganization(id) {
    if (!confirm("هل تريد حذف هذه المؤسسة؟")) return;
    try {
        const res = await fetch(`${API_BASE}/api/Organizations/${id}`, { method: "DELETE" });
        if (res.ok) refreshDashboard();
        else alert("فشل الحذف");
    } catch (err) { alert("خطأ في الحذف"); }
}

async function deleteMessage(id) {
    if (!confirm("هل تريد حذف هذه الرسالة؟")) return;
    const btn = document.getElementById(`del-msg-${id}`);
    if (btn) { btn.disabled = true; btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`; }
    try {
        const res = await fetch(`${API_BASE}/api/ContactMessages/${id}`, { method: "DELETE" });
        if (res.ok) refreshDashboard();
        else alert("فشل الحذف");
    } catch (err) { alert("خطأ في الحذف"); }
}

// 8. تحديث شامل
async function refreshDashboard() {
    const [reqs, vols, msgs, orgs] = await Promise.all([
        loadAppointments(),
        loadVolunteers(),
        loadMessages(),
        loadOrganizations()
    ]);
}// =======================
// 📊 الرسم البياني (هناااا)
// =======================
function renderChart(data) {
    const chart = document.getElementById("barChart");
    const labels = document.getElementById("barLabels");

    if (!chart || !labels) return;

    chart.innerHTML = "";
    labels.innerHTML = "";

    const days = ["الأحد", "الإثنين", "الثلاثاء", "الأربعاء", "الخميس", "الجمعة", "السبت"];
    const counts = [2, 5, 3, 7, 4, 6, 1]; // مؤقت

    counts.forEach((val, i) => {
        const bar = document.createElement("div");
        bar.style.height = (val * 10) + "px";
        bar.style.background = "#4e73df";
        bar.style.width = "30px";
        bar.style.borderRadius = "6px";
        bar.style.display = "inline-block";
        bar.style.margin = "0 5px";
        chart.appendChild(bar);

        const label = document.createElement("span");
        label.innerText = days[i];
        label.style.margin = "0 8px";
        labels.appendChild(label);
    });
}

// 9. التنقل بين الأقسام
function showSection(name, el) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));

    const section = document.getElementById(`section-${name}`);
    if (section) section.classList.add('active');
    if (el) el.classList.add('active');

    const titles = {
        dashboard: 'لوحة التحكم',
        requests: 'طلبات المساعدة',
        volunteers: 'المتطوعون',
        users: 'المستخدمون',
        organizations: 'المؤسسات',
        messages: 'الرسائل',
        settings: 'الإعدادات'
    };
    const titleEl = document.getElementById('pageTitle');
    if (titleEl) titleEl.innerText = titles[name] || '';
}

// 10. تشغيل القائمة الجانبية
function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
}

// 11. تشغيل عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', () => refreshDashboard());
// ================================
// ⚙️ إعدادات الموقع (LocalStorage)
// ================================

// تحميل البيانات
window.addEventListener("load", () => {
    const welcome = localStorage.getItem("welcomeMessage");
    const address = localStorage.getItem("address");

    if (document.getElementById("welcomeMessage"))
        document.getElementById("welcomeMessage").value = welcome || "";

    if (document.getElementById("address"))
        document.getElementById("address").value = address || "";
});

// حفظ الإعدادات
function saveSettings() {
    const welcome = document.getElementById("welcomeMessage").value;
    const address = document.getElementById("address").value;

    if (!welcome || !address) {
        alert("يرجى تعبئة جميع الحقول");
        return;
    }

    localStorage.setItem("welcomeMessage", welcome);
    localStorage.setItem("address", address);

    alert("✅ تم حفظ الإعدادات");
}

// ================================
// 🔐 تغيير كلمة المرور
// ================================
function changePassword() {
    const current = document.getElementById("currentPassword").value;
    const newPass = document.getElementById("newPassword").value;
    const confirm = document.getElementById("confirmPassword").value;

    const savedPassword = localStorage.getItem("adminPassword") || "1234";

    if (!current || !newPass || !confirm) {
        alert("يرجى تعبئة جميع الحقول");
        return;
    }

    if (current !== savedPassword) {
        alert("❌ كلمة المرور الحالية غير صحيحة");
        return;
    }

    if (newPass !== confirm) {
        alert("⚠️ يجب تأكيد كلمة المرور الجديدة");
        return;
    }

    localStorage.setItem("adminPassword", newPass);

    alert("🔐 تم تغيير كلمة المرور بنجاح");

    document.getElementById("currentPassword").value = "";
    document.getElementById("newPassword").value = "";
    document.getElementById("confirmPassword").value = "";
}