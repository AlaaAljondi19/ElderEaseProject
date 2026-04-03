/* === admin.js === */

// NAV
  function showSection(id, btn) {
    if (event) event.preventDefault();
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.querySelectorAll('.sidebar-link').forEach(l => l.classList.remove('active'));
    const el = document.getElementById('section-' + id);
    if (el) el.classList.add('active');
    if (btn) btn.classList.add('active');
    const titles = {dashboard:'لوحة التحكم',requests:'طلبات المساعدة',volunteers:'المتطوعون',users:'المستخدمون',organizations:'المؤسسات',messages:'الرسائل',settings:'الإعدادات'};
    document.getElementById('pageTitle').textContent = titles[id] || '';
    if (window.innerWidth <= 992) toggleMenu();
  }

  // MOBILE MENU
  function toggleMenu() {
    document.getElementById('sidebar').classList.toggle('open');
    document.getElementById('overlay').classList.toggle('show');
  }

  // BAR CHART (CSS only)
  const data = [8,12,5,18,7,14,10];
  const days = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس','الجمعة','السبت'];
  const maxVal = Math.max(...data);
  const bc = document.getElementById('barChart');
  const bl = document.getElementById('barLabels');
  data.forEach((v,i) => {
    const bar = document.createElement('div');
    bar.className = 'bar';
    const fill = document.createElement('div');
    fill.className = 'bar-fill';
    fill.title = `${days[i]}: ${v} طلبات`;
    bar.appendChild(fill);
    bc.appendChild(bar);
    const label = document.createElement('span');
    label.textContent = days[i];
    bl.appendChild(label);
    setTimeout(() => fill.style.height = (v / maxVal * 100) + '%', 200);
  });

  // ACTIONS
  function toggleStatus(btn) {
    const row = btn.closest('tr');
    const badge = row.querySelector('.status-badge');
    badge.className = 'status-badge s-done';
    badge.textContent = '✓ تمت';
    btn.remove();
  }
  function activateVol(btn) {
    const row = btn.closest('tr');
    const badge = row.querySelector('.status-badge');
    badge.className = 'status-badge s-active';
    badge.textContent = '● نشط';
    btn.textContent = 'إيقاف';
    btn.onclick = null;
  }
  function addVolunteer(e) {
    e.preventDefault();
    /*
    const data = Object.fromEntries(new FormData(e.target));
    fetch('/api/Volunteers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => { if(r.ok) { bootstrap.Modal.getInstance(document.getElementById('addVolModal')).hide(); location.reload(); } });
    */
    bootstrap.Modal.getInstance(document.getElementById('addVolModal')).hide();
    alert('تمت الإضافة بنجاح! (للعرض فقط - اربطها بالـ API)');
  }
