document.addEventListener('DOMContentLoaded', () => {
    
    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
        mobileMenu.classList.toggle('active');
        
        const bars = mobileMenuBtn.querySelectorAll('.bar');
        if (mobileMenu.classList.contains('active')) {
            bars[0].style.transform = 'translateY(7px) rotate(45deg)';
            bars[1].style.opacity = '0';
            bars[2].style.transform = 'translateY(-7px) rotate(-45deg)';
            document.body.style.overflow = 'hidden';
        } else {
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
            document.body.style.overflow = 'auto';
        }
    }

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }

    if (mobileLinks) {
        mobileLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // Scroll Reveal Animation (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        root: null,
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // --- Phone Masking & Validation (+7 7XX XXX XX XX) ---
    function setupPhoneMask(inputElement) {
        if (!inputElement) return;

        inputElement.addEventListener('input', function(e) {
            let val = this.value.replace(/\D/g, ''); // remove non-digits
            
            // Force start with 77
            if (!val.startsWith('7')) val = '7' + val;
            if (val.length > 1 && val[1] !== '7') val = '77' + val.substring(2);

            let formatted = '+7 (';
            if (val.length > 1) {
                formatted += val.substring(1, 4);
            }
            if (val.length >= 5) {
                formatted += ') ' + val.substring(4, 7);
            }
            if (val.length >= 8) {
                formatted += '-' + val.substring(7, 9);
            }
            if (val.length >= 10) {
                formatted += '-' + val.substring(9, 11);
            }

            this.value = formatted;
        });

        // Ensure it always starts with +7 (7 when focused
        inputElement.addEventListener('focus', function() {
            if (!this.value || this.value.length < 5) {
                this.value = '+7 (7';
            }
        });
    }

    const phoneInput = document.getElementById('phone');
    setupPhoneMask(phoneInput);

    // --- Form Submission & LocalStorage Persistence ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const phone = document.getElementById('phone').value;
            const vehicle = document.getElementById('vehicle').value;
            const serviceSelect = document.getElementById('service');
            const service = serviceSelect.options[serviceSelect.selectedIndex].text;

            // Validate phone length (18 chars: +7 (7XX) XXX-XX-XX)
            if (phone.length < 18) {
                alert("Please enter a complete Kazakhstan phone number.");
                return;
            }

            const btn = contactForm.querySelector('.submit-btn');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.8';
            
            // Save to Bookings
            const date = new Date().toLocaleDateString() + ' ' + new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            const booking = { date, name, phone, vehicle, service };
            
            let bookings = JSON.parse(localStorage.getItem('apexBookings')) || [];
            bookings.push(booking);
            localStorage.setItem('apexBookings', JSON.stringify(bookings));

            // Save to Clients (upsert logic)
            let clients = JSON.parse(localStorage.getItem('apexClients')) || [];
            const existingClient = clients.find(c => c.phone === phone);
            if (!existingClient) {
                clients.push({ name, phone, lastDate: date, source: 'Booking' });
            } else {
                existingClient.lastDate = date;
                existingClient.name = name; // Update name just in case
            }
            localStorage.setItem('apexClients', JSON.stringify(clients));

            // Simulate network request
            setTimeout(() => {
                btn.textContent = 'Inquiry Sent!';
                btn.style.backgroundColor = '#4ade80';
                btn.style.color = '#121214';
                contactForm.reset();
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.backgroundColor = '';
                    btn.style.color = '';
                    btn.style.opacity = '1';
                }, 3000);
            }, 1500);
        });
    }

    // Initialize custom select color behavior
    const selectControl = document.querySelector('.select-control');
    if (selectControl) {
        selectControl.addEventListener('change', function() {
            if (this.value !== "") {
                this.style.color = "var(--text-primary)";
            } else {
                this.style.color = "var(--text-secondary)";
            }
        });
    }
});
