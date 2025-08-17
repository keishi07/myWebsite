// contact-form.js - with added window.closeModal function
document.addEventListener('DOMContentLoaded', function() {
    const contactFormContainer = document.querySelector('.contact-form');
    const sendButton = document.getElementById('send-btn');
    const modal = document.getElementById('contact-modal');
    const modalClose = document.querySelector('.modal-close');
    const modalSuccess = document.getElementById('modal-success');
    const modalError = document.getElementById('modal-error');
    
    // Form validation function
    function validateForm() {
        const name = contactFormContainer.querySelector('input[placeholder="Name"]').value.trim();
        const email = contactFormContainer.querySelector('input[placeholder="Email"]').value.trim();
        const message = contactFormContainer.querySelector('textarea').value.trim();
        
        // Basic validation
        if (name === '' || email === '' || message === '') {
            return false;
        }
        
        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return false;
        }
        
        return true;
    }
    
    // Function to show the modal with appropriate message
    function showModal(success) {
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
        
        if (success) {
            modalSuccess.classList.add('active');
            modalError.classList.remove('active');
        } else {
            modalError.classList.add('active');
            modalSuccess.classList.remove('active');
        }
        
        // Focus trap for accessibility
        setTimeout(() => {
            modalClose.focus();
        }, 100);
    }
    
    // Function to close the modal
    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = ''; // Re-enable scrolling
        modalSuccess.classList.remove('active');
        modalError.classList.remove('active');
    }
    
    // Add this line to make closeModal accessible to the buttons
    window.closeModal = closeModal;
    
    // Handle form submission when Send button is clicked
    sendButton.addEventListener('click', function() {
        // Check if form is valid
        if (!validateForm()) {
            showModal(false); // Show error modal
            return;
        }
        
        // Collect form data
        const formData = {
            name: contactFormContainer.querySelector('input[placeholder="Name"]').value.trim(),
            contact: contactFormContainer.querySelector('input[placeholder="Contact No."]').value.trim(),
            email: contactFormContainer.querySelector('input[placeholder="Email"]').value.trim(),
            message: contactFormContainer.querySelector('textarea').value.trim()
        };
        
        // Simulate form submission with a delay
        // In a real scenario, you would use fetch() or XMLHttpRequest to send data to a server
        setTimeout(() => {
            // For demonstration purposes, we'll simulate a successful submission
            // In a real application, you would check the response from the server
            const success = true; // Change this to false to test error modal
            
            if (success) {
                // Reset form if successful
                contactFormContainer.querySelector('input[placeholder="Name"]').value = '';
                contactFormContainer.querySelector('input[placeholder="Contact No."]').value = '';
                contactFormContainer.querySelector('input[placeholder="Email"]').value = '';
                contactFormContainer.querySelector('textarea').value = '';
            }
            
            showModal(success);
        }, 1000);
    });
    
    // Close modal when clicking the close button
    modalClose.addEventListener('click', closeModal);
    
    // Close modal when clicking outside of it
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });
});

