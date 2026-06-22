// Products Data
const products = [
    {
        id: "p1",
        name: "Apex Ceramic Boost Spray",
        price: 18500,
        image: "images/product_ceramic_spray_1782096068369.png"
    },
    {
        id: "p2",
        name: "Plush 800GSM Microfiber Towel",
        price: 8500,
        image: "images/product_microfiber_1782096077943.png"
    },
    {
        id: "p3",
        name: "pH-Neutral Luxury Snow Foam",
        price: 12000,
        image: "images/product_soap_1782096086501.png"
    },
    {
        id: "p4",
        name: "Premium Leather Conditioner",
        price: 15500,
        image: "images/product_leather_care_1782096096204.png"
    }
];

let cart = JSON.parse(localStorage.getItem('apexCart')) || [];

function formatPrice(price) {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ") + " ₸";
}

function saveCart() {
    localStorage.setItem('apexCart', JSON.stringify(cart));
}

function renderProducts() {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    products.forEach(product => {
        const cartItem = cart.find(item => item.id === product.id);
        const quantity = cartItem ? cartItem.quantity : 0;
        
        const card = document.createElement('div');
        card.className = 'product-card reveal active';
        
        let actionHTML = '';
        if (quantity > 0) {
            actionHTML = `
                <div class="qty-controls">
                    <button class="qty-btn dec" data-id="${product.id}">-</button>
                    <span class="qty-value">${quantity}</span>
                    <button class="qty-btn inc" data-id="${product.id}">+</button>
                </div>
            `;
        } else {
            const currentLang = localStorage.getItem('preferredLang') || 'EN';
            const btnText = translations[currentLang] ? translations[currentLang]["btn.add_to_cart"] : "Add to Cart";
            actionHTML = `<button class="btn btn-outline btn-full add-to-cart-btn" data-id="${product.id}">${btnText}</button>`;
        }
        
        card.innerHTML = `
            <div class="product-img-wrapper">
                <img src="${product.image}" alt="${product.name}" class="product-img">
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <p class="product-price">${formatPrice(product.price)}</p>
                <div class="product-action" id="action-${product.id}">
                    ${actionHTML}
                </div>
            </div>
        `;
        
        grid.appendChild(card);
    });
    
    attachProductEvents();
}

function attachProductEvents() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            updateQuantity(id, 1);
        });
    });
    
    document.querySelectorAll('.qty-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = e.target.dataset.id;
            const item = cart.find(i => i.id === id);
            if (!item) return;
            
            if (e.target.classList.contains('inc')) {
                updateQuantity(id, item.quantity + 1);
            } else if (e.target.classList.contains('dec')) {
                updateQuantity(id, item.quantity - 1);
            }
        });
    });
}

function updateQuantity(id, newQuantity) {
    if (newQuantity <= 0) {
        cart = cart.filter(item => item.id !== id);
    } else {
        const item = cart.find(i => i.id === id);
        if (item) {
            item.quantity = newQuantity;
        } else {
            cart.push({ id, quantity: 1 });
        }
    }
    
    saveCart();
    renderProducts();
    updateCartUI();
}

function updateCartUI() {
    const badge = document.getElementById('cart-badge');
    const container = document.getElementById('cart-items-container');
    const totalEl = document.getElementById('cart-total-price');
    
    let totalQty = 0;
    let totalPrice = 0;
    
    if(!container) return;
    container.innerHTML = '';
    
    if (cart.length === 0) {
        const currentLang = localStorage.getItem('preferredLang') || 'EN';
        const emptyMsg = translations[currentLang] ? translations[currentLang]["cart.empty"] : "Your cart is empty.";
        container.innerHTML = `<p class="empty-cart-msg">${emptyMsg}</p>`;
    } else {
        cart.forEach(item => {
            const product = products.find(p => p.id === item.id);
            if (!product) return;
            
            totalQty += item.quantity;
            totalPrice += (product.price * item.quantity);
            
            const cartItemEl = document.createElement('div');
            cartItemEl.className = 'cart-item';
            cartItemEl.innerHTML = `
                <img src="${product.image}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${product.name}</h4>
                    <p class="cart-item-price">${formatPrice(product.price)}</p>
                    <div class="qty-controls small">
                        <button class="qty-btn dec" data-id="${product.id}">-</button>
                        <span class="qty-value">${item.quantity}</span>
                        <button class="qty-btn inc" data-id="${product.id}">+</button>
                    </div>
                </div>
            `;
            container.appendChild(cartItemEl);
        });
        
        container.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                const item = cart.find(i => i.id === id);
                if (e.target.classList.contains('inc')) {
                    updateQuantity(id, item.quantity + 1);
                } else if (e.target.classList.contains('dec')) {
                    updateQuantity(id, item.quantity - 1);
                }
            });
        });
    }
    
    if (totalQty > 0) {
        if(badge) {
            badge.style.display = 'flex';
            badge.textContent = totalQty;
        }
    } else {
        if(badge) badge.style.display = 'none';
    }
    
    if(totalEl) totalEl.textContent = formatPrice(totalPrice);
}

// UI Toggles & Validation
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
    
    const cartToggle = document.getElementById('cart-toggle-btn');
    const cartClose = document.getElementById('cart-close-btn');
    const cartPanel = document.getElementById('cart-panel');
    const cartOverlay = document.getElementById('cart-overlay');
    
    const checkoutBtn = document.getElementById('checkout-btn');
    const checkoutModal = document.getElementById('checkout-modal');
    const modalClose = document.getElementById('modal-close-btn');
    const checkoutForm = document.getElementById('checkout-form');
    
    function toggleCart() {
        if(cartPanel) cartPanel.classList.toggle('open');
        if(cartOverlay) cartOverlay.classList.toggle('open');
        if(cartPanel && cartPanel.classList.contains('open')) document.body.style.overflow = 'hidden';
        else document.body.style.overflow = 'auto';
    }
    
    function closeCart() {
        if(cartPanel) cartPanel.classList.remove('open');
        if(cartOverlay) cartOverlay.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
    
    function openModal() {
        if (cart.length === 0) return;
        closeCart();
        if(checkoutModal) checkoutModal.classList.add('open');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal() {
        if(checkoutModal) checkoutModal.classList.remove('open');
        document.body.style.overflow = 'auto';
    }
    
    if(cartToggle) cartToggle.addEventListener('click', toggleCart);
    if(cartClose) cartClose.addEventListener('click', closeCart);
    if(cartOverlay) cartOverlay.addEventListener('click', closeCart);
    
    if(checkoutBtn) checkoutBtn.addEventListener('click', openModal);
    if(modalClose) modalClose.addEventListener('click', closeModal);

    // --- Phone Masking ---
    const phoneInput = document.getElementById('order-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let val = this.value.replace(/\D/g, '');
            if (!val.startsWith('7')) val = '7' + val;
            if (val.length > 1 && val[1] !== '7') val = '77' + val.substring(2);

            let formatted = '+7 (';
            if (val.length > 1) formatted += val.substring(1, 4);
            if (val.length >= 5) formatted += ') ' + val.substring(4, 7);
            if (val.length >= 8) formatted += '-' + val.substring(7, 9);
            if (val.length >= 10) formatted += '-' + val.substring(9, 11);

            this.value = formatted;
        });

        phoneInput.addEventListener('focus', function() {
            if (!this.value || this.value.length < 5) {
                this.value = '+7 (7';
            }
        });
    }
    
    // --- Checkout Submit with Geocoding Validation ---
    if(checkoutForm) {
        checkoutForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = document.getElementById('submit-order-btn');
            const originalText = btn.textContent;
            
            const name = document.getElementById('order-name').value;
            const phone = document.getElementById('order-phone').value;
            const address = document.getElementById('order-address').value;

            if (phone.length < 18) {
                alert("Please enter a complete Kazakhstan phone number.");
                return;
            }

            btn.textContent = 'Verifying Address...';
            btn.style.opacity = '0.8';
            btn.disabled = true;

            try {
                // Nominatim Geocoding API for Almaty
                const query = encodeURIComponent(address + ", Almaty");
                const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${query}&limit=1`);
                const data = await response.json();

                if (data.length === 0) {
                    alert("Invalid address. Please enter a valid street or location in Almaty.");
                    btn.textContent = originalText;
                    btn.style.opacity = '1';
                    btn.disabled = false;
                    return;
                }
            } catch (err) {
                console.error(err);
                // Fallback check
                if (address.trim().length < 5) {
                    alert("Please enter a more detailed address.");
                    btn.textContent = originalText;
                    btn.style.opacity = '1';
                    btn.disabled = false;
                    return;
                }
            }

            btn.textContent = 'Processing...';
            
            const orderId = Math.floor(100000 + Math.random() * 900000);
            let totalPrice = 0;
            const orderItems = [];
            cart.forEach(item => {
                const product = products.find(p => p.id === item.id);
                if (product) {
                    totalPrice += (product.price * item.quantity);
                    orderItems.push({ name: product.name, qty: item.quantity, price: product.price });
                }
            });

            const date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            
            // Save to Orders
            const newOrder = { id: orderId, date, name, phone, address, items: orderItems, total: totalPrice };
            let orders = JSON.parse(localStorage.getItem('apexOrders')) || [];
            orders.push(newOrder);
            localStorage.setItem('apexOrders', JSON.stringify(orders));

            // Save to Clients
            let clients = JSON.parse(localStorage.getItem('apexClients')) || [];
            const existingClient = clients.find(c => c.phone === phone);
            if (!existingClient) {
                clients.push({ name, phone, lastDate: date, source: 'Shop' });
            } else {
                existingClient.lastDate = date;
                if (!existingClient.source.includes('Shop')) existingClient.source += ', Shop';
                existingClient.name = name;
            }
            localStorage.setItem('apexClients', JSON.stringify(clients));

            btn.textContent = 'Order Placed Successfully!';
            btn.style.backgroundColor = '#4ade80';
            btn.style.color = '#121214';
            
            cart = [];
            saveCart();
            renderProducts();
            updateCartUI();
            checkoutForm.reset();
            
            setTimeout(() => {
                closeModal();
                btn.textContent = originalText;
                btn.style.backgroundColor = '';
                btn.style.color = '';
                btn.style.opacity = '1';
                btn.disabled = false;
            }, 2000);
        });
    }
});
