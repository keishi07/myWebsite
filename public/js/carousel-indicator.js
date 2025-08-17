document.addEventListener('DOMContentLoaded', function() {
    // Try multiple times to ensure the carousel is loaded
    let attempts = 0;
    const maxAttempts = 5;
    
    function createIndicator() {
        attempts++;
        
        const carousel = document.querySelector('.corousel');
        if (!carousel) {
            if (attempts < maxAttempts) {
                // Try again after a delay
                setTimeout(createIndicator, 1000);
            }
            return;
        }
        
        console.log("Adding scroll indicator to carousel");
        
        // Create the indicator message
        const indicator = document.createElement('div');
        indicator.className = 'carousel-scroll-indicator';
        
        // Use arrows that don't rely on Font Awesome
        indicator.innerHTML = '<div class="indicator-content"><span class="arrow-left">←</span> Slide to view more <span class="arrow-right">→</span></div>';
        
        // Style the indicator
        const indicatorStyle = document.createElement('style');
        indicatorStyle.textContent = `
            .carousel-scroll-indicator {
                position: absolute;
                bottom: -40px;
                left: 50%;
                transform: translateX(-50%);
                background-color: rgba(154, 90, 120, 0.8);
                color: white;
                padding: 8px 18px;
                border-radius: 20px;
                font-size: 14px;
                font-family: 'Poppins', Arial, sans-serif;
                z-index: 10;
                opacity: 1;
                transition: opacity 0.5s ease;
                box-shadow: 0 3px 8px rgba(129, 67, 101, 0.3);
                pointer-events: none;
                white-space: nowrap;
                animation: fadeInOut 4s forwards;
            }
            
            .indicator-content {
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 10px;
            }
            
            .arrow-left, .arrow-right {
                animation: slideArrows 1.5s infinite ease-in-out;
                font-size: 18px;
                font-weight: bold;
            }
            
            .arrow-left {
                animation-delay: 0s;
            }
            
            .arrow-right {
                animation-delay: 0.75s;
            }
            
            @keyframes slideArrows {
                0% { transform: translateX(0); opacity: 0.5; }
                50% { transform: translateX(3px); opacity: 1; }
                100% { transform: translateX(0); opacity: 0.5; }
            }
            
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translate(-50%, 10px); }
                10% { opacity: 1; transform: translate(-50%, 0); }
                80% { opacity: 1; transform: translate(-50%, 0); }
                100% { opacity: 0; transform: translate(-50%, -10px); }
            }
            
            @media (max-width: 576px) {
                .carousel-scroll-indicator {
                    font-size: 12px;
                    padding: 6px 14px;
                    bottom: -35px;
                }
            }
        `;
        
        // Add the styles to the head
        document.head.appendChild(indicatorStyle);
        
        // Ensure parent has positioning context
        const parent = carousel.parentNode;
        if (parent) {
            const currentPosition = window.getComputedStyle(parent).position;
            if (currentPosition === 'static') {
                parent.style.position = 'relative';
            }
            parent.appendChild(indicator);
            
            // Log success
            console.log("Indicator added successfully");
        } else {
            // If no parent, add to body and position relative to carousel
            document.body.appendChild(indicator);
            const carouselRect = carousel.getBoundingClientRect();
            indicator.style.position = 'absolute';
            indicator.style.top = (carouselRect.bottom + window.scrollY + 10) + 'px';
            indicator.style.left = (carouselRect.left + carouselRect.width/2 + window.scrollX) + 'px';
            
            console.log("Indicator added to body (fallback)");
        }
        
        // Remove the indicator after animation completes
        setTimeout(function() {
            if (indicator && indicator.parentNode) {
                indicator.parentNode.removeChild(indicator);
                console.log("Indicator removed after timeout");
            }
        }, 4100); // Slightly longer than the animation
        
        // Also remove on first interaction
        const removeOnInteraction = function() {
            if (indicator && indicator.parentNode) {
                indicator.style.opacity = '0';
                setTimeout(() => {
                    if (indicator.parentNode) {
                        indicator.parentNode.removeChild(indicator);
                        console.log("Indicator removed after interaction");
                    }
                }, 500);
            }
            
            carousel.removeEventListener('mousedown', removeOnInteraction);
            carousel.removeEventListener('touchstart', removeOnInteraction);
            carousel.removeEventListener('scroll', removeOnInteraction);
        };
        
        carousel.addEventListener('mousedown', removeOnInteraction);
        carousel.addEventListener('touchstart', removeOnInteraction);
        carousel.addEventListener('scroll', removeOnInteraction);
    }
    
    // Start the first attempt after a reasonable delay
    setTimeout(createIndicator, 2000);
});