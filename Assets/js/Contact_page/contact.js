/**
 * DeshyEdge Consulting - Contact Page JavaScript
 */

document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ accordions
    const faqToggles = document.querySelectorAll('.faq-toggle');
    
    faqToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            // Toggle aria-expanded attribute
            this.setAttribute('aria-expanded', !isExpanded);
            
            // Toggle content visibility
            if (isExpanded) {
                content.classList.remove('open');
                setTimeout(() => {
                    content.classList.add('hidden');
                }, 300);
            } else {
                content.classList.remove('hidden');
                setTimeout(() => {
                    content.classList.add('open');
                }, 10); // Small delay to ensure transition works
            }
            
            // Rotate the arrow icon
            const icon = this.querySelector('svg');
            if (isExpanded) {
                icon.classList.remove('rotate-180');
            } else {
                icon.classList.add('rotate-180');
            }
        });
    });
    
    // Initialize form validation and submission
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Basic form validation
            const formData = new FormData(contactForm);
            const formValues = Object.fromEntries(formData.entries());
            
            // Check if required fields are empty
            const requiredFields = ['name', 'email', 'subject', 'message', 'consent'];
            const emptyRequiredFields = requiredFields.filter(field => 
                !formValues[field] || formValues[field].trim() === ''
            );
            
            if (emptyRequiredFields.length > 0) {
                showFormMessage('Please fill in all required fields', 'error');
                return;
            }
            
            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formValues.email)) {
                showFormMessage('Please enter a valid email address', 'error');
                return;
            }
            
            // Simulate form submission (replace with actual API call)
            showFormMessage('Sending your message...', 'info');
            
            // Simulate API delay
            setTimeout(() => {
                // Success message
                showFormMessage('Thank you for your message! We will get back to you soon.', 'success');
                contactForm.reset();
            }, 1500);
        });
    }
    
    // Show form message
    function showFormMessage(message, type) {
        const messageElement = document.getElementById('form-message');
        
        if (!messageElement) return;
        
        // Set message content and styling
        messageElement.textContent = message;
        messageElement.className = 'mt-4 p-3 rounded';
        
        // Add appropriate styling based on message type
        if (type === 'success') {
            messageElement.classList.add('bg-green-100', 'text-green-800');
        } else if (type === 'error') {
            messageElement.classList.add('bg-red-100', 'text-red-800');
        } else if (type === 'info') {
            messageElement.classList.add('bg-blue-100', 'text-blue-800');
        }
        
        // Show the message
        messageElement.classList.remove('hidden');
        
        // Auto-hide success messages after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageElement.classList.add('hidden');
            }, 5000);
        }
    }
    
    // Add animation to form inputs when focused
    const formInputs = document.querySelectorAll('input, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
});