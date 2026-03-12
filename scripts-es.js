
document.addEventListener('DOMContentLoaded', function () {
    // Smooth scroll del menú
    const links = document.querySelectorAll('nav ul li a');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                if (!targetElement) return;

                const headerOffset = 80;
                const elementPosition = targetElement.offsetTop;
                const offsetPosition = elementPosition - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Fondo reactivo del hero
    const hero = document.querySelector('.hero');
    const circles = document.querySelectorAll('.hero-bg-circle');

    if (hero && circles.length > 0) {
        hero.addEventListener('mousemove', (e) => {
            const rect = hero.getBoundingClientRect();
            const relX = (e.clientX - rect.left) / rect.width - 0.5;
            const relY = (e.clientY - rect.top) / rect.height - 0.5;

            circles.forEach((circle, index) => {
                const intensity = (index + 1) * 30;
                const moveX = -relX * intensity;
                const moveY = -relY * intensity;
                circle.style.transform = `translate(${moveX}px, ${moveY}px)`;
            });
        });
    }

    // Animación reveal
    const revealElements = document.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries, obs) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2 });

        revealElements.forEach(el => observer.observe(el));
    } else {
        revealElements.forEach(el => el.classList.add('is-visible'));
    }

    // Cursor glow
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.opacity = '1';
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
        cursorGlow.style.transform = 'translate(-50%, -50%)';
    });

    document.addEventListener('mouseleave', () => {
        cursorGlow.style.opacity = '0';
    });

    // Typing effect
    const text = "Soluciones confiables de transporte y logística";
    const typedText = document.getElementById("typed-text");
    const cursor = document.getElementById("cursor");
    let index = 0;

    function typeLetter() {
        if (index < text.length) {
            typedText.textContent += text.charAt(index);
            index++;
            setTimeout(typeLetter, 55);
        } else {
            cursor.style.animation = "blink 0.8s infinite";
        }
    }
    setTimeout(typeLetter, 400);

    // ===========================
    //  Guardar formulario contacto (con loading y anti doble clic)
    // ===========================
    const contactForm = document.getElementById('contact-form');
    const statusEl = document.getElementById('contact-status');
    const submitBtn = document.getElementById('contact-submit');

    if (contactForm && submitBtn) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value.trim();
            const email = document.getElementById('email').value.trim();
            const message = document.getElementById('message').value.trim();
            const company = document.getElementById('company')?.value.trim() || ""; // honeypot

            // 🐝 Honeypot: si trae algo, asumimos bot y no guardamos nada
            if (company.length > 0) {
                console.warn('Posible bot detectado (honeypot rellenado), no se guarda nada.');
                return;
            }

            if (!name || !email || !message) {
                if (statusEl) {
                    statusEl.textContent = 'Por favor completa todos los campos.';
                    statusEl.className = 'contact-status is-error';
                }
                return;
            }

            // Evitar doble clic mientras se envía
            if (submitBtn.disabled) return; // por si acaso
            const originalText = submitBtn.textContent;
            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            if (statusEl) {
                statusEl.textContent = 'Enviando mensaje...';
                statusEl.className = 'contact-status is-sending';
            }

            try {
                await db.collection('contactMessages').add({
                    name,
                    email,
                    message,
                    createdAt: firebase.firestore.FieldValue.serverTimestamp()
                });

                contactForm.reset();

                if (statusEl) {
                    statusEl.textContent = 'Gracias, hemos recibido tu mensaje. Nos pondremos en contacto contigo pronto.';
                    statusEl.className = 'contact-status is-success';
                }

                // Mostrar "Enviado" un momento y luego permitir otro mensaje
                submitBtn.textContent = 'Enviado ✅';
                setTimeout(() => {
                    submitBtn.disabled = false;
                    submitBtn.textContent = originalText;
                }, 2500);

            } catch (error) {
                console.error('Error al enviar mensaje:', error);
                if (statusEl) {
                    statusEl.textContent = 'Hubo un error al enviar tu mensaje. Intenta de nuevo más tarde.';
                    statusEl.className = 'contact-status is-error';
                }
                // Rehabilitamos el botón si falla
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
            }
        });
    }
});
