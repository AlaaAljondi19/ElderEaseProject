// بيانات تجريبية في حال فشل الـ API أو للتطوير
const mockVolunteers = [
    { fullName: "أحمد السالم", specialty: "Technical", specialtyName: "دعم تقني", workHours: "9ص - 5م", phone: "0795551234", bio: "خبير في تطبيقات الهواتف والواتساب" },
    { fullName: "سارة العلي", specialty: "Guidance", specialtyName: "إرشاد اجتماعي", workHours: "10ص - 4م", phone: "0784443210", bio: "أخصائية اجتماعية لمساعدة كبار السن" },
    { fullName: "ليث الكردي", specialty: "General", specialtyName: "مساعدة عامة", workHours: "8ص - 8م", phone: "0771119988", bio: "مستعد للمساعدة في المعاملات اليومية" }
];

async function loadVolunteers(specialty = 'all') {
    const grid = document.getElementById('volunteersGrid');
    grid.innerHTML = `
        <div class="text-center w-100 py-5">
            <div class="spinner-border text-primary" role="status"></div>
            <p class="mt-3 text-muted">جاري البحث عن متطوعين متاحين...</p>
        </div>`;

    try {
        let url = `/api/Volunteers`;
        if (specialty !== 'all') url += `?specialty=${specialty}`;

        // محاولة جلب البيانات الحقيقية
        const response = await fetch(url);
        let volunteers = [];

        if (response.ok) {
            volunteers = await response.json();
        } else {
            // استخدام البيانات التجريبية إذا فشل السيرفر (لأغراض العرض)
            volunteers = mockVolunteers.filter(v => specialty === 'all' || v.specialty.toLowerCase() === specialty.toLowerCase());
        }

        grid.innerHTML = '';
        if (volunteers.length === 0) {
            grid.innerHTML = '<div class="col-12 text-center py-5"><p class="text-muted">لا يوجد متطوعون في هذا القسم حالياً.</p></div>';
            return;
        }

        volunteers.forEach(vol => {
            const card = `
                <div class="col-md-6 col-lg-4">
                    <div class="vol-card">
                        <div class="vol-avatar"><i class="bi bi-person-fill"></i></div>
                        <div class="text-center">
                            <span class="specialty-badge sp-${vol.specialty.toLowerCase()}">
                                <i class="bi bi-patch-check-fill me-1"></i> ${vol.specialtyName || vol.specialty}
                            </span>
                            <h5>${vol.fullName}</h5>
                        </div>
                        <div class="vol-info-group">
                            <div class="vol-info-item"><i class="bi bi-clock-history"></i> متاح: ${vol.workHours}</div>
                            <div class="vol-info-item"><i class="bi bi-telephone-outbound"></i> ${vol.phone}</div>
                            <div class="vol-info-item"><i class="bi bi-quote"></i> ${vol.bio || 'متطوع معتمد لدى إيلدر إيز'}</div>
                        </div>
                        <button class="btn-contact" onclick="openContactModal('${vol.fullName}', '${vol.id || 0}')">
                            <i class="bi bi-chat-left-text"></i> اطلب المساعدة
                        </button>
                    </div>
                </div>`;
            grid.insertAdjacentHTML('beforeend', card);
        });
    } catch (error) {
        console.error("Fetch error, using mock data...");
        // عرض البيانات التجريبية في حالة الخطأ التام (للتجربة)
        renderMockData(specialty);
    }
}

function renderMockData(specialty) {
    const grid = document.getElementById('volunteersGrid');
    grid.innerHTML = '';
    const filtered = mockVolunteers.filter(v => specialty === 'all' || v.specialty.toLowerCase() === specialty.toLowerCase());
    // (نفس كود الـ forEach أعلاه للعرض)
}

function filterVol(btn, specialty) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    loadVolunteers(specialty);
}

function openContactModal(name, id) {
    document.getElementById('volunteerId').value = id;
    document.getElementById('volNameDisplay').value = name;
    document.getElementById('volMsgSuccess').classList.add('d-none');
    document.getElementById('volContactForm').reset();

    const modal = new bootstrap.Modal(document.getElementById('contactVolModal'));
    modal.show();
}

async function sendVolMsg(e) {
    e.preventDefault();
    const btn = document.getElementById('btnSubmitVol');
    const alert = document.getElementById('volMsgSuccess');

    const data = Object.fromEntries(new FormData(e.target));

    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span> جاري الإرسال...';

    try {
        const response = await fetch('/api/VolunteerMessages', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            alert.classList.remove('d-none');
            setTimeout(() => {
                bootstrap.Modal.getInstance(document.getElementById('contactVolModal')).hide();
            }, 2000);
        } else {
            alert("حدث خطأ، يرجى المحاولة لاحقاً.");
        }
    } catch (error) {
        alert("تأكد من اتصالك بالإنترنت.");
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="bi bi-send-fill me-2"></i> إرسال الطلب الآن';
    }
}

document.addEventListener('DOMContentLoaded', () => loadVolunteers('all'));