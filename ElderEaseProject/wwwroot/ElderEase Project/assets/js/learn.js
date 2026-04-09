// فلترة الدروس حسب التصنيف
function filterCat(btn, cat) {
    // تحديث شكل الأزرار
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    // إخفاء/إظهار الدروس
    let items = document.querySelectorAll('.accordion-item');
    items.forEach(item => {
        if (cat === 'all' || item.getAttribute('data-cat') === cat) {
            item.classList.remove('d-none');
        } else {
            item.classList.add('d-none');
        }
    });
}

// البحث عن الدروس
function searchLessons() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    const items = document.querySelectorAll('.accordion-item');
    const noResults = document.getElementById('noResults');
    let found = false;

    items.forEach(item => {
        const text = item.innerText.toLowerCase();
        if (text.includes(query)) {
            item.classList.remove('d-none');
            found = true;
        } else {
            item.classList.add('d-none');
        }
    });

    // إظهار رسالة "لا توجد نتائج"
    if (!found) {
        noResults.classList.remove('d-none');
    } else {
        noResults.classList.add('d-none');
    }
}