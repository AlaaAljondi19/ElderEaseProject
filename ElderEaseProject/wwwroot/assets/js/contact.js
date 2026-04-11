/* === contact.js - النسخة المطورة === */
async function submitContact(e) {
    e.preventDefault();

    // 1. جلب العناصر ورسائل الخطأ من الهيكل
    const nameInput = document.getElementById('cName');
    const emailInput = document.getElementById('cEmail');
    const messageInput = document.getElementById('cMessage');

    const nameError = document.getElementById('cNameError');
    const emailError = document.getElementById('cEmailError');
    const messageError = document.getElementById('cMessageError');

    let isValid = true;

    // 2. منطق التحقق (بدون رسائل تنبيه مزعجة، فقط إظهار الـ small الأحمر)
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

    if (!isValid) return; // توقف إذا كان هناك نقص في البيانات

    // 3. تجهيز البيانات للإرسال
    const data = {
        Name: nameInput.value,
        Email: emailInput.value,
        Phone: document.getElementById('cPhone').value || null,
        Subject: document.getElementById('cSubject').value,
        Message: messageInput.value,
    };

    // 4. الربط الفعلي مع ASP.NET Core
    try {
        /* تفعيل هذا الجزء عند جاهزية السيرفر:
        const response = await fetch('/api/Contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            showSuccess();
        } else {
            alert('حدث خطأ في السيرفر، حاول مرة أخرى');
        }
        */

        // حالياً للمعاينة:
        console.log('بيانات التواصل الجاهزة:', data);
        showSuccess();

    } catch (error) {
        console.error('خطأ في الاتصال:', error);
    }
}

function showSuccess() {
    const box = document.getElementById('successBox');
    if (box) {
        box.style.display = "flex"; // إظهار الصندوق الأخضر
        document.getElementById('contactForm').reset();
        window.scrollTo({ top: 0, behavior: 'smooth' });

        setTimeout(() => {
            box.style.display = "none";
        }, 8000);
    }
}