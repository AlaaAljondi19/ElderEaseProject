/* === help-request.js - النسخة المعدلة مع إضافة الـ Spinner === */
const API_URL = 'https://localhost:7188/api/HelpRequests';

function selectType(btn, value) {
    document.querySelectorAll('.problem-type-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('problemType').value = value;
    document.getElementById('typeError').style.display = "none";
}

async function submitForm(e) {
    e.preventDefault();

    const form = e.target;
    // جلب زر الإرسال لإضافة السبينر
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;

    const problemType = document.getElementById('problemType').value;
    const description = document.getElementById('description').value;
    const typeError = document.getElementById('typeError');
    const descError = document.getElementById('descriptionError');
    const descInput = document.getElementById('description');
    const successAlert = document.getElementById('successAlert');
    const errorAlert = document.getElementById('errorAlert');

    let isValid = true;

    if (!problemType) {
        typeError.style.display = "block";
        isValid = false;
    } else {
        typeError.style.display = "none";
    }

    if (!description.trim()) {
        descError.style.display = "block";
        descInput.style.borderColor = "#dc3545";
        isValid = false;
    } else {
        descError.style.display = "none";
        descInput.style.borderColor = "";
    }

    if (!isValid) return;

    const data = {
        Name: document.getElementById('name')?.value || "مستخدم عام",
        ProblemType: problemType,
        Description: description,
        Phone: document.getElementById('phone')?.value || "00000000",
        CreatedAt: new Date().toISOString(),
        Status: "Pending"
    };

    try {
        if (successAlert) successAlert.classList.add('d-none');
        if (errorAlert) errorAlert.classList.add('d-none');

        // 1. تشغيل السبينر وتعطيل الزر
        submitBtn.disabled = true;
        submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> جاري الإرسال...`;

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            if (successAlert) {
                successAlert.classList.remove('d-none');
                successAlert.style.display = "block";
            }
            form.reset();
            document.querySelectorAll('.problem-type-btn').forEach(b => b.classList.remove('selected'));
            document.getElementById('problemType').value = '';
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            if (errorAlert) errorAlert.classList.remove('d-none');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    } catch (error) {
        console.error('Error:', error);
        if (errorAlert) errorAlert.classList.remove('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
        // 2. إعادة الزر لحالته الطبيعية في كل الأحوال
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}