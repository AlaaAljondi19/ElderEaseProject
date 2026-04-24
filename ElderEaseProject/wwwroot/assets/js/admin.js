// ==========================================
// ملف admin.js - لوحة تحكم ElderEase
// ==========================================

// 1. دالة حفظ إعدادات الموقع وإظهار الرسالة الحمراء
async function saveGeneralSettings(event) {
    if (event) {
        event.preventDefault(); // منع الصفحة من التحديث (الطييران)
        event.stopPropagation();
    }

    // جلب البيانات من الحقول (تأكدي أن الـ IDs تطابق الـ HTML عندك)
    const settings = {
        siteName: document.getElementById('set-platform-name').value,
        email: document.getElementById('set-support-email').value,
        phone: document.getElementById('set-support-phone').value,
        welcomeMsg: document.getElementById('set-welcome-msg').value,
        address: document.getElementById('set-address').value
    };

    try {
        // حفظ البيانات في ذاكرة المتصفح لتطبق على كل الصفحات
        localStorage.setItem('siteSettings', JSON.stringify(settings));

        // إظهار التنبيه الأحمر في الأعلى
        showTopAlert("تم حفظ التعديلات بنجاح وتطبيقها على الموقع ✅");
    } catch (error) {
        console.error("خطأ في الحفظ:", error);
    }

    return false;
}

// 2. دالة إظهار التنبيه الأحمر (تصميم ثابت وقوي)
function showTopAlert(message) {
    const oldAlert = document.querySelector('.top-alert-banner');
    if (oldAlert) oldAlert.remove();

    const alertDiv = document.createElement('div');
    alertDiv.className = 'top-alert-banner';

    // تنسيق CSS مباشرة داخل الجافاسكريبت لضمان الظهور الأحمر
    alertDiv.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        background-color: #d9534f;
        color: white;
        padding: 20px;
        text-align: center;
        font-weight: bold;
        font-size: 18px;
        z-index: 999999;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
    `;

    alertDiv.innerHTML = message;
    document.body.prepend(alertDiv);

    setTimeout(() => {
        alertDiv.style.transition = "opacity 0.8s";
        alertDiv.style.opacity = "0";
        setTimeout(() => alertDiv.remove(), 800);
    }, 4000);
}

// 3. دالة تغيير كلمة المرور (التي عملنا عليها سابقاً)
async function updatePassword(event) {
    if (event) event.preventDefault();
    const currentPass = document.getElementById('current-password').value;
    const newPass = document.getElementById('new-password').value;
    const confirmPass = document.getElementById('confirm-password').value;

    if (newPass !== confirmPass) {
        alert("كلمات المرور الجديدة غير متطابقة!");
        return;
    }

    // هنا يوضع كود الـ Fetch الخاص بالسيرفر كما شرحنا سابقاً
    showTopAlert("تم طلب تغيير كلمة المرور.. جاري المعالجة");
}