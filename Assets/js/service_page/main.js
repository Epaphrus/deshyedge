// Counter animation
document.addEventListener('DOMContentLoaded', function () {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-out',
        once: true
    });

    // Array of background images
    const backgroundImages = [
        '/Assets/Images/Photos/Trees.jpg',
        '/Assets/Images/Photos/model-s.jpg',
        '/Assets/Images/Photos/TeslaRed.avif'
    ];

    // Randomly select a background image
    const randomImage = backgroundImages[Math.floor(Math.random() * backgroundImages.length)];

    // Set the background image
    const heroBackground = document.querySelector('#services-hero img');
    if (heroBackground) {
        heroBackground.src = randomImage;
    }


    // Counter animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // The lower the slower

    const startCounters = () => {
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;

            const updateCount = () => {
                const increment = target / speed;

                if (count < target) {
                    count += increment;
                    counter.innerText = Math.ceil(count);
                    setTimeout(updateCount, 1);
                } else {
                    counter.innerText = target;
                }
            };

            updateCount();
        });
    };

    // Start counters when they come into view
    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    if (document.querySelector('#services-hero')) {
        observer.observe(document.querySelector('#services-hero'));
    }

    // Card parallax effect
    document.addEventListener('mousemove', function (e) {
        const cards = document.querySelectorAll('.card-parallax');

        cards.forEach(card => {
            const depth = card.getAttribute('data-depth');
            const moveX = (e.clientX - window.innerWidth / 2) * depth;
            const moveY = (e.clientY - window.innerHeight / 2) * depth;

            card.style.transform = `translate(${moveX}px, ${moveY}px) rotate(${card.style.transform.match(/rotate\(([^)]+)\)/) ? card.style.transform.match(/rotate\(([^)]+)\)/)[1] : '0deg'})`;
        });
    });
});

// Initialize AOS animation library
document.addEventListener('DOMContentLoaded', function () {

    // FAQ accordion functionality
    const faqToggles = document.querySelectorAll('.faq-toggle');

    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function () {
            const content = this.nextElementSibling;
            const icon = this.querySelector('.faq-icon');

            // Toggle content visibility
            content.classList.toggle('hidden');

            // Rotate icon
            if (content.classList.contains('hidden')) {
                icon.style.transform = 'rotate(0deg)';
            } else {
                icon.style.transform = 'rotate(180deg)';
            }

            // Close other FAQs
            faqToggles.forEach(otherToggle => {
                if (otherToggle !== toggle) {
                    const otherContent = otherToggle.nextElementSibling;
                    const otherIcon = otherToggle.querySelector('.faq-icon');

                    otherContent.classList.add('hidden');
                    otherIcon.style.transform = 'rotate(0deg)';
                }
            });
        });
    });

    // Animate service cards on hover
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.querySelector('.service-icon').classList.add('animate-bounce');
        });

        card.addEventListener('mouseleave', function () {
            this.querySelector('.service-icon').classList.remove('animate-bounce');
        });
    });

    // Lazy load images
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        const images = document.querySelectorAll('img[loading="lazy"]');
        images.forEach(img => {
            img.src = img.dataset.src;
        });
    } else {
        // Fallback for browsers that don't support lazy loading
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
        document.body.appendChild(script);
    }
});