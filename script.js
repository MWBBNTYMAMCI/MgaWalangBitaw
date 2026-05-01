// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particle-canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: null, y: null };
        this.maxParticles = 80;
        this.connectionDistance = 120;
        this.maxConnections = 3;
        this.init();
    }

    init() {
        this.resize();
        window.addEventListener('resize', () => this.resize());
        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.x;
            this.mouse.y = e.y;
        });
        window.addEventListener('mouseleave', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
        this.createParticles();
        this.animate();
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticles() {
        for (let i = 0; i < this.maxParticles; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2,
                color: Math.random() > 0.7 ? '#e94560' : '#8a8aa3'
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.particles.forEach((particle, i) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            if (this.mouse.x != null && this.mouse.y != null) {
                const dx = this.mouse.x - particle.x;
                const dy = this.mouse.y - particle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    const force = (150 - distance) / 150;
                    particle.vx += dx * force * 0.001;
                    particle.vy += dy * force * 0.001;
                }
            }
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.fill();
            let connections = 0;
            for (let j = i + 1; j < this.particles.length; j++) {
                if (connections >= this.maxConnections) break;
                const other = this.particles[j];
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < this.connectionDistance) {
                    this.ctx.beginPath();
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(other.x, other.y);
                    this.ctx.strokeStyle = '#e94560';
                    this.ctx.globalAlpha = (1 - dist / this.connectionDistance) * 0.15;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.stroke();
                    connections++;
                }
            }
        });
        this.ctx.globalAlpha = 1;
        requestAnimationFrame(() => this.animate());
    }
}

// ===== PAGE TRANSITION SYSTEM =====
class PageTransition {
    constructor() {
        this.overlay = document.querySelector('.page-transition');
        this.sections = document.querySelectorAll('.page-section');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.currentPage = 'home';
        this.init();
    }

    init() {
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetPage = link.getAttribute('data-page');
                if (targetPage !== this.currentPage) {
                    this.transitionTo(targetPage, link);
                }
            });
        });
        setTimeout(() => {
            this.animateSection('home');
        }, 300);
        window.addEventListener('scroll', () => {
            const navbar = document.querySelector('.navbar');
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    transitionTo(page, clickedLink) {
        this.overlay.classList.add('active');
        setTimeout(() => {
            this.sections.forEach(section => {
                section.classList.remove('active');
            });
            this.navLinks.forEach(link => link.classList.remove('active'));
            clickedLink.classList.add('active');
            const targetSection = document.getElementById(page);
            if (targetSection) {
                targetSection.classList.add('active');
                window.scrollTo({ top: 0, behavior: 'instant' });
            }
            this.currentPage = page;
            setTimeout(() => {
                this.overlay.classList.remove('active');
                this.animateSection(page);
            }, 400);
        }, 500);
    }

    animateSection(page) {
        const section = document.getElementById(page);
        if (!section) return;
        const animatedElements = section.querySelectorAll('[data-animate]');
        animatedElements.forEach((el, index) => {
            el.classList.remove('animated');
            const baseDelay = index * 50;
            const customDelay = parseInt(el.getAttribute('data-delay')) || 0;
            const totalDelay = baseDelay + customDelay;
            setTimeout(() => {
                el.classList.add('animated');
            }, totalDelay);
        });
    }
}

// ===== MOBILE MENU =====
class MobileMenu {
    constructor() {
        this.hamburger = document.querySelector('.hamburger');
        this.navMenu = document.querySelector('.nav-menu');
        this.navLinks = document.querySelectorAll('.nav-link');
        this.init();
    }

    init() {
        this.hamburger.addEventListener('click', () => {
            this.hamburger.classList.toggle('active');
            this.navMenu.classList.toggle('active');
        });
        this.navLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.hamburger.classList.remove('active');
                this.navMenu.classList.remove('active');
            });
        });
    }
}

// ===== NAVBAR PROGRESS BAR =====
class ScrollProgress {
    constructor() {
        this.progressBar = document.querySelector('.nav-progress');
        this.init();
    }

    init() {
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const progress = (scrollTop / docHeight) * 100;
            this.progressBar.style.width = `${progress}%`;
        });
    }
}

// ===== INTERSECTION OBSERVER FOR SCROLL ANIMATIONS =====
class ScrollAnimator {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                }
            });
        }, this.observerOptions);
        document.querySelectorAll('.page-section.active [data-animate]').forEach(el => {
            observer.observe(el);
        });
    }
}

// ===== MOUSE SPARKLE EFFECT =====
class SparkleEffect {
    constructor() {
        this.sections = document.querySelectorAll('.home-section, .event-section, .clan-section, .apply-section');
        this.init();
    }

    init() {
        this.sections.forEach(section => {
            section.addEventListener('mousemove', (e) => {
                this.createSparkle(e, section);
            });
        });
    }

    createSparkle(e, container) {
        if (Math.random() > 0.15) return;
        const sparkle = document.createElement('div');
        sparkle.className = 'mouse-sparkle';
        sparkle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: #e94560;
            border-radius: 50%;
            pointer-events: none;
            left: ${e.clientX - container.getBoundingClientRect().left}px;
            top: ${e.clientY - container.getBoundingClientRect().top}px;
            animation: sparkle-fade 1s ease-out forwards;
            box-shadow: 0 0 10px #e94560, 0 0 20px rgba(233, 69, 96, 0.5);
            z-index: 1;
        `;
        container.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1000);
    }
}

// ===== TILT EFFECT ON CARDS =====
class TiltEffect {
    constructor() {
        this.cards = document.querySelectorAll('.rule-card, .pillar-card, .benefit-card, .contest-card, .challenge-card, .identity-card, .step-card');
        this.init();
    }

    init() {
        this.cards.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
            });
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }
}

// ===== RIPPLE EFFECT =====
class RippleEffect {
    constructor() {
        this.elements = document.querySelectorAll('.rule-card, .pillar-card, .benefit-card, .step-card, .challenge-card, .identity-card');
        this.init();
    }

    init() {
        this.elements.forEach(el => {
            el.addEventListener('click', (e) => {
                this.createRipple(e, el);
            });
        });
    }

    createRipple(e, element) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: radial-gradient(circle, rgba(233, 69, 96, 0.3) 0%, transparent 70%);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple-expand 0.6s ease-out forwards;
            pointer-events: none;
            z-index: 0;
        `;
        element.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    }
}

// ===== MAGNETIC BUTTON EFFECT =====
class MagneticButton {
    constructor() {
        this.buttons = document.querySelectorAll('.nav-logo');
        this.init();
    }

    init() {
        this.buttons.forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
            });
        });
    }
}

// ===== TYPING EFFECT =====
class TypingEffect {
    constructor(element, text, speed = 50) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.index = 0;
        this.isTyping = false;
    }

    start() {
        if (this.isTyping) return;
        this.isTyping = true;
        this.element.textContent = '';
        this.element.classList.add('typing-cursor');
        this.type();
    }

    type() {
        if (this.index < this.text.length) {
            this.element.textContent += this.text.charAt(this.index);
            this.index++;
            setTimeout(() => this.type(), this.speed);
        } else {
            this.element.classList.remove('typing-cursor');
            this.isTyping = false;
        }
    }
}

// ===== TEXT SCRAMBLE EFFECT =====
class TextScramble {
    constructor(el) {
        this.el = el;
        this.chars = '!<>-_\/[]{}=+*^?#________';
        this.originalText = el.textContent;
    }

    scramble() {
        let iteration = 0;
        const interval = setInterval(() => {
            this.el.textContent = this.originalText
                .split('')
                .map((char, index) => {
                    if (index < iteration) return this.originalText[index];
                    return this.chars[Math.floor(Math.random() * this.chars.length)];
                })
                .join('');
            if (iteration >= this.originalText.length) {
                clearInterval(interval);
            }
            iteration += 1 / 2;
        }, 30);
    }
}

// ===== TACTICAL HUD TOGGLE =====
class TacticalHUD {
    constructor() {
        this.hud = document.querySelector('.hud-overlay');
        this.init();
    }

    init() {
        setTimeout(() => {
            this.hud.classList.add('active');
        }, 1000);
    }
}

// ===== INITIALIZE EVERYTHING =====
document.addEventListener('DOMContentLoaded', () => {
    // Add sparkle animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes sparkle-fade {
            0% { opacity: 1; transform: scale(1) translateY(0); }
            100% { opacity: 0; transform: scale(0) translateY(-30px); }
        }
        @keyframes ripple-expand {
            to { transform: scale(2); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    // Initialize all systems
    new ParticleSystem();
    new PageTransition();
    new MobileMenu();
    new ScrollAnimator();
    new SparkleEffect();
    new TiltEffect();
    new RippleEffect();
    new MagneticButton();
    new ScrollProgress();
    new TacticalHUD();

    // Text scramble on hover for logo
    const logo = document.querySelector('.nav-logo');
    if (logo) {
        const scrambler = new TextScramble(logo);
        logo.addEventListener('mouseenter', () => {
            scrambler.scramble();
        });
    }

    // Smooth scroll for any anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && !this.classList.contains('nav-link')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });

    // Reveal on scroll observer for all sections
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.page-section').forEach(section => {
        revealObserver.observe(section);
    });

    // Parallax effect for decorative elements
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        document.querySelectorAll('[data-parallax]').forEach(el => {
            const speed = parseFloat(el.getAttribute('data-parallax')) || 0.5;
            const yPos = -(scrolled * speed);
            el.style.transform = `translateY(${yPos}px)`;
        });
    });

    // Add floating animation to icons
    document.querySelectorAll('.contest-icon, .pillar-icon, .benefit-icon').forEach(el => {
        el.classList.add('float-animation');
    });

    // Console easter egg
    console.log('%c MWB | MgaWalangBitaw ', 'background: linear-gradient(135deg, #e94560, #c73e54); color: white; font-size: 20px; font-weight: bold; padding: 10px 20px; border-radius: 8px;');
    console.log('%c Never Let Go. ', 'color: #e94560; font-size: 14px; font-style: italic;');
});