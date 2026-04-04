/* === assets/js/organizations.js === */

document.addEventListener('DOMContentLoaded', () => {
    fetchOrganizations();
});

function fetchOrganizations() {
    const listContainer = document.getElementById('organizationsList');
    const loading = document.getElementById('loadingState');

    fetch('/api/Organizations')
        .then(res => res.json())
        .then(data => {
            if (loading) loading.remove();
            listContainer.innerHTML = '';

            data.forEach(org => {
                const card = document.createElement('div');
                card.className = 'col-md-6 col-lg-4';
                card.setAttribute('data-type', org.type); // للصحة، الخيري، إلخ
                
                card.innerHTML = `
                    <div class="org-card">
                        <span class="org-type org-${org.type}">${org.typeName}</span>
                        <h5>${org.name}</h5>
                        <p>${org.description}</p>
                        <div class="org-contact-item">
                            <i class="bi bi-geo-alt-fill"></i> ${org.address}
                        </div>
                        <div class="org-contact-item">
                            <i class="bi bi-telephone-fill"></i> <a href="tel:${org.phone}">${org.phone}</a>
                        </div>
                    </div>
                `;
                listContainer.appendChild(card);
            });
        })
        .catch(err => {
            console.error('Error:', err);
            listContainer.innerHTML = '<p class="text-center text-danger">فشل تحميل البيانات.</p>';
        });
}

function filterOrg(btn, type) {
    document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
    btn.classList.add('active');
    
    document.querySelectorAll('#organizationsList [data-type]').forEach(card => {
        card.style.display = (type === 'all' || card.dataset.type === type) ? '' : 'none';
    });
}

function searchOrgs() {
    const q = document.getElementById('orgSearch').value.toLowerCase();
    document.querySelectorAll('#organizationsList [data-type]').forEach(card => {
        card.style.display = card.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
}
