document.addEventListener('DOMContentLoaded', () => {
    // --- Authentication ---
    const loginOverlay = document.getElementById('admin-login-overlay');
    const dashboardLayout = document.getElementById('dashboard-layout');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');

    // Check auth state
    if (localStorage.getItem('apexAdminAuth') === 'true') {
        loginOverlay.style.display = 'none';
        dashboardLayout.style.display = 'flex';
        loadData();
    }

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const user = document.getElementById('username').value;
        const pass = document.getElementById('password').value;

        if (user === 'admin' && pass === 'admin123') {
            localStorage.setItem('apexAdminAuth', 'true');
            loginOverlay.style.display = 'none';
            dashboardLayout.style.display = 'flex';
            loadData();
        } else {
            loginError.style.display = 'block';
        }
    });

    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('apexAdminAuth');
        window.location.reload();
    });

    // --- Navigation ---
    const navItems = document.querySelectorAll('.nav-item');
    const views = document.querySelectorAll('.view-content');
    const viewTitle = document.getElementById('view-title');

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');

            const viewId = item.getAttribute('data-view');
            views.forEach(v => v.style.display = 'none');
            document.getElementById(`view-${viewId}`).style.display = 'block';

            viewTitle.textContent = item.textContent;
        });
    });

    // --- Data Loading ---
    function loadData() {
        const bookings = JSON.parse(localStorage.getItem('apexBookings')) || [];
        const orders = JSON.parse(localStorage.getItem('apexOrders')) || [];
        const clients = JSON.parse(localStorage.getItem('apexClients')) || [];

        renderBookings(bookings);
        renderOrders(orders);
        renderClients(clients);
    }

    function renderBookings(bookings) {
        const tbody = document.getElementById('bookings-tbody');
        tbody.innerHTML = '';
        if (bookings.length === 0) {
            tbody.innerHTML = `<tr><td colspan="5" class="empty-row">No bookings found.</td></tr>`;
            return;
        }

        bookings.reverse().forEach(b => {
            tbody.innerHTML += `
                <tr>
                    <td>${b.date}</td>
                    <td>${b.name}</td>
                    <td>${b.phone}</td>
                    <td>${b.vehicle || '-'}</td>
                    <td><span style="color:var(--accent-gold);">${b.service}</span></td>
                </tr>
            `;
        });
    }

    function renderOrders(orders) {
        const tbody = document.getElementById('orders-tbody');
        tbody.innerHTML = '';
        if (orders.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="empty-row">No orders found.</td></tr>`;
            return;
        }

        orders.reverse().forEach(o => {
            const itemsStr = o.items.map(i => `${i.qty}x ${i.name}`).join('<br>');
            tbody.innerHTML += `
                <tr>
                    <td>${o.date}</td>
                    <td>#${o.id}</td>
                    <td>${o.name}</td>
                    <td>${o.phone}</td>
                    <td>${o.address}</td>
                    <td style="font-size:0.8rem; color:var(--text-secondary);">${itemsStr}</td>
                    <td style="color:var(--accent-gold); font-weight:600;">${o.total.toLocaleString()} ₸</td>
                </tr>
            `;
        });
    }

    function renderClients(clients) {
        const tbody = document.getElementById('clients-tbody');
        tbody.innerHTML = '';
        if (clients.length === 0) {
            tbody.innerHTML = `<tr><td colspan="4" class="empty-row">No clients found.</td></tr>`;
            return;
        }

        clients.reverse().forEach(c => {
            tbody.innerHTML += `
                <tr>
                    <td>${c.name}</td>
                    <td>${c.phone}</td>
                    <td>${c.lastDate}</td>
                    <td><span style="background:var(--surface-lighter); padding:2px 8px; border-radius:4px; font-size:0.8rem;">${c.source}</span></td>
                </tr>
            `;
        });
    }
});
