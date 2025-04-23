/**
 * DeshyEdge Consulting - Main JavaScript
 * This file contains all interactive functionality for the DeshyEdge website
 * including navigation, animations, form handling, and scroll effects.
 */

// Wrap everything in an IIFE to avoid global scope pollution
(function () {
    'use strict';

    /**
     * Cache DOM elements for better performance
     * @type {Object}
     */
    const DOM = {
        header: document.querySelector('header'),
        mobileMenuBtn: document.getElementById('mobile-menu-button'),
        mobileMenu: document.getElementById('mobile-menu'),
        backToTopBtn: document.getElementById('back-to-top'),
        navLinks: document.querySelectorAll('a[href^="#"]'),
        contactForm: document.getElementById('contact-form'),
        sections: document.querySelectorAll('section[id]'),
        progressCircle: document.getElementById('scroll-progress-circle')
    };

    /**
     * Initialize AOS (Animate On Scroll) library with optimal settings
     */
    function initAOS() {
        if (typeof AOS !== 'undefined') {
            AOS.init({
                duration: 800,
                easing: 'ease-in-out',
                once: true,
                mirror: false,
                disable: 'mobile' // Disable on mobile for better performance
            });
        }
    }

    /**
     * Handle scroll events with throttling for performance
     */
    function handleScrollEvents() {
        if (!DOM.header) return;
        
        let ticking = false;
        let lastScrollTop = 0;

        window.addEventListener('scroll', function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    const scrollPosition = window.scrollY;

                    // Header scroll effect
                    if (DOM.header) {
                        if (scrollPosition > 50) {
                            DOM.header.classList.add('bg-light/95', 'shadow-md');
                            DOM.header.classList.remove('bg-light/90');
                        } else {
                            DOM.header.classList.remove('bg-light/95', 'shadow-md');
                            DOM.header.classList.add('bg-light/90');
                        }
                    }

                    // Back to top button visibility
                    if (DOM.backToTopBtn) {
                        if (scrollPosition > 300) {
                            DOM.backToTopBtn.classList.remove('opacity-0', 'translate-y-10');
                            DOM.backToTopBtn.classList.add('opacity-100', 'translate-y-0');
                        } else {
                            DOM.backToTopBtn.classList.add('opacity-0', 'translate-y-10');
                            DOM.backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
                        }
                    }

                    // Update active navigation link based on scroll position
                    updateActiveNavLink(scrollPosition);

                    // Update scroll progress
                    updateScrollProgress(scrollPosition);

                    // Add elastic effect based on scroll velocity
                    if (DOM.backToTopBtn && Math.abs(lastScrollTop - scrollPosition) > 50) {
                        DOM.backToTopBtn.classList.add('scale-110');
                        setTimeout(() => {
                            DOM.backToTopBtn.classList.remove('scale-110');
                        }, 200);
                    }
                    lastScrollTop = scrollPosition;

                    ticking = false;
                });

                ticking = true;
            }
        });
    }

    /**
     * Update the active navigation link based on scroll position
     * @param {number} scrollPosition - Current scroll position
     */
    function updateActiveNavLink(scrollPosition) {
        if (!DOM.sections || !DOM.sections.length || !DOM.navLinks || !DOM.navLinks.length) return;
        
        // Add offset for header height
        const scrollOffset = 100;

        // Check each section to see if it's in the viewport
        DOM.sections.forEach(section => {
            const sectionTop = section.offsetTop - scrollOffset;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                DOM.navLinks.forEach(link => {
                    link.classList.remove('text-primary');
                });

                // Add active class to current section link
                const activeLink = document.querySelector(`a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('text-primary');
                }
            }
        });
    }

    /**
     * Update scroll progress indicator
     * @param {number} scrollPosition - Current scroll position
     */
    function updateScrollProgress(scrollPosition) {
        if (!DOM.progressCircle) return;

        // Calculate document height
        const body = document.body;
        const html = document.documentElement;
        const docHeight = Math.max(
            body.scrollHeight, body.offsetHeight,
            html.clientHeight, html.scrollHeight, html.offsetHeight
        );
        
        const winHeight = window.innerHeight;
        const scrollPercent = scrollPosition / (docHeight - winHeight);

        // Update circle progress
        const circumference = 2 * Math.PI * 44; // 2πr where r=44
        const offset = circumference - (scrollPercent * circumference);
        DOM.progressCircle.style.strokeDashoffset = offset;
    }

    /**
     * Initialize mobile menu functionality
     */
    function initMobileMenu() {
        if (!DOM.mobileMenuBtn || !DOM.mobileMenu) return;

        DOM.mobileMenuBtn.addEventListener('click', () => {
            // Toggle the hidden class to show/hide the mobile menu
            DOM.mobileMenu.classList.toggle('hidden');

            // Change the icon from hamburger to X and vice versa
            const isOpen = !DOM.mobileMenu.classList.contains('hidden');

            DOM.mobileMenuBtn.innerHTML = isOpen
                ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>'
                : '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>';
        });

        // Close mobile menu when clicking a nav link
        if (DOM.navLinks) {
            DOM.navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    if (DOM.mobileMenu && !DOM.mobileMenu.classList.contains('hidden')) {
                        DOM.mobileMenu.classList.add('hidden');

                        // Reset hamburger icon
                        DOM.mobileMenuBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" /></svg>';
                    }
                });
            });
        }
    }

    /**
     * Initialize smooth scrolling for anchor links
     */
    function initSmoothScrolling() {
        if (!DOM.navLinks) return;
        
        DOM.navLinks.forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();

                const targetId = this.getAttribute('href');

                if (targetId === '#') return;

                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    const headerOffset = 80; // Adjust for header height
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    /**
     * Initialize back to top button with scroll progress
     */
    function initBackToTop() {
        if (!DOM.backToTopBtn) return;

        // Add CSS for floating animation
        const style = document.createElement('style');
        style.textContent = `
            @keyframes float {
                0% { transform: translateY(0px); }
                50% { transform: translateY(-5px); }
                100% { transform: translateY(0px); }
            }
        `;
        document.head.appendChild(style);

        // Smooth scroll with elastic effect
        DOM.backToTopBtn.addEventListener('click', () => {
            // Add click animation
            DOM.backToTopBtn.classList.add('scale-90');
            setTimeout(() => {
                DOM.backToTopBtn.classList.remove('scale-90');
            }, 200);

            // Smooth scroll with easing
            const scrollToTop = () => {
                const c = document.documentElement.scrollTop || document.body.scrollTop;
                if (c > 0) {
                    window.requestAnimationFrame(scrollToTop);
                    // Implement custom easing for more natural feel
                    window.scrollTo(0, c - c / 8);
                }
            };
            scrollToTop();
        });
    }

    /**
     * Show form message to user
     * @param {string} message - Message to display
     * @param {string} type - Message type (success/error)
     */
    function showFormMessage(message, type) {
        const messageElement = document.getElementById('form-message');
        
        if (!messageElement) {
            // Create message element if it doesn't exist
            const newMessageElement = document.createElement('div');
            newMessageElement.id = 'form-message';
            newMessageElement.className = 'mt-4 p-3 rounded';
            
            if (DOM.contactForm) {
                DOM.contactForm.after(newMessageElement);
            }
            
            showFormMessage(message, type); // Call again now that element exists
            return;
        }
        
        // Set message content and styling
        messageElement.textContent = message;
        messageElement.className = 'mt-4 p-3 rounded';
        
        if (type === 'success') {
            messageElement.classList.add('bg-green-100', 'text-green-800');
        } else {
            messageElement.classList.add('bg-red-100', 'text-red-800');
        }
        
        // Auto-hide message after 5 seconds
        setTimeout(() => {
            messageElement.textContent = '';
            messageElement.className = 'mt-4 hidden';
        }, 5000);
    }

    /**
     * Initialize contact form submission and validation
     */
    function initContactForm() {
        if (!DOM.contactForm) return;

        DOM.contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Basic form validation
            const formData = new FormData(DOM.contactForm);
            const formValues = Object.fromEntries(formData.entries());

            // Check if any field is empty
            const hasEmptyFields = Object.values(formValues).some(value => !value.trim());

            if (hasEmptyFields) {
                showFormMessage('Please fill in all fields', 'error');
                return;
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formValues.email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }

            // Here you would typically send the data to a server
            // For now, we'll just show a success message
            console.log('Form submitted with values:', formValues);

            showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
            DOM.contactForm.reset();
        });
    }
   
    /**
     * Check if device supports AR for industries section
     */
    function arCompatibilityCheck() {
        const industriesSection = document.getElementById('industries');

        if (industriesSection) {
            // This will be handled by the ar-industries.js script
            console.log('Industries section found, AR compatibility will be checked by ar-industries.js');
        }
    }

    /**
     * Initialize all functionality when DOM is fully loaded
     */
    function init() {
        initAOS();
        handleScrollEvents();
        initMobileMenu();
        initSmoothScrolling();
        initBackToTop();
        initContactForm();
        arCompatibilityCheck();
    }

    // Run initialization when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();