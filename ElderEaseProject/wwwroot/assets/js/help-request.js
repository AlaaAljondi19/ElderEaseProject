// الرابط الخاص بالباك إند
const API_URL = 'https://localhost:7188/api/HelpRequests';

/**
 * 1. دالة اختيار نوع المشكلة من الأزرار
 */
function selectType(btn, value) {
    // إزالة التحديد من جميع الأزرار
    document.querySelectorAll('.problem-type-btn').forEach(b => b.classList.remove('selected'));

    // إضافة كلاس التحديد للزر المضغطوط
    btn.classList.add('selected');

    // تخزين القيمة في الحقل المخفي
    const hiddenInput = document.getElementById('problemType');
    if (hiddenInput) {
        hiddenInput.value = value;
    }

    // إخفاء رسالة الخطأ الحمراء فوراً عند الاختيار
    const typeError = document.getElementById('typeError');
    if (typeError) {
        typeError.style.display = "none";
    }
}

/**
 * 2. الدالة الأساسية لإرسال النموذج (Form Submission)
 */
async function submitForm(e) {
    e.preventDefault();

    // تعريف العناصر من الهيكل
    const submitBtn = document.getElementById('submitBtnText');
    const problemType = document.getElementById('problemType').value;
    const description = document.getElementById('description').value.trim();

    const typeError = document.getElementById('typeError');
    const descError = document.getElementById('descriptionError');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');

    // تصفير الحالة السابقة (إخفاء كل التنبيهات)
    if (typeError) typeError.style.display = "none";
    if (descError) descError.style.display = "none";
    if (successAlert) { successAlert.style.display = "none"; successAlert.classList.add('d-none'); }
    if (errorAlert) { errorAlert.style.display = "none"; errorAlert.classList.add('d-none'); }
    document.getElementById('description').style.borderColor = "#dee2e6";

    let isValid = true;

    // --- التحقق (Validation) وإظهار الرسائل الحمراء التفصيلية ---
    if (!problemType) {
        if (typeError) typeError.style.display = "block";
        isValid = false;
    }

    if (!description) {
        if (descError) descError.style.display = "block";
        document.getElementById('description').style.borderColor = "#dc3545";
        isValid = false;
    }

    // إذا كانت البيانات ناقصة، نتوقف هنا ولا نرسل للباك إند
    if (!isValid) return;

    // --- بدء عملية الإرسال الحقيقية ---

    // تشغيل السبينر وتعطيل الزر
    submitBtn.disabled = true;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> جاري الإرسال...`;

    // تجهيز كائن البيانات (Data Object) بناءً على الـ Swagger المرفق
    const requestData = {
        Name: document.getElementById('name').value.trim() || "مستخدم",
        ProblemType: problemType,
        Description: description,
        Phone: document.getElementById('phone').value.trim() || "",
        CreatedAt: new Date().toISOString(),
        Status: "Pending",
        UserId: 1 // جربي وضع رقم 1 مؤقتاً للتأكد من الربط
        // حذفنا حقل User: {} تماماً لأنه يسبب تعارض مع قواعد البيانات (Integrity Constraints)
    };

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(requestData)
        });

        if (response.ok || response.status === 201) {
            // نجاح الإرسال - إظهار الرسالة الحمراء المنسقة
            showSuccessMessage(successAlert);

            // تصفير النموذج
            e.target.reset();
            document.querySelectorAll('.problem-type-btn').forEach(b => b.classList.remove('selected'));
            document.getElementById('problemType').value = '';

            // صعود للأعلى لرؤية رسالة النجاح
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // فشل من جهة السيرفر (مثل خطأ 400)
            const errorData = await response.json().catch(() => ({}));
            console.error("Server Error Details:", errorData);
            showErrorMessage(errorAlert, "فشل الإرسال: تأكد من صحة البيانات المدخلة.");
        }

    } catch (error) {
        // فشل في الاتصال (السيرفر مطفأ)
        console.error('Network Error:', error);
        showErrorMessage(errorAlert, "السيرفر لا يستجيب. تأكد من تشغيل مشروع الـ Backend.");
    } finally {
        // إعادة الزر لحالته الطبيعية
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
}

/**
 * 3. دالة تنسيق رسالة النجاح (الخلفية الحمراء الفاتحة والخط العريض)
 */
function showSuccessMessage(alertElement) {
    if (!alertElement) return;
    alertElement.innerHTML = `<strong><i class="bi bi-check-circle-fill"></i> تم إرسال طلبك بنجاح!</strong><br>سيتواصل معك أحد المتطوعين في أقرب وقت ممكن.`;
    alertElement.style.display = "block";
    alertElement.classList.remove('d-none');

    // التنسيق الجمالي الذي طلبتِه
    alertElement.style.backgroundColor = "#fff5f5";
    alertElement.style.color = "#c0392b";
    alertElement.style.border = "2px solid #e74c3c";
    alertElement.style.padding = "20px";
    alertElement.style.borderRadius = "12px";
}

/**
 * 4. دالة إظهار رسائل الخطأ العامة
 */
function showErrorMessage(alertElement, message) {
    if (!alertElement) return;
    alertElement.textContent = message;
    alertElement.style.display = "block";
    alertElement.classList.remove('d-none');
}