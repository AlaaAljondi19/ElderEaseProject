/* === help-request.js === */

function selectType(btn, value) {
    document.querySelectorAll('.problem-type-btn').forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    document.getElementById('problemType').value = value;
  }

  function submitForm(e) {
    e.preventDefault();

    const problemType = document.getElementById('problemType').value;
    if (!problemType) {
      alert('الرجاء اختيار نوع المشكلة');
      return;
    }

    const data = {
      Name: document.getElementById('name').value || null,
      ProblemType: problemType,
      Description: document.getElementById('description').value,
      Phone: document.getElementById('phone').value || null,
    };

    /*
    ============================================================
    الربط مع ASP.NET Core - أزل التعليق بعد إعداد الـ API
    ============================================================

    // خيار 1: fetch API (JSON)
    fetch('/api/HelpRequests', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(r => {
      if (r.ok) showSuccess();
      else alert('حدث خطأ، حاول مرة أخرى');
    })
    .catch(() => alert('تعذر الاتصال بالخادم'));

    // خيار 2: إذا تستخدم Razor Pages / MVC Form
    // فقط احذف الـ onsubmit وخلي الفورم يُرسل بشكل عادي مع action="/HelpRequest/Create"
    ============================================================
    */

    // للعرض فقط - احذف هذا بعد الربط
    console.log('إرسال:', data);
    showSuccess();
  }

  function showSuccess() {
    const alert = document.getElementById('successAlert');
    alert.classList.add('show');
    document.getElementById('helpForm').reset();
    document.querySelectorAll('.problem-type-btn').forEach(b => b.classList.remove('selected'));
    document.getElementById('problemType').value = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => alert.classList.remove('show'), 7000);
  }
