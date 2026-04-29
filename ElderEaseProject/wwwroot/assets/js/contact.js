/* === contact.js - النسخة النهائية === */
const API_CONTACT = 'https://localhost:7188/api/ContactMessages';

async function submitContact(e) {
    e.preventDefault();

    const nameInput = document.getElementById('cName');
    const emailInput = document.getElementById('cEmail');
    const messageInput = document.getElementById('cMessage');
    const subjectInput = document.getElementById('cSubject');
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    const nameError = document.getElementById('cNameError');
    const emailError = document.getElementById('cEmailError');
    const messageError = document.getElementById('cMessageError');

    let isValid = true;

    // Validation
    if (!nameInput.value.trim()) {
        nameError.style.display = "block";
        nameInput.style.borderColor = "red";
        isValid = false;
    } else {
        nameError.style.display = "none";
        nameInput.style.borderColor = "";
    }

    if (!emailInput.value.trim() || !emailInput.value.includes('@')) {
        emailError.style.display = "block";
        emailInput.style.borderColor = "red";
        isValid = false;
    } else {
        emailError.style.display = "none";
        emailInput.style.borderColor = "";
    }

    if (!messageInput.value.trim()) {
        messageError.style.display = "block";
        messageInput.style.borderColor = "red";
        isValid = false;
    } else {
        messageError.style.display = "none";
        messageInput.style.borderColor = "";
    }

    if (!isValid) return;

    const data = {
        Name: nameInput.value.trim(),
        Email: emailInput.value.trim(),
        Subject: subjectInput.value || "رسالة استفسار عامة",
        MessageContent: messageInput.value.trim(),
        SentDate: new Date().toISOString()
    };

    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            جاري الإرسال...`;

        const response = await fetch(API_CONTACT, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok || response.status === 201) {
            showSuccess();
        } else {
            const errorData = await response.text();
            console.error('تفاصيل الخطأ:', errorData);
            alert('حدث خطأ في السيرفر، يرجى المحاولة لاحقاً.');
        }

    } catch (error) {
        console.error('خطأ في الاتصال:', error);
        alert('فشل الاتصال بالسيرفر، تأكد من تشغيل المشروع.');
    } finally {
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
        setTimeout(() => { box.style.display = "none"; }, 6000);
    }
}