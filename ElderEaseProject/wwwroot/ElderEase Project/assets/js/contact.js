function submitContact(e) {
    e.preventDefault();

    const data = {
        Name: document.getElementById('cName').value,
        Email: document.getElementById('cEmail').value,
        Phone: document.getElementById('cPhone').value || "غير محدد",
        Subject: document.getElementById('cSubject').value,
        Message: document.getElementById('cMessage').value,
    };

    // محاكاة الإرسال بنجاح
    console.log('إرسال البيانات:', data);
    showSuccess();
}

function showSuccess() {
    const box = document.getElementById('successBox');
    box.classList.add('show');
    document.getElementById('contactForm').reset();

    // التمرير للأعلى لرؤية رسالة النجاح في الموبايل
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // إخفاء الرسالة بعد 6 ثوانٍ
    setTimeout(() => {
        box.classList.remove('show');
    }, 6000);
}