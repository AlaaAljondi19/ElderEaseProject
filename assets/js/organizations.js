/* === assets/js/organizations.js === */

// 1. دالة البحث عن مؤسسة بالاسم أو الوصف
function searchOrgs() {
    const input = document.getElementById('orgSearch');
    const filter = input.value.toLowerCase();
    const grid = document.getElementById('orgsGrid');
    const cards = grid.getElementsByClassName('col-md-6');

    for (let i = 0; i < cards.length; i++) {
        const title = cards[i].querySelector('h5').innerText.toLowerCase();
        const text = cards[i].querySelector('p').innerText.toLowerCase();

        if (title.includes(filter) || text.includes(filter)) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}

// 2. دالة الفلترة حسب النوع (صحية، خيرية، تقاعد)
function filterOrg(btn, type) {
    // تغيير شكل الأزرار (إزالة active من الكل وإضافتها للمضغطوط عليه)
    document.querySelectorAll('.filter-tab').forEach(tab => tab.classList.remove('active'));
    btn.classList.add('active');

    const grid = document.getElementById('orgsGrid');
    const cards = grid.getElementsByClassName('col-md-6');

    for (let i = 0; i < cards.length; i++) {
        const cardType = cards[i].getAttribute('data-type');

        if (type === 'all' || cardType === type) {
            cards[i].style.display = "";
        } else {
            cards[i].style.display = "none";
        }
    }
}