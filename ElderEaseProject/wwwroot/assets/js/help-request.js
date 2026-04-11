/* === help-request.js === */
function selectType(btn, value) {
    document.querySelectorAll('.problem-type-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('problemType').value = value;

    // إخفاء رسالة الخطأ فور اختيار نوع المشكلة
    document.getElementById('typeError').style.display = "none";
}

function submitForm(e) {
    e.preventDefault();

    const problemType = document.getElementById('problemType').value;
    const description = document.getElementById('description').value;

    // جلب عناصر رسائل الخطأ من الـ HTML
    const typeError = document.getElementById('typeError');
    const descError = document.getElementById('descriptionError');
    const descInput = document.getElementById('description');

    let isValid = true;

    // 1. فحص نوع المشكلة
    if (!problemType) {
        typeError.style.display = "block"; // إظهار الرسالة الحمراء
        isValid = false;
    } else {
        typeError.style.display = "none";
    }

    // 2. فحص وصف المشكلة
    if (description.trim() === "") {
        descError.style.display = "block"; // إظهار الرسالة الحمراء
        descInput.style.borderColor = "red"; // تلوين إطار الحقل بالأحمر
        isValid = false;
    } else {
        descError.style.display = "none";
        descInput.style.borderColor = "";
    }

    // إذا كان هناك خطأ، نتوقف هنا ولا نكمل الإرسال
    if (!isValid) return;

    // إذا كانت البيانات سليمة، نجهز الكائن للإرسال
    const data = {
        Name: document.getElementById('name').value || null,
        ProblemType: problemType,
        Description: description,
        Phone: document.getElementById('phone').value || null,
    };

    console.log('إرسال:', data);
    showSuccess();
}

function showSuccess() {
    const alertBox = document.getElementById('successAlert');

    // تغيير نص الرسالة ليصبح كما طلبتِ تماماً
    alertBox.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-check-circle" style="font-size: 1.5rem;"></i>
            <div>
                <strong>تم إرسال طلبك بنجاح!</strong><br>
                <span>سيرد عليك الفريق المختص بأسرع وقت ممكن.</span>
            </div>
        </div>
    `;

    // إظهار التنبيه
    alertBox.style.display = "flex";
    alertBox.classList.add('show');

    // إعادة ضبط النموذج (Reset)
    document.getElementById('helpForm').reset();
    document.querySelectorAll('.problem-type-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('problemType').value = '';

    // الصعود لأعلى الصفحة بسلاسة لرؤية الرسالة
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // إخفاء التنبيه بعد 5 ثوانٍ
    setTimeout(() => {
        alertBox.classList.remove('show');
        setTimeout(() => { alertBox.style.display = "none"; }, 500);
    }, 5000);
}