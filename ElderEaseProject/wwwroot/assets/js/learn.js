/* === learn.js - النسخة الديناميكية المعتمدة === */
const API_LEARN = 'https://localhost:7188/api/LearnContent';

document.addEventListener('DOMContentLoaded', () => {
    fetchLessons();
});

// 1. دالة جلب البيانات مع الـ Spinner
async function fetchLessons() {
    const accordion = document.getElementById('lessonsAccordion');
    if (!accordion) return;

    // إظهار الـ Spinner أثناء التحميل (طلب الليدر)
    accordion.innerHTML = `
        <div class="col-12 text-center p-5">
            <div class="spinner-border text-primary" role="status" style="width: 3rem; height: 3rem;"></div>
            <p class="mt-3 text-muted">جاري تحميل المحتوى التعليمي...</p>
        </div>`;

    try {
        const response = await fetch(API_LEARN);
        if (!response.ok) throw new Error();

        const data = await response.json();
        renderLessons(data);
    } catch (e) {
        console.error("فشل جلب الدروس");
        accordion.innerHTML = '<p class="text-center w-100 p-5 text-muted">عذراً، فشل تحميل المحتوى. تأكد من تشغيل السيرفر.</p>';
    }
}

// 2. دالة الرسم (Render) لتحويل البيانات لكود HTML
function renderLessons(lessons) {
    const accordion = document.getElementById('lessonsAccordion');
    accordion.innerHTML = '';

    if (lessons.length === 0) {
        accordion.innerHTML = '<p class="text-center w-100 p-5">لا توجد دروس متاحة حالياً.</p>';
        return;
    }

    lessons.forEach((lesson, index) => {
        // استخدام الأسماء من السواجر: Title, Description, Category
        accordion.innerHTML += `
            <div class="accordion-item mb-3 border-0 shadow-sm rounded" data-cat="${lesson.Category}">
                <h2 class="accordion-header" id="heading${index}">
                    <button class="accordion-button collapsed fw-bold" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${index}">
                        ${lesson.Title} 
                        <span class="badge bg-light text-primary ms-2" style="font-size: 0.7rem;">${lesson.Category}</span>
                    </button>
                </h2>
                <div id="collapse${index}" class="accordion-collapse collapse" data-bs-parent="#lessonsAccordion">
                    <div class="accordion-body text-muted">
                        ${lesson.Description}
                    </div>
                </div>
            </div>`;
    });
}

// 3. دالة الفلترة (تعديل لتعمل مع البيانات الديناميكية)
function filterCat(btn, cat) {
    document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');

    document.querySelectorAll('.accordion-item').forEach(item => {
        const itemCat = item.getAttribute('data-cat');
        item.style.display = (cat === 'all' || itemCat === cat) ? '' : 'none';
    });
}

// 4. دالة البحث
function searchLessons() {
    const q = document.getElementById('searchInput').value.toLowerCase();
    document.querySelectorAll('.accordion-item').forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(q) ? '' : 'none';
    });
}