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
        allNavLinks: document.querySelectorAll('.nav-link, .mobile-nav-link')
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

                    // Update active navigation based on scroll position
                    updateActiveNavOnScroll();

                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    /**
     * Toggle mobile menu
     */
    function setupMobileMenu() {
        if (!DOM.mobileMenuBtn || !DOM.mobileMenu) return;

        DOM.mobileMenuBtn.addEventListener('click', function () {
            document.body.classList.toggle('menu-open');
            DOM.mobileMenu.classList.toggle('open');
        });

        // Close mobile menu when clicking on a link
        const mobileLinks = DOM.mobileMenu.querySelectorAll('a');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function () {
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
            } else {
                link.classList.remove('active');
            }
        });
    }

    /**
     * Update active navigation based on scroll position
     */
    function updateActiveNavOnScroll() {
        if (!DOM.sections) return;

        const scrollPosition = window.scrollY + 100;

        DOM.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                DOM.allNavLinks.forEach(link => {
                    if (link.getAttribute('href').includes(sectionId)) {
                        link.classList.add('active');
                    } else if (link.getAttribute('href').includes('#')) {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }

    /**
     * Initialize all functions
     */
    function init() {
        initAOS();
        handleScrollEvents();
        setupMobileMenu();
        setActiveNavigation();
        
        // Add any other initialization functions here
    }

    // Run initialization when DOM is fully loaded
    document.addEventListener('DOMContentLoaded', init);
})();