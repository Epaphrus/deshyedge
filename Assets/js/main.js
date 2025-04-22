// Initialize AOS (Animate On Scroll)
AOS.init({
    duration: 800,
    easing: 'ease-in-out',
    once: true,
    mirror: false
});

// DOM Elements
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('#mobile-menu-btn');
const mobileMenu = document.querySelector('#mobile-menu');
const backToTopBtn = document.querySelector('#back-to-top');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('#contact-form');

// Handle Scroll Events
window.addEventListener('scroll', () => {
    // Header scroll effect
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Back to top button visibility
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
    
    // Active nav link based on scroll position
    const scrollPosition = window.scrollY + 100;
    
    document.querySelectorAll('section').forEach(section => {
        if (section.offsetTop <= scrollPosition && 
            (section.offsetTop + section.offsetHeight) > scrollPosition) {
            
            const currentId = section.getAttribute('id');
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Mobile Menu Toggle
if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
        mobileMenuBtn.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    });
}

// Close mobile menu when clicking a nav link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        mobileMenuBtn.classList.remove('open');
    });
});

// Back to Top Button Click
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Contact Form Submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const formValues = Object.fromEntries(formData.entries());
        
        // Here you would typically send the data to a server
        // For now, we'll just log it and show a success message
        console.log('Form submitted with values:', formValues);
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'bg-success/20 text-success p-4 rounded-lg mt-4';
        successMessage.innerHTML = 'Thank you for your message! We will get back to you soon.';
        
        contactForm.appendChild(successMessage);
        contactForm.reset();
        
        // Remove success message after 5 seconds
        setTimeout(() => {
            successMessage.remove();
        }, 5000);
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80, // Adjust for header height
                behavior: 'smooth'
            });
        }
    });
});

// Initialize counters for statistics
const counterElements = document.querySelectorAll('.counter');

if (counterElements.length > 0) {
    const startCounters = () => {
        counterElements.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-target'));
            const duration = 2000; // 2 seconds
            const step = target / (duration / 16); // 60fps
            
            let current = 0;
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            updateCounter();
        });
    };
    
    // Start counters when they come into view
    const counterSection = document.querySelector('.statistics-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                startCounters();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    if (counterSection) {
        observer.observe(counterSection);
    }
}