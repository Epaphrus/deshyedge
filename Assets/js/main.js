/**
 * DeshyEdge Consulting - Main JavaScript
 * This file contains all interactive functionality for the DeshyEdge website
 * including navigation, animations, form handling, and scroll effects.
 */

// Wrap everything in an IIFE to avoid global scope pollution
(function() {
    'use strict';
    
    /**
     * Initialize AOS (Animate On Scroll) library with optimal settings
     */
    function initAOS() {
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false,
            disable: 'mobile' // Disable on mobile for better performance
        });
    }
    
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
        sections: document.querySelectorAll('section[id]')
    };
    
    /**
     * Handle scroll events with throttling for performance
     */
    function handleScrollEvents() {
        let ticking = false;
        
        window.addEventListener('scroll', function() {
            if (!ticking) {
                window.requestAnimationFrame(function() {
                    const scrollPosition = window.scrollY;
                    
                    // Header scroll effect
                    if (scrollPosition > 50) {
                        DOM.header.classList.add('bg-light/95', 'shadow-md');
                        DOM.header.classList.remove('bg-light/90');
                    } else {
                        DOM.header.classList.remove('bg-light/95', 'shadow-md');
                        DOM.header.classList.add('bg-light/90');
                    }
                    
                    // Back to top button visibility
                    if (scrollPosition > 300) {
                        DOM.backToTopBtn.classList.remove('opacity-0', 'translate-y-10');
                        DOM.backToTopBtn.classList.add('opacity-100', 'translate-y-0');
                    } else {
                        DOM.backToTopBtn.classList.add('opacity-0', 'translate-y-10');
                        DOM.backToTopBtn.classList.remove('opacity-100', 'translate-y-0');
                    }
                    
                    // Update active navigation link based on scroll position
                    updateActiveNavLink(scrollPosition);
                    
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
    
    /**
     * Initialize smooth scrolling for anchor links
     */
    function initSmoothScrolling() {
        DOM.navLinks.forEach(anchor => {
            anchor.addEventListener('click', function(e) {
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
     * Initialize back to top button functionality
     */
    function initBackToTop() {
        if (!DOM.backToTopBtn) return;
        
        DOM.backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
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
     * Show a message after form submission
     * @param {string} message - The message to display
     * @param {string} type - The type of message ('success' or 'error')
     */
    function showFormMessage(message, type) {
        // Remove any existing message
        const existingMessage = DOM.contactForm.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }
        
        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message p-4 rounded-lg mt-4 ${
            type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`;
        messageElement.textContent = message;
        
        // Add message to form
        DOM.contactForm.appendChild(messageElement);
        
        // Remove message after 5 seconds if it's a success message
        if (type === 'success') {
            setTimeout(() => {
                messageElement.remove();
            }, 5000);
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
    }
    
    // Run initialization when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();