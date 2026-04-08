async function addAppt(e) {
    // 1. منع الصفحة من التحديث أو الإغلاق التلقائي
    e.preventDefault();

    // 2. جلب المدخلات
    const titleInput = document.getElementById('apptTitle');
    const dateInput = document.getElementById('apptDate');
    const timeInput = document.getElementById('apptTime');

    // 3. جلب عناصر رسائل الخطأ الحمراء
    const titleError = document.getElementById('apptTitleError');
    const dateError = document.getElementById('apptDateError');
    const timeError = document.getElementById('apptTimeError');

    let isValid = true;

    // فحص اسم الموعد
    if (titleInput.value.trim() === "") {
        titleError.style.display = "block";
        titleInput.style.border = "2px solid red";
        isValid = false;
    } else {
        titleError.style.display = "none";
        titleInput.style.border = "";
    }

    // فحص التاريخ
    if (dateInput.value === "") {
        dateError.style.display = "block";
        dateInput.style.border = "2px solid red";
        isValid = false;
    } else {
        dateError.style.display = "none";
        dateInput.style.border = "";
    }

    // فحص الوقت
    if (timeInput.value === "") {
        timeError.style.display = "block";
        timeInput.style.border = "2px solid red";
        isValid = false;
    } else {
        timeError.style.display = "none";
        timeInput.style.border = "";
    }

    // 4. إذا كان هناك خطأ، توقف هنا (النافذة ستبقى مفتوحة ولن "تهرب")
    if (!isValid) return;

    // 5. إذا كانت البيانات سليمة، أضف الموعد وأغلق النافذة
    try {
        const title = titleInput.value;
        const type = document.getElementById('apptType').value;
        const date = dateInput.value;
        const time = timeInput.value;

        const d = new Date(date);
        appendApptDOM(Date.now(), title, type, d.getDate(), MONTHS[d.getMonth()], formatTime(time));

        // إغلاق النافذة برمجياً بعد النجاح فقط
        const addModalEl = document.getElementById('addApptModal');
        const modalInstance = bootstrap.Modal.getInstance(addModalEl);
        modalInstance.hide();

        // إعادة ضبط النموذج
        document.getElementById('apptForm').reset();
        checkEmpty();

    } catch (error) {
        console.error("خطأ في الإضافة:", error);
    }
}