function selectType(btn, value) {
    // إزالة التحديد من جميع الأزرار
    document.querySelectorAll('.problem-type-btn').forEach(b => b.classList.remove('selected'));
    // إضافة التحديد للزر المختار
    btn.classList.add('selected');
    // تحديث الحقل المخفي
    document.getElementById('problemType').value = value;
}

function submitForm(e) {
    e.preventDefault();

    const problemType = document.getElementById('problemType').value;
    if (!problemType) {
        alert('الرجاء اختيار نوع المشكلة أولاً');
        return;
    }

    const data = {
        Name: document.getElementById('name').value || "غير معروف",
        ProblemType: problemType,
        Description: document.getElementById('description').value,
        Phone: document.getElementById('phone').value || "غير متوفر"
    };

    console.log('بيانات الطلب:', data);

    // محاكاة الإرسال بنجاح
    showSuccess();
}

function showSuccess() {
    const alertBox = document.getElementById('successAlert');
    alertBox.classList.add('show');
    document.getElementById('helpForm').reset();

    // مسح اختيار الأزرار بعد النجاح
    document.querySelectorAll('.problem-type-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('problemType').value = '';

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
        alertBox.classList.remove('show');
    }, 7000);
}