/**
 * DeshyEdge Consulting - Contact Page JavaScript
 * This file contains all interactive functionality for the contact page
 * including form toggling, validation, and dynamic content.
 */

// Wrap everything in an IIFE to avoid global scope pollution
(function () {
    'use strict';

    /**
     * Cache DOM elements for better performance
     * @type {Object}
     */
    const DOM = {
        generalTab: document.getElementById('general-inquiry-tab'),
        consultationTab: document.getElementById('consultation-tab'),
        generalForm: document.getElementById('contact-form'),
        consultationForm: document.getElementById('consultation-form'),
        serviceArea: document.getElementById('service-area'),
        consultationService: document.getElementById('consultation-service'),
        consultantPreview: document.getElementById('consultant-preview'),
        faqToggles: document.querySelectorAll('.faq-toggle')
    };

    /**
     * Initialize tab switching between general inquiry and consultation booking
     */
    function initFormTabs() {
        if (!DOM.generalTab || !DOM.consultationTab || !DOM.generalForm || !DOM.consultationForm) return;

        // Switch to general inquiry tab
        DOM.generalTab.addEventListener('click', () => {
            // Update tab styles
            DOM.generalTab.classList.remove('bg-gray-100', 'text-gray-700');
            DOM.generalTab.classList.add('bg-primary', 'text-white');
            DOM.consultationTab.classList.remove('bg-primary', 'text-white');
            DOM.consultationTab.classList.add('bg-gray-100', 'text-gray-700');

            // Show/hide forms
            DOM.generalForm.classList.remove('hidden');
            DOM.consultationForm.classList.add('hidden');
        });

        // Switch to consultation booking tab
        DOM.consultationTab.addEventListener('click', () => {
            // Update tab styles
            DOM.consultationTab.classList.remove('bg-gray-100', 'text-gray-700');
            DOM.consultationTab.classList.add('bg-primary', 'text-white');
            DOM.generalTab.classList.remove('bg-primary', 'text-white');
            DOM.generalTab.classList.add('bg-gray-100', 'text-gray-700');

            // Show/hide forms
            DOM.consultationForm.classList.remove('hidden');
            DOM.generalForm.classList.add('hidden');
        });
    }

    /**
     * Initialize consultant preview based on service selection
     */
    function initConsultantPreview() {
        if (!DOM.serviceArea || !DOM.consultationService || !DOM.consultantPreview) return;

        // Define consultant data (in a real app, this would come from a database)
        const consultants = {
            'digital-transformation': {
                name: 'Alex Morgan',
                title: 'Lead Consultant, Digital Transformation',
                image: '/Assets/images/consultants/alex-morgan.jpg',
                rating: 5
            },
            'healthcare': {
                name: 'Sarah Chen',
                title: 'Healthcare Solutions Director',
                image: '/Assets/images/consultants/sarah-chen.jpg',
                rating: 5
            },
            'financial': {
                name: 'Michael Rodriguez',
                title: 'Financial Advisory Lead',
                image: '/Assets/images/consultants/michael-rodriguez.jpg',
                rating: 5
            },
            'manufacturing': {
                name: 'Priya Patel',
                title: 'Manufacturing Excellence Consultant',
                image: '/Assets/images/consultants/priya-patel.jpg',
                rating: 5
            },
            'other': {
                name: 'Jordan Taylor',
                title: 'Senior Business Consultant',
                image: '/Assets/images/consultants/jordan-taylor.jpg',
                rating: 5
            }
        };

        // Function to update consultant preview
        const updateConsultantPreview = (serviceValue) => {
            if (serviceValue && consultants[serviceValue]) {
                const consultant = consultants[serviceValue];

                // Update consultant information
                const consultantImage = DOM.consultantPreview.querySelector('img');
                const consultantName = DOM.consultantPreview.querySelector('h4');
                const consultantTitle = DOM.consultantPreview.querySelector('p');

                if (consultantImage) consultantImage.src = consultant.image;
                if (consultantImage) consultantImage.alt = consultant.name;
                if (consultantName) consultantName.textContent = consultant.name;
                if (consultantTitle) consultantTitle.textContent = consultant.title;

                // Show the preview
                DOM.consultantPreview.classList.remove('hidden');
            } else {
                // Hide the preview if no service is selected
                DOM.consultantPreview.classList.add('hidden');
            }
        };

        // Listen for changes on both service selectors
        DOM.serviceArea.addEventListener('change', () => {
            updateConsultantPreview(DOM.serviceArea.value);
        });

        DOM.consultationService.addEventListener('change', () => {
            updateConsultantPreview(DOM.consultationService.value);
        });
    }

    /**
     * Initialize FAQ accordion functionality
     */
    function initFaqAccordion() {
        if (!DOM.faqToggles || DOM.faqToggles.length === 0) return;

        DOM.faqToggles.forEach(toggle => {
            toggle.addEventListener('click', () => {
                // Get the content element (next sibling after the button)
                const content = toggle.nextElementSibling;

                // Get the icon element
                const icon = toggle.querySelector('svg');

                // Toggle expanded state
                const isExpanded = toggle.getAttribute('aria-expanded') === 'true';
                toggle.setAttribute('aria-expanded', !isExpanded);

                // Toggle content visibility
                if (isExpanded) {
                    content.classList.add('hidden');
                    icon.classList.remove('rotate-180');
                } else {
                    content.classList.remove('hidden');
                    icon.classList.add('rotate-180');
                }
            });
        });
    }

    /**
     * Initialize form validation
     */
    function initFormValidation() {
        const validateForm = (form) => {
            const inputs = form.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"], textarea, select');
            let isValid = true;

            inputs.forEach(input => {
                // Skip validation for optional fields
                if (input.hasAttribute('data-optional')) return;

                // Check if the input has a value
                if (!input.value.trim()) {
                    isValid = false;

                    // Add error styling
                    input.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');

                    // Add error message if it doesn't exist
                    let errorMessage = input.nextElementSibling;
                    if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                        errorMessage = document.createElement('p');
                        errorMessage.className = 'text-red-500 text-sm mt-1 error-message';
                        errorMessage.textContent = 'This field is required';
                        input.parentNode.insertBefore(errorMessage, input.nextSibling);
                    }
                } else {
                    // Remove error styling
                    input.classList.remove('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');

                    // Remove error message if it exists
                    const errorMessage = input.nextElementSibling;
                    if (errorMessage && errorMessage.classList.contains('error-message')) {
                        errorMessage.remove();
                    }

                    // Additional validation for email fields
                    if (input.type === 'email') {
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                        if (!emailRegex.test(input.value.trim())) {
                            isValid = false;

                            // Add error styling
                            input.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');

                            // Add error message
                            const emailError = document.createElement('p');
                            emailError.className = 'text-red-500 text-sm mt-1 error-message';
                            emailError.textContent = 'Please enter a valid email address';
                            input.parentNode.insertBefore(emailError, input.nextSibling);
                        }
                    }

                    // Additional validation for phone fields
                    if (input.type === 'tel') {
                        const phoneRegex = /^[\d\+\-\(\) ]{7,20}$/;
                        if (!phoneRegex.test(input.value.trim())) {
                            isValid = false;

                            // Add error styling
                            input.classList.add('border-red-500', 'focus:ring-red-500', 'focus:border-red-500');

                            // Add error message
                            const phoneError = document.createElement('p');
                            phoneError.className = 'text-red-500 text-sm mt-1 error-message';
                            phoneError.textContent = 'Please enter a valid phone number';
                            input.parentNode.insertBefore(phoneError, input.nextSibling);
                        }
                    }
                }
            });

            return isValid;
        };

        // Validate general inquiry form on submit
        if (DOM.generalForm) {
            DOM.generalForm.addEventListener('submit', (e) => {
                e.preventDefault();

                if (validateForm(DOM.generalForm)) {
                    // Show success message
                    showFormMessage(DOM.generalForm, 'Thank you for your message! We will get back to you soon.', 'success');

                    // In a real application, you would send the form data to a server here
                    console.log('Form submitted with values:', new FormData(DOM.generalForm));

                    // Reset form after successful submission
                    setTimeout(() => {
                        DOM.generalForm.reset();
                    }, 2000);
                }
            });
        }

        // Validate consultation booking form on submit
        if (DOM.consultationForm) {
            DOM.consultationForm.addEventListener('submit', (e) => {
                e.preventDefault();

                if (validateForm(DOM.consultationForm)) {
                    // Show success message
                    showFormMessage(DOM.consultationForm, 'Your consultation request has been received! We will confirm your appointment shortly.', 'success');

                    // In a real application, you would send the form data to a server here
                    console.log('Consultation form submitted with values:', new FormData(DOM.consultationForm));

                    // Reset form after successful submission
                    setTimeout(() => {
                        DOM.consultationForm.reset();
                    }, 2000);
                }
            });
        }
    }

    /**
     * Show form message (success or error)
     * @param {HTMLElement} form - The form element
     * @param {string} message - The message to display
     * @param {string} type - The message type ('success' or 'error')
     */
    function showFormMessage(form, message, type) {
        // Remove any existing messages
        const existingMessage = form.querySelector('.form-message');
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create message element
        const messageElement = document.createElement('div');
        messageElement.className = `form-message mt-4 p-4 rounded-lg ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`;

        // Add icon based on message type
        const iconSvg = type === 'success'
            ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" /></svg>'
            : '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline-block mr-2" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>';

        messageElement.innerHTML = iconSvg + message;

        // Add message to form
        form.appendChild(messageElement);

        // Scroll to message
        messageElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Remove success message after 5 seconds
        if (type === 'success') {
            setTimeout(() => {
                messageElement.classList.add('opacity-0', 'transition-opacity', 'duration-500');
                setTimeout(() => {
                    messageElement.remove();
                }, 500);
            }, 5000);
        }
    }

    /**
     * Initialize date picker with min date set to today
     */
    function initDatePicker() {
        const dateInput = document.getElementById('consultation-date');
        if (!dateInput) return;

        // Set minimum date to today
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        dateInput.min = `${year}-${month}-${day}`;

        // Set default value to tomorrow
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowYear = tomorrow.getFullYear();
        const tomorrowMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
        const tomorrowDay = String(tomorrow.getDate()).padStart(2, '0');

        dateInput.value = `${tomorrowYear}-${tomorrowMonth}-${tomorrowDay}`;
    }

    /**
     * Initialize all functionality when DOM is fully loaded
     */
    function init() {
        initFormTabs();
        initConsultantPreview();
        initFaqAccordion();
        initFormValidation();
        initDatePicker();
    }

    // Run initialization when DOM is fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();