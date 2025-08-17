document.addEventListener('DOMContentLoaded', () => {
    const projectContainer = document.getElementById('projectContainer') || document.querySelector('.project-main');
    const projectLinks = document.querySelectorAll('.project-link');
    let selectedCard = null;
    let cardStack = null;
    
    // Function to handle card click
    function handleCardClick(e, card) {
        e.preventDefault();
        
        // If we're already in card view and clicked the same card, go back to default view
        if (selectedCard === card) {
            resetView();
            return;
        }
        
        // Reset to default first
        resetView();
        
        // Set selected card
        selectedCard = card;
        
        // Add class to container to indicate a card is selected
        projectContainer.classList.add('card-selected');
        
        // Mark the clicked card as selected
        card.classList.add('selected');
        
        // The overlay with info image will now be visible because of the CSS rule
        // for .project-link.selected .project-overlay
        
        // Create a div to hold the cards that aren't selected
        cardStack = document.createElement('div');
        cardStack.className = 'card-stack';
        
        // Move all cards that aren't selected into the stack
        projectLinks.forEach(link => {
            if (link !== card) {
                link.classList.add('not-selected');
                // Remove from DOM temporarily
                projectContainer.removeChild(link);
                // Add to the stack
                cardStack.appendChild(link);
            }
        });
        
        // Add the stack back to the container
        projectContainer.appendChild(cardStack);
    }
    
    // Function to reset to default view
    function resetView() {
        if (selectedCard) {
            // Remove selected class
            selectedCard.classList.remove('selected');
            selectedCard = null;
            
            // Remove card-selected class from container
            projectContainer.classList.remove('card-selected');
            
            if (cardStack) {
                // Move cards back to container
                const cardsToMove = Array.from(cardStack.children);
                cardsToMove.forEach(card => {
                    card.classList.remove('not-selected');
                    // Remove from stack
                    cardStack.removeChild(card);
                    // Add back to container
                    projectContainer.appendChild(card);
                });
                
                // Remove the stack
                projectContainer.removeChild(cardStack);
                cardStack = null;
            }
        }
    }
    
    // Add click event listeners to each card
    projectLinks.forEach(card => {
        card.addEventListener('click', (e) => {
            handleCardClick(e, card);
        });
    });
    
    // Add click event listener to the body to reset when clicking outside
    document.body.addEventListener('click', (e) => {
        if (!projectContainer.contains(e.target)) {
            resetView();
        }
    });
});