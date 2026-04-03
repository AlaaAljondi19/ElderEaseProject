/* === contact.js === */

function submitContact(e) {
    e.preventDefault();

    const data = {
      Name:    document.getElementById('cName').value,
      Email:   document.getElementById('cEmail').value,
      Phone:   document.getElementById('cPhone').value || null,
      Subject: document.getElementById('cSubject').value,
      Message: document.getElementById('cMessage').value,
    };

    /*
    ============================================================
    الربط مع ASP.NET Core:
    fetch('/api/Contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(r => {
      if (r.ok) showSuccess();
      else alert('حدث خطأ، حاول مرة أخرى');
    });
    ============================================================
    */

    console.log('Contact:', data);
    showSuccess();
  }

  function showSuccess() {
    const box = document.getElementById('successBox');
    box.classList.add('show');
    document.getElementById('contactForm').reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => box.classList.remove('show'), 8000);
  }
