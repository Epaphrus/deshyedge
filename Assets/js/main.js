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
        header: document.querySelector('#main-header'),
        mobileMenuBtn: document.getElementById('mobile-menu-button'),
        mobileMenu: document.getElementById('mobile-menu'),
        navLinks: document.querySelectorAll('a[href^="#"]'),
        contactForm: document.getElementById('contact-form'),
        sections: document.querySelectorAll('section[id]'),
        progressCircle: document.getElementById('scroll-progress-circle'),
        allNavLinks: document.querySelectorAll('.nav-link, .mobile-nav-link'),
        hamburgerIcon: document.querySelector('.hamburger-icon')
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
                // mirror: false,
                // disable: 'mobile' // Disable on mobile for better performance
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
                            DOM.header.classList.add('scrolled');
                        } else {
                            DOM.header.classList.remove('scrolled');
                        }
                    }

                    // Update active navigation link based on scroll position
                    updateActiveNavOnScroll(scrollPosition);

                    // Update scroll progress
                    updateScrollProgress(scrollPosition);

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
    function updateActiveNavOnScroll(scrollPosition) {
        if (!DOM.sections || !DOM.sections.length) return;

        // Add offset for header height
        const scrollOffset = 100;

        // Check each section to see if it's in the viewport
        DOM.sections.forEach(section => {
            const sectionTop = section.offsetTop - scrollOffset;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                DOM.allNavLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // Add active class to current section links
                const activeLinks = document.querySelectorAll(`.nav-link[href="#${sectionId}"], .mobile-nav-link[href="#${sectionId}"]`);
                activeLinks.forEach(link => {
                    link.classList.add('active');
                });
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
            // Toggle body class for menu state
            document.body.classList.toggle('menu-open');
            
            // Toggle mobile menu visibility
            DOM.mobileMenu.classList.toggle('open');
        });

        // Close mobile menu when clicking a nav link
        const mobileLinks = DOM.mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                document.body.classList.remove('menu-open');
                DOM.mobileMenu.classList.remove('open');
            });
        });
    }

    /**
     * Set active navigation link based on current page
     */
    function setActiveNavigation() {
        const currentPage = window.location.pathname.split('/').pop();
        
        DOM.allNavLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            const linkHref = link.getAttribute('href');
            
            // Check if we're on the page this link points to
            if ((currentPage === linkHref) || 
                (currentPage === '' && linkPage === 'home') ||
                (currentPage === 'index.html' && linkPage === 'home') ||
                (currentPage === 'services.html' && linkPage === 'services')) {
                link.classList.add('active');
            } else if (!linkHref.includes('#')) {
                // Only remove active class for page links, not section links
                link.classList.remove('active');
            }
        });
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
     * Handle page transitions and animations
     */
    function initPageTransitions() {
        // Add page load animation
        document.body.classList.add('page-loaded');
        
        // Add scroll reveal animations for navigation elements
        if (DOM.header) {
            setTimeout(() => {
                DOM.header.classList.add('revealed');
            }, 100);
        }
    }

    /**
     * Initialize all functionality when DOM is fully loaded
     */
    function init() {
        initAOS();
        handleScrollEvents();
        initMobileMenu();
        setActiveNavigation();
        initSmoothScrolling();
        initContactForm();
        arCompatibilityCheck();
        initPageTransitions();
    }

    // Run initialization when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();