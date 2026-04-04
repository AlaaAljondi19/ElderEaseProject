document.addEventListener('DOMContentLoaded', () => {
  fetchAppointments();
});

// 1. جلب المواعيد من السيرفر (المهمة 3 - GET)
async function fetchAppointments() {
  const listContainer = document.getElementById('appointmentsList');
  const emptyState = document.getElementById('emptyState');

  try {
    const response = await fetch('/api/Appointments');
    const appointments = await response.json();

    if (appointments.length === 0) {
      listContainer.innerHTML = '';
      emptyState.classList.remove('d-none');
      return;
    }

    emptyState.classList.add('d-none');
    renderAppointments(appointments);
  } catch (error) {
    console.error("خطأ في جلب المواعيد:", error);
  }
}

// 2. رسم المواعيد داخل الهيكل الخاص بكِ
function renderAppointments(appointments) {
  const listContainer = document.getElementById('appointmentsList');
  listContainer.innerHTML = '';

  appointments.forEach(app => {
    // استخراج اليوم والشهر من التاريخ القادم من السيرفر
    const dateObj = new Date(app.date);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString('ar-EG', { month: 'long' });

    listContainer.innerHTML += `
      <div class="appt-item" data-id="${app.id}">
        <div class="appt-date-box">
          <span class="day">${day}</span>
          <span class="month">${month}</span>
        </div>
        <div class="appt-info">
          <h6>${app.title}</h6>
          <div class="appt-meta">
            <span><i class="bi bi-clock"></i> ${app.time}</span>
            <span class="type-badge type-${app.type}">${getTypeName(app.type)}</span>
          </div>
        </div>
        <div class="appt-actions">
          <button class="btn-del" onclick="deleteAppt(this, ${app.id})">
            <i class="bi bi-trash3"></i> حذف
          </button>
        </div>
      </div>`;
  });
}

// 3. إضافة موعد جديد (المهمة 3 - POST)
async function addAppt(e) {
  e.preventDefault();
  const formData = new FormData(e.target);
  const data = Object.fromEntries(formData);

  try {
    const response = await fetch('/api/Appointments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    if (response.ok) {
      // إغلاق المودال وتنظيف النموذج وتحديث القائمة
      const modal = bootstrap.Modal.getInstance(document.getElementById('addApptModal'));
      modal.hide();
      e.target.reset();
      fetchAppointments();
    }
  } catch (error) {
    alert("حدث خطأ أثناء حفظ الموعد");
  }
}

// 4. حذف موعد (المهمة 3 - DELETE)
async function deleteAppt(btn, id) {
  if (confirm('هل أنتِ متأكدة من حذف هذا الموعد؟')) {
    try {
      const response = await fetch(`/api/Appointments/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        // حذف العنصر من الواجهة مباشرة بأسلوبك الأصلي
        const item = btn.closest('.appt-item');
        item.style.opacity = '0';
        setTimeout(() => {
          fetchAppointments(); // تحديث الحالة للتأكد من القائمة فارغة أم لا
        }, 300);
      }
    } catch (error) {
      alert("حدث خطأ أثناء الحذف");
    }
  }
}

// دالة مساعدة لتحويل الكود لنص عربي داخل الـ Badge
function getTypeName(type) {
  const types = { medical: 'طبي', bill: 'فاتورة', exam: 'فحص', general: 'عام' };
  return types[type] || 'عام';
}
