const API_BASE = "https://localhost:7188";

// ==========================================
// 📅 LOAD HELP REQUESTS (طلبات المساعدة)
// ==========================================
async function loadAppointments() {
    try {
        const res = await fetch(`${API_BASE}/api/HelpRequests`);
        if (!res.ok) throw new Error("Failed to fetch");

        const data = await res.json();
        const table = document.getElementById("all-requests-table");
        if (!table) return;

        table.innerHTML = "";
        data.forEach(a => {
            // التعديل: استخدام الأسماء من السواجر (Id, Name, ProblemType, Status)
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
                        <button class="delete" onclick="deleteAppointment(${a.Id})">حذف</button>
                    </td>
                </tr>
            `;
        });

        if (document.getElementById("requests-count"))
            document.getElementById("requests-count").innerText = data.length;

    } catch (err) {
        console.error(err);
        showTopAlert("خطأ في تحميل الطلبات");
    }
}

// ==========================================
// 👥 LOAD VOLUNTEERS (المتطوعين)
// ==========================================
async function loadVolunteers() {
    try {
        const res = await fetch(`${API_BASE}/api/Volunteers`);
        const data = await res.json();
        const table = document.getElementById("volunteers-table-body");
        if (!table) return;

        table.innerHTML = "";
        data.forEach(v => {
            // التعديل: FullName و Specialty و WorkingHours
            table.innerHTML += `
                <tr>
                    <td>${v.Id}</td>
                    <td>${v.FullName}</td>
                    <td>${v.Specialty || "-"}</td>
                    <td>${v.Phone || "-"}</td>
                    <td>${v.WorkingHours || "0"} ساعة</td>
                    <td><span class="status-badge">Active</span></td>
                    <td><button class="delete" onclick="deleteVolunteer(${v.Id})">حذف</button></td>
                </tr>
            `;
        });
        if (document.getElementById("volunteers-count"))
            document.getElementById("volunteers-count").innerText = data.length;
    } catch (err) {
        showTopAlert("خطأ في تحميل المتطوعين");
    }
}

// ==========================================
// 📩 CONTACT MESSAGES (رسائل التواصل)
// ==========================================
async function loadMessages() {
    try {
        const res = await fetch(`${API_BASE}/api/ContactMessages`);
        const data = await res.json();
        const table = document.getElementById("messages-table");
        if (!table) return;

        table.innerHTML = "";
        data.forEach(m => {
            // التعديل: MessageContent و SentDate
            table.innerHTML += `
                <tr>
                    <td>${m.Id}</td>
                    <td>${m.Name}</td>
                    <td>${m.Email}</td>
                    <td>${m.Subject}</td>
                    <td>${m.MessageContent}</td>
                    <td>${m.SentDate ? new Date(m.SentDate).toLocaleDateString() : "-"}</td>
                    <td><button class="delete" onclick="deleteMessage(${m.Id})">حذف</button></td>
                </tr>
            `;
        });
        if (document.getElementById("messages-count"))
            document.getElementById("messages-count").innerText = data.length;
    } catch (err) {
        showTopAlert("خطأ في تحميل الرسائل");
    }
}

// ==========================================
// 🗑️ DELETE FUNCTIONS
// ==========================================
async function deleteAppointment(id) {
    if (!confirm("هل أنت متأكد من حذف هذا الطلب؟")) return;
    try {
        const res = await fetch(`${API_BASE}/api/HelpRequests/${id}`, { method: "DELETE" });
        if (res.ok) {
            showTopAlert("تم الحذف بنجاح", "success");
            loadAppointments();
        }
    } catch (err) { showTopAlert("خطأ أثناء الحذف"); }
}

async function deleteVolunteer(id) {
    if (!confirm("هل تريد حذف هذا المتطوع؟")) return;
    try {
        const res = await fetch(`${API_BASE}/api/Volunteers/${id}`, { method: "DELETE" });
        if (res.ok) {
            showTopAlert("تم حذف المتطوع", "success");
            loadVolunteers();
        }
    } catch (err) { showTopAlert("فشل الحذف"); }
}