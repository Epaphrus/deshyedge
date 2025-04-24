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
        '/Assets/Images/Photos/Bamboo.jpg',
        '/Assets/Images/Photos/City.jpg'
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

/**
 * Services Overview Section Functionality
 * - Tab switching for service details
 * - Animations and interactions
 */
document.addEventListener('DOMContentLoaded', function () {
    // Service tabs functionality
    const serviceTabs = document.querySelectorAll('.service-tab');
    const serviceContents = document.querySelectorAll('.service-content');

    // Initialize tabs
    if (serviceTabs.length > 0 && serviceContents.length > 0) {
        serviceTabs.forEach(tab => {
            tab.addEventListener('click', function () {
                // Get the target tab
                const targetTab = this.getAttribute('data-tab');
                const targetContent = document.getElementById(targetTab);

                // Remove active class from all tabs
                serviceTabs.forEach(t => {
                    t.classList.remove('active-tab', 'bg-primary/10', 'text-light');
                    t.classList.add('text-light/70');
                });

                // Add active class to clicked tab
                this.classList.add('active-tab', 'bg-primary/10', 'text-light');
                this.classList.remove('text-light/70');

                // Hide all content sections
                serviceContents.forEach(content => {
                    content.classList.remove('active');
                    content.classList.add('hidden');
                });

                // Show target content
                if (targetContent) {
                    targetContent.classList.add('active');
                    targetContent.classList.remove('hidden');

                    // Add a subtle animation
                    targetContent.style.opacity = '0';
                    targetContent.style.transform = 'translateY(10px)';

                    setTimeout(() => {
                        targetContent.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
                        targetContent.style.opacity = '1';
                        targetContent.style.transform = 'translateY(0)';
                    }, 50);
                }
            });
        });
    }

    // Service card hover effects
    const serviceCards = document.querySelectorAll('.group.relative.bg-white.rounded-2xl');

    serviceCards.forEach(card => {
        // Add subtle animation on hover
        card.addEventListener('mouseenter', function () {
            // Find the icon container
            const iconContainer = this.querySelector('.w-24.h-24.rounded-full');
            if (iconContainer) {
                iconContainer.style.transform = 'scale(1.1) rotate(5deg)';
                iconContainer.style.transition = 'transform 0.5s ease';
            }

            // Animate decorative elements
            const decorElements = this.querySelectorAll('.border-2.border-primary\\/20');
            decorElements.forEach(elem => {
                elem.style.transition = 'transform 0.7s ease, opacity 0.7s ease';
                elem.style.opacity = '1';
            });
        });

        card.addEventListener('mouseleave', function () {
            // Reset icon animation
            const iconContainer = this.querySelector('.w-24.h-24.rounded-full');
            if (iconContainer) {
                iconContainer.style.transform = 'scale(1) rotate(0deg)';
            }

            // Reset decorative elements
            const decorElements = this.querySelectorAll('.border-2.border-primary\\/20');
            decorElements.forEach(elem => {
                elem.style.opacity = '0.7';
            });
        });
    });

    // Learn more links animation
    const learnMoreLinks = document.querySelectorAll('.group\\/link');

    learnMoreLinks.forEach(link => {
        link.addEventListener('mouseenter', function () {
            const underline = this.querySelector('span span');
            if (underline) {
                underline.style.transform = 'scaleX(1)';
            }

            const arrow = this.querySelector('svg');
            if (arrow) {
                arrow.style.transform = 'translateX(5px)';
            }
        });

        link.addEventListener('mouseleave', function () {
            const underline = this.querySelector('span span');
            if (underline) {
                underline.style.transform = 'scaleX(0)';
            }

            const arrow = this.querySelector('svg');
            if (arrow) {
                arrow.style.transform = 'translateX(0)';
            }
        });
    });

    // Smooth scroll for anchor links within the services section
    const serviceLinks = document.querySelectorAll('#services-overview a[href^="#"]');

    serviceLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Calculate header height for offset
                const headerHeight = document.querySelector('header')?.offsetHeight || 0;

                // Scroll to target with offset for fixed header
                window.scrollTo({
                    top: targetElement.offsetTop - headerHeight - 20, // Extra 20px padding
                    behavior: 'smooth'
                });
            }
        });
    });
});

/**
 * Testimonials Slider Functionality
 * - Implements Swiper.js for the testimonial carousel
 * - Handles navigation and pagination
 */
document.addEventListener('DOMContentLoaded', function() {
    // Check if Swiper is loaded and the testimonial slider exists
    if (typeof Swiper === 'undefined') {
        // Load Swiper if it's not already loaded
        const swiperScript = document.createElement('script');
        swiperScript.src = 'https://unpkg.com/swiper@8/swiper-bundle.min.js';
        swiperScript.onload = initTestimonialSlider;
        document.head.appendChild(swiperScript);
        
        // Load Swiper CSS
        const swiperStyle = document.createElement('link');
        swiperStyle.rel = 'stylesheet';
        swiperStyle.href = 'https://unpkg.com/swiper@8/swiper-bundle.min.css';
        document.head.appendChild(swiperStyle);
    } else {
        // If Swiper is already loaded, initialize the slider
        initTestimonialSlider();
    }
    
    function initTestimonialSlider() {
        // Check if the testimonial slider container exists
        const testimonialSlider = document.querySelector('.testimonial-slider .swiper-container');
        if (!testimonialSlider) return;
        
        // Initialize Swiper with simpler configuration to avoid fade issues
        const swiper = new Swiper(testimonialSlider, {
            // Basic parameters
            slidesPerView: 1,
            spaceBetween: 30,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            speed: 600,
            
            // Use slide effect instead of fade to ensure visibility
            effect: 'slide',
            
            // Navigation buttons
            navigation: {
                nextEl: '.testimonial-next',
                prevEl: '.testimonial-prev',
            },
            
            // Pagination
            pagination: {
                el: '.testimonial-pagination',
                clickable: true,
                bulletClass: 'w-3 h-3 rounded-full bg-light/20 inline-block mx-1 transition-all duration-300',
                bulletActiveClass: 'bg-primary w-6',
                renderBullet: function(index, className) {
                    return '<span class="' + className + '"></span>';
                },
            }
        });
        
        // Add hover pause functionality
        testimonialSlider.addEventListener('mouseenter', function() {
            if (swiper.autoplay.running) {
                swiper.autoplay.stop();
            }
        });
        
        testimonialSlider.addEventListener('mouseleave', function() {
            if (!swiper.autoplay.running) {
                swiper.autoplay.start();
            }
        });
        
        // Add accessibility features
        const prevButton = document.querySelector('.testimonial-prev');
        const nextButton = document.querySelector('.testimonial-next');
        
        if (prevButton) {
            prevButton.setAttribute('aria-label', 'Previous testimonial');
            prevButton.setAttribute('role', 'button');
            prevButton.setAttribute('tabindex', '0');
            
            // Allow keyboard navigation
            prevButton.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    swiper.slidePrev();
                }
            });
        }
        
        if (nextButton) {
            nextButton.setAttribute('aria-label', 'Next testimonial');
            nextButton.setAttribute('role', 'button');
            nextButton.setAttribute('tabindex', '0');
            
            // Allow keyboard navigation
            nextButton.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    swiper.slideNext();
                }
            });
        }
    }
});