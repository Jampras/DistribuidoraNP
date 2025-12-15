document.addEventListener('DOMContentLoaded', () => {
    // ========================================
    // Mobile Menu Toggle
    // ========================================
    const mobileBtn = document.querySelector('.mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');

    if (mobileBtn) {
        mobileBtn.addEventListener('click', () => {
            mobileBtn.classList.toggle('active');
            navLinks.classList.toggle('active');
            document.body.style.overflow = navLinks.classList.contains('active') ? 'hidden' : '';
        });
    }

    // Close menu when clicking a link
    navLinksItems.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileBtn) {
                mobileBtn.classList.remove('active');
                navLinks.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // ========================================
    // Header Scroll Shadow Enhancement
    // ========================================
    const header = document.getElementById('main-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.03)';
            }
        });
    }

    // ========================================
    // Intersection Observer for Card Animations
    // ========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe all product and benefit cards
    const productCards = document.querySelectorAll('.product-card');
    const benefitCards = document.querySelectorAll('.benefit-card');

    productCards.forEach(card => cardObserver.observe(card));
    benefitCards.forEach(card => cardObserver.observe(card));

    // ========================================
    // Animated Number Counter for Stats
    // ========================================
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statNumber = entry.target;
                const text = statNumber.textContent.trim();

                // Extract number and suffix
                let number = 0;
                let suffix = '';

                if (text.includes('+')) {
                    number = parseInt(text.replace(/[^0-9]/g, ''));
                    suffix = '+';
                } else if (text.includes('%')) {
                    number = parseInt(text.replace(/[^0-9]/g, ''));
                    suffix = '%';
                } else if (text.includes('/')) {
                    // For ratings like 4.9/5, just show as is
                    statNumber.classList.add('animated');
                    statsObserver.unobserve(statNumber);
                    return;
                } else {
                    number = parseInt(text.replace(/[^0-9]/g, ''));
                }

                statNumber.classList.add('animated');

                // Animate the number
                let current = 0;
                const increment = number / 100;
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= number) {
                        statNumber.textContent = number.toLocaleString() + suffix;
                        clearInterval(timer);
                    } else {
                        statNumber.textContent = Math.floor(current).toLocaleString() + suffix;
                    }
                }, 20);

                statsObserver.unobserve(statNumber);
            }
        });
    }, { threshold: 0.5 });

    // Observe all stat numbers
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(stat => statsObserver.observe(stat));

    // ========================================
    // 3D Tilt Effect for Cards (Advanced)
    // ========================================
    const cards = document.querySelectorAll('.benefit-card, .product-card');

    cards.forEach(card => {
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
            card.style.transform = '';
        });
    });

    // ========================================
    // Smooth Scroll for Anchor Links
    // ========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ========================================
    // Parallax Effect for Hero Background
    // ========================================
    const hero = document.getElementById('hero');
    if (hero) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallax = scrolled * 0.5;
            hero.style.transform = `translateY(${parallax}px)`;
        });
    }

    // ========================================
    // Mobile Carousel Functionality
    // ========================================
    function initCarousel(carouselId) {
        const carousel = document.getElementById(carouselId);
        if (!carousel) return;

        const track = carousel.querySelector('.carousel-track');
        const dotsContainer = carousel.querySelector('.carousel-dots');
        const cards = track.querySelectorAll('.product-card, .benefit-card');

        if (cards.length === 0) return;

        // Create dots
        cards.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.classList.add('carousel-dot');
            dot.setAttribute('aria-label', `Ir para slide ${index + 1}`);
            if (index === 0) dot.classList.add('active');

            dot.addEventListener('click', () => {
                const cardWidth = cards[index].offsetWidth;
                const gap = 15;
                const scrollPosition = (cardWidth + gap) * index;
                track.scrollTo({
                    left: scrollPosition,
                    behavior: 'smooth'
                });
            });

            dotsContainer.appendChild(dot);
        });

        // Update active dot on scroll
        let scrollTimeout;
        track.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                const scrollLeft = track.scrollLeft;
                const cardWidth = cards[0].offsetWidth;
                const gap = 15;
                const currentIndex = Math.round(scrollLeft / (cardWidth + gap));

                const dots = dotsContainer.querySelectorAll('.carousel-dot');
                dots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentIndex);
                });
            }, 100);
        });

        // Touch swipe enhancement
        let touchStartX = 0;
        let touchEndX = 0;

        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                // Swipe detection for analytics or additional effects
                // Scroll behavior is already handled by CSS scroll-snap
            }
        }
    }

    // Initialize carousels on mobile
    if (window.innerWidth <= 768) {
        initCarousel('products-carousel');
        initCarousel('benefits-carousel');
    }

    // Reinitialize on resize
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            const dotsProducts = document.querySelector('#products-carousel .carousel-dots');
            const dotsBenefits = document.querySelector('#benefits-carousel .carousel-dots');

            if (dotsProducts) dotsProducts.innerHTML = '';
            if (dotsBenefits) dotsBenefits.innerHTML = '';

            if (window.innerWidth <= 768) {
                initCarousel('products-carousel');
                initCarousel('benefits-carousel');
            }
        }, 250);
    });

    // ========================================
    // Testimonials Infinite Carousel
    // ========================================
    const testimonialTrack = document.querySelector('.testimonial-track');
    if (testimonialTrack) {
        const cards = Array.from(testimonialTrack.children);

        // Clone all cards twice for seamless infinite loop
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            testimonialTrack.appendChild(clone);
        });

        // Clone again for extra smoothness
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            testimonialTrack.appendChild(clone);
        });
    }

    console.log('🎉 NP Distribuidora - Animations loaded!');
});
