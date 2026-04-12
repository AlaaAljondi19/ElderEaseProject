/* === help-request.js - النسخة النهائية المعتمدة === */

function selectType(btn, value) {
    document.querySelectorAll('.problem-type-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('problemType').value = value;
    document.getElementById('typeError').style.display = "none";
}

async function submitForm(e) {
    e.preventDefault();

    // 1. تعريف العناصر
    const form = e.target;
    const problemType = document.getElementById('problemType').value;
    const description = document.getElementById('description').value;

    // عناصر رسائل الخطأ (Validation)
    const typeError = document.getElementById('typeError');
    const descError = document.getElementById('descriptionError');
    const descInput = document.getElementById('description');

    // عناصر التنبيهات الكبيرة (Alerts)
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');

    let isValid = true;

    // 2. فحص نوع المشكلة (Validation)
    if (!problemType) {
        typeError.style.display = "block";
        isValid = false;
    } else {
        typeError.style.display = "none";
    }

    // 3. فحص الوصف (Validation)
    if (!description.trim()) {
        descError.style.display = "block";
        descInput.style.borderColor = "#dc3545"; // لون أحمر للحدود
        isValid = false;
    } else {
        descError.style.display = "none";
        descInput.style.borderColor = "";
    }

    // إذا لم تكن البيانات صالحة نتوقف هنا
    if (!isValid) return;

    // 4. تجهيز البيانات للإرسال
    const data = {
        Name: document.getElementById('name').value || "غير معروف",
        ProblemType: problemType,
        Description: description,
        Phone: document.getElementById('phone').value || "لا يوجد"
    };

    try {
        // إخفاء التنبيهات السابقة قبل المحاولة الجديدة
        successAlert.classList.add('d-none');
        errorAlert.classList.add('d-none');

        const response = await fetch('/api/HelpRequests', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            // حالة النجاح: إظهار البوكس الأخضر وتفريغ الفورم
            successAlert.classList.remove('d-none');
            form.reset();
            document.querySelectorAll('.problem-type-btn').forEach(b => b.classList.remove('selected'));
            document.getElementById('problemType').value = '';

            // الصعود للأعلى لرؤية الرسالة
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            // حالة خطأ من السيرفر: إظهار البوكس الأحمر
            errorAlert.classList.remove('d-none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error:', error);
        // حالة انقطاع الاتصال: إظهار البوكس الأحمر
        errorAlert.classList.remove('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function showSuccess() {
    const alertBox = document.getElementById('successAlert');
    alertBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="bi bi-check-circle-fill" style="font-size: 1.5rem;"></i>
            <div>
                <strong>تم إرسال طلبك بنجاح!</strong><br>
                <span>سيرد عليك الفريق المختص بأسرع وقت ممكن.</span>
            </div>
        </div>
    `;
    alertBox.style.display = "block";
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
        alertBox.style.display = "none";
    }, 5000);
}