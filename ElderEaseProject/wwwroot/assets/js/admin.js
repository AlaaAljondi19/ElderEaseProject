const API_BASE = "https://localhost:7188";
let myAdminChart = null;

// دالة مساعدة لعرض السبينر داخل الجداول أثناء التحميل
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

// ==========================================
// 1. تحميل طلبات المساعدة (Help Requests)
// ==========================================
async function loadAppointments() {
    showTableSpinner("all-requests-table", 8);
    try {
        const res = await fetch(`${API_BASE}/api/HelpRequests`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        const table = document.getElementById("all-requests-table");
        if (!table) return data.length;

        table.innerHTML = "";
        data.forEach(a => {
            table.innerHTML += `
                <tr>
                    <td>${a.Id}</td>
                    <td>${a.Name || "بدون اسم"}</td>
                    <td>${a.ProblemType || "طلب عام"}</td>
                    <td>${a.Description || "-"}</td>
                    <td>${a.Phone || "-"}</td>
                    <td>${a.CreatedAt ? new Date(a.CreatedAt).toLocaleDateString() : "-"}</td>
                    <td><span class="status-badge">${a.Status || "Pending"}</span></td>
                    <td>
                        <button class="delete btn-sm" id="del-req-${a.Id}" onclick="deleteAppointment(${a.Id})">حذف</button>
                    </td>
                </tr>
            `;
        });

        if (document.getElementById("requests-count"))
            document.getElementById("requests-count").innerText = data.length;

        return data.length;
    } catch (err) {
        console.error(err);
        return 0;
    }
}

// ==========================================
// 2. تحميل المتطوعين (Volunteers)
// ==========================================
async function loadVolunteers() {
    showTableSpinner("volunteers-table-body", 7);
    try {
        const res = await fetch(`${API_BASE}/api/Volunteers`);
        const data = await res.json();
        const table = document.getElementById("volunteers-table-body");
        if (!table) return data.length;

        table.innerHTML = "";
        data.forEach(v => {
            table.innerHTML += `
                <tr>
                    <td>${v.Id}</td>
                    <td>${v.FullName}</td>
                    <td>${v.Specialty || "-"}</td>
                    <td>${v.Phone || "-"}</td>
                    <td>${v.WorkingHours || "0"} ساعة</td>
                    <td><span class="status-badge">Active</span></td>
                    <td><button class="delete btn-sm" id="del-vol-${v.Id}" onclick="deleteVolunteer(${v.Id})">حذف</button></td>
                </tr>
            `;
        });
        if (document.getElementById("volunteers-count"))
            document.getElementById("volunteers-count").innerText = data.length;

        return data.length;
    } catch (err) {
        return 0;
    }
}

// ==========================================
// 3. تحميل رسائل التواصل (Contact Messages)
// ==========================================
async function loadMessages() {
    showTableSpinner("messages-table", 7);
    try {
        const res = await fetch(`${API_BASE}/api/ContactMessages`);
        const data = await res.json();
        const table = document.getElementById("messages-table");
        if (!table) return data.length;

        table.innerHTML = "";
        data.forEach(m => {
            table.innerHTML += `
                <tr>
                    <td>${m.Id}</td>
                    <td>${m.Name}</td>
                    <td>${m.Email}</td>
                    <td>${m.Subject}</td>
                    <td>${m.MessageContent}</td>
                    <td>${m.SentDate ? new Date(m.SentDate).toLocaleDateString() : "-"}</td>
                    <td><button class="delete btn-sm" id="del-msg-${m.Id}" onclick="deleteMessage(${m.Id})">حذف</button></td>
                </tr>
            `;
        });
        if (document.getElementById("messages-count"))
            document.getElementById("messages-count").innerText = data.length;

        return data.length;
    } catch (err) {
        return 0;
    }
}

// ==========================================
// 📊 4. تحديث الرسم البياني (Chart)
// ==========================================
function updateChart(counts) {
    const ctx = document.getElementById('adminChart');
    if (!ctx) return;

    if (myAdminChart) myAdminChart.destroy();

    myAdminChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['الطلبات', 'المتطوعين', 'الرسائل'],
            datasets: [{
                label: 'الإحصائيات',
                data: counts,
                backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
                borderRadius: 5
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } }
        }
    });
}

// دالة لتشغيل كل شيء بالترتيب
async function refreshDashboard() {
    const reqs = await loadAppointments();
    const vols = await loadVolunteers();
    const msgs = await loadMessages();
    updateChart([reqs, vols, msgs]);
}

// ==========================================
// 🗑️ 5. وظائف الحذف
// ==========================================
async function deleteAppointment(id) {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    const btn = document.getElementById(`del-req-${id}`);
    try {
        btn.disabled = true;
        btn.innerHTML = `<span class="spinner-border spinner-border-sm"></span>`;
        const res = await fetch(`${API_BASE}/api/HelpRequests/${id}`, { method: "DELETE" });
        if (res.ok) refreshDashboard();
    } catch (err) { alert("خطأ في الحذف"); }
}

async function deleteVolunteer(id) {
    if (!confirm("هل تريد حذف هذا المت