/* === contact.js - النسخة المطورة مع مؤشر التحميل (Spinner) === */
const API_CONTACT = 'https://localhost:7188/api/ContactMessages';

async function submitContact(e) {
    e.preventDefault();

    // 1. جلب العناصر
    const nameInput = document.getElementById('cName');
    const emailInput = document.getElementById('cEmail');
    const messageInput = document.getElementById('cMessage');
    const subjectInput = document.getElementById('cSubject');

    // زر الإرسال لإضافة السبينر
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    const nameError = document.getElementById('cNameError');
    const emailError = document.getElementById('cEmailError');
    const messageError = document.getElementById('cMessageError');

    let isValid = true;

    // 2. التحقق من البيانات
    if (nameInput.value.trim() === "") {
        nameError.style.display = "block";
        nameInput.style.borderColor = "red";
        isValid = false;
    } else {
        nameError.style.display = "none";
        nameInput.style.borderColor = "";
    }

    if (emailInput.value.trim() === "" || !emailInput.value.includes('@')) {
        emailError.style.display = "block";
        emailInput.style.borderColor = "red";
        isValid = false;
    } else {
        emailError.style.display = "none";
        emailInput.style.borderColor = "";
    }

    if (messageInput.value.trim() === "") {
        messageError.style.display = "block";
        messageInput.style.borderColor = "red";
        isValid = false;
    } else {
        messageError.style.display = "none";
        messageInput.style.borderColor = "";
    }

    if (!isValid) return;

    // 3. تجهيز البيانات (PascalCase حسب السواجر)
    const data = {
        Name: nameInput.value,
        Email: emailInput.value,
        Subject: subjectInput.value || "رسالة استفسار عامة",
        MessageContent: messageInput.value,
        SentDate: new Date().toISOString()
    };

    // 4. الربط مع السيرفر مع تفعيل السبينر
    try {
        // تشغيل السبينر وتعطيل الزر
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            جاري الإرسال...
        `;

        const response = await fetch(API_CONTACT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showSuccess();
        } else {
            const errorData = await response.json();
            console.error('تفاصيل الخطأ:', errorData);
            alert('حدث خطأ في السيرفر، يرجى المحاولة لاحقاً.');
        }

    } catch (error) {
        console.error('خطأ في الاتصال:', error);
        alert('فشل الاتصال بالسيرفر، تأكد من تشغيل المشروع.');
    } finally {
        // إعادة الزر لوضعه الطبيعي (إخفاء السبينر)
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

function showSuccess() {
    const box = document.getElementById('successBox');
    if (box) {
        box.style.display = "flex";
        document.getElementById('contactForm').reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            box.style.display = "none";
        }, 8000);
    }
}