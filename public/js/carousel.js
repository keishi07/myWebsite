document.addEventListener('DOMContentLoaded', function() {
    /**
     * Enhanced Skill Carousel with Flip Effect
     * - Works with any number of cards (handles 10+ cards well)
     * - Maintains smooth scrolling with proper card visibility
     * - Implements clean flip effect without DOM structure changes
     * - Only one card can be flipped at a time
     */

    // Allow enough time for all content to load
    setTimeout(function() {
        // Base selectors
        const carousel = document.querySelector('.corousel');
        if (!carousel) {
            console.error("Carousel not found");
            return;
        }

        // Find all original images
        const originalImages = Array.from(carousel.querySelectorAll('img'));
        if (!originalImages.length) {
            console.error("No images found in carousel");
            return;
        }

        console.log(`Found ${originalImages.length} skill cards`);

        // ==== SETUP: Base Styling ====
        // Add base styles without modifying DOM structure
        const baseStyles = document.createElement('style');
        baseStyles.textContent = `
            .corousel {
                display: flex;
                overflow-x: scroll;
                scroll-behavior: smooth;
                scroll-snap-type: x mandatory;
                gap: 5px; /* Reduced from 15px */
                padding: 20px 5px; /* Reduced horizontal padding */
                -webkit-overflow-scrolling: touch;
                scrollbar-width: none; /* Firefox */
                position: relative;
            }
            
            .corousel::-webkit-scrollbar {
                display: none; /* Chrome, Safari, Edge */
            }
            
            .corousel img {
                flex: 0 0 auto;
                width: calc(33% - 5px); /* Show ~3 cards instead of 4 */
                min-width: 260px; /* Increased from 180px */
                max-width: 380px; /* Increased from 280px */
                height: auto;
                object-fit: contain;
                scroll-snap-align: center;
                cursor: pointer;
                transition: transform 0.3s ease, opacity 0.3s ease;
                transform-origin: center center;
                display: block !important;
                visibility: visible !important;
                opacity: 1;
                border-radius: 10px;
                position: relative;
                box-shadow: 0 8px 20px rgba(129, 67, 101, 0.25);
            }
            
            .corousel img:hover {
                transform: translateY(-5px);
            }
            
            /* Flip effect */
            .corousel img.flipped {
                animation: cardFlip 0.6s forwards;
            }
            
            .corousel img.unflip {
                animation: cardUnflip 0.6s forwards;
            }
            
            @keyframes cardFlip {
                0% { transform: rotateY(0deg); }
                50% { transform: rotateY(90deg); }
                100% { transform: rotateY(0deg); }
            }
            
            @keyframes cardUnflip {
                0% { transform: rotateY(0deg); }
                50% { transform: rotateY(90deg); }
                100% { transform: rotateY(0deg); }
            }
            
            /* Responsive adjustments */
            @media (max-width: 1200px) {
                .corousel img {
                    width: calc(40% - 5px); /* Show ~2.5 cards */
                    min-width: 240px;
                }
            }
            
            @media (max-width: 992px) {
                .corousel img {
                    width: calc(45% - 4px); /* Show ~2.2 cards */
                    min-width: 220px;
                }
            }
            
            @media (max-width: 768px) {
                .corousel img {
                    width: calc(65% - 3px); /* Show ~1.5 cards */
                    min-width: 200px;
                }
            }
            
            @media (max-width: 480px) {
                .corousel img {
                    width: calc(85% - 2px); /* Show ~1.2 cards */
                    min-width: 180px;
                }
                .corousel {
                    gap: 2px;
                }
            }
            
            /* Subtle scroll hint */
            .subtle-scroll-hint {
                position: absolute;
                bottom: -15px;
                left: 50%;
                transform: translateX(-50%);
                font-size: 12px;
                color: rgba(129, 67, 101, 0.7);
                letter-spacing: 0.5px;
                font-style: italic;
                background: transparent;
                padding: 0;
                pointer-events: none;
                opacity: 0.8;
                transition: opacity 0.5s ease;
                white-space: nowrap;
                text-shadow: 0 1px 2px rgba(255,255,255,0.5);
            }
            
            .fade-out {
                opacity: 0;
            }
        `;
        document.head.appendChild(baseStyles);

        // ==== SETUP: Initial Image Preparation ====
        // Process all images and prepare data for flipping
        originalImages.forEach((img, index) => {
            // Ensure image is visible
            img.style.display = 'block';
            img.style.visibility = 'visible';
            img.style.opacity = '1';
            
            // Store original source
            const originalSrc = img.src;
            
            // Calculate detailed image source (odd/even pattern)
            let detailedSrc = originalSrc;
            try {
                const srcParts = originalSrc.split('/');
                const filename = srcParts[srcParts.length - 1];
                const filenameBase = filename.split('.')[0]; 
                const fileExt = filename.split('.')[1] || 'png';
                
                // Check if filename is numeric
                const filenameNumber = parseInt(filenameBase);
                
                if (!isNaN(filenameNumber)) {
                    // If odd, add 1 to get even number for detailed image
                    if (filenameNumber % 2 === 1) {
                        const detailedFilename = (filenameNumber + 1) + '.' + fileExt;
                        srcParts[srcParts.length - 1] = detailedFilename;
                        detailedSrc = srcParts.join('/');
                    }
                }
            } catch (error) {
                console.warn(`Error processing image path for ${img.src}:`, error);
            }
            
            // Store sources as data attributes
            img.dataset.originalSrc = originalSrc;
            img.dataset.detailedSrc = detailedSrc;
        });

        // ==== FEATURE: Scrolling ====
        // Add smooth scrolling with drag functionality
        let isDragging = false;
        let startX, scrollLeft;
        
        function handleDragStart(e) {
            isDragging = true;
            startX = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            scrollLeft = carousel.scrollLeft;
            carousel.style.cursor = 'grabbing';
            carousel.style.userSelect = 'none';
            
            // Prevent default only for mouse events
            if (e.type.includes('mouse')) {
                e.preventDefault();
            }
        }
        
        function handleDragMove(e) {
            if (!isDragging) return;
            
            const x = e.type.includes('mouse') ? e.pageX : e.touches[0].pageX;
            const distance = x - startX;
            carousel.scrollLeft = scrollLeft - distance;
            
            // Prevent default to avoid page scrolling while dragging
            e.preventDefault();
        }
        
        function handleDragEnd() {
            isDragging = false;
            carousel.style.cursor = 'grab';
            carousel.style.removeProperty('user-select');
            
            // Snap to closest card
            const cardWidth = carousel.querySelector('img').offsetWidth + 5; // 5px gap
            const remainder = carousel.scrollLeft % cardWidth;
            
            if (remainder > cardWidth / 2) {
                carousel.scrollTo({
                    left: carousel.scrollLeft + (cardWidth - remainder),
                    behavior: 'smooth'
                });
            } else {
                carousel.scrollTo({
                    left: carousel.scrollLeft - remainder,
                    behavior: 'smooth'
                });
            }
        }
        
        // Add all event listeners for dragging
        carousel.style.cursor = 'grab';
        carousel.addEventListener('mousedown', handleDragStart);
        carousel.addEventListener('touchstart', handleDragStart, {passive: true});
        carousel.addEventListener('mousemove', handleDragMove);
        carousel.addEventListener('touchmove', handleDragMove, {passive: false});
        window.addEventListener('mouseup', handleDragEnd);
        window.addEventListener('touchend', handleDragEnd);
        
        // Add subtle scroll hint
        const scrollHint = document.createElement('div');
        scrollHint.className = 'subtle-scroll-hint';
        scrollHint.textContent = '• swipe to see more •';
        
        // Add hint to carousel's parent
        const carouselContainer = carousel.parentNode;
        carouselContainer.style.position = 'relative';
        carouselContainer.appendChild(scrollHint);
        
        // Hide hint after first interaction
        function hideHint() {
            scrollHint.classList.add('fade-out');
            setTimeout(() => {
                scrollHint.remove();
            }, 500);
        }
        
        carousel.addEventListener('scroll', hideHint, {once: true});
        carousel.addEventListener('mousedown', hideHint, {once: true});
        carousel.addEventListener('touchstart', hideHint, {once: true});
        
        // Also hide after a delay
        setTimeout(hideHint, 6000);

        // ==== FEATURE: Image Flip Effect ====
        // Implement flip effect without DOM restructuring
        // Track the currently flipped card to ensure only one is flipped at a time
        let currentlyFlippedCard = null;
        
        originalImages.forEach(img => {
            img.addEventListener('click', function(e) {
                // Don't flip if we're dragging
                if (isDragging) return;
                e.stopPropagation();
                
                const originalSrc = this.dataset.originalSrc;
                const detailedSrc = this.dataset.detailedSrc;
                
                // If this is already the flipped card, unflip it
                if (currentlyFlippedCard === this) {
                    // Going back to original view
                    this.classList.remove('flipped');
                    this.classList.add('unflip');
                    
                    // Wait for animation midpoint to swap back
                    setTimeout(() => {
                        this.src = originalSrc;
                    }, 300); // Half of the animation duration
                    
                    currentlyFlippedCard = null;
                } 
                // If another card is already flipped, unflip it first then flip this one
                else if (currentlyFlippedCard !== null) {
                    // Unflip the currently flipped card
                    const prevCard = currentlyFlippedCard;
                    const prevOriginalSrc = prevCard.dataset.originalSrc;
                    
                    prevCard.classList.remove('flipped');
                    prevCard.classList.add('unflip');
                    
                    // Wait for first card to unflip before flipping the new one
                    setTimeout(() => {
                        prevCard.src = prevOriginalSrc;
                        
                        // Now flip the new card
                        this.classList.add('flipped');
                        this.classList.remove('unflip');
                        
                        // Wait for animation midpoint to swap the image
                        setTimeout(() => {
                            // Preload detailed image
                            const detailedImg = new Image();
                            detailedImg.onload = () => {
                                this.src = detailedSrc;
                            };
                            detailedImg.onerror = () => {
                                console.warn("Detailed image failed to load:", detailedSrc);
                            };
                            detailedImg.src = detailedSrc;
                        }, 300); // Half of the animation duration
                        
                        currentlyFlippedCard = this;
                    }, 300);
                }
                // If no card is currently flipped, flip this one
                else {
                    // Going to detailed view
                    this.classList.add('flipped');
                    this.classList.remove('unflip');
                    
                    // Wait for animation midpoint to swap the image
                    setTimeout(() => {
                        // Preload detailed image
                        const detailedImg = new Image();
                        detailedImg.onload = () => {
                            this.src = detailedSrc;
                        };
                        detailedImg.onerror = () => {
                            console.warn("Detailed image failed to load:", detailedSrc);
                        };
                        detailedImg.src = detailedSrc;
                    }, 300); // Half of the animation duration
                    
                    currentlyFlippedCard = this;
                }
            });
        });

        // ==== FEATURE: Card Highlighting ====
        // Highlight cards based on scroll position
        function updateCardsVisibility() {
            const carouselRect = carousel.getBoundingClientRect();
            const centerX = carouselRect.left + carouselRect.width / 2;
            
            originalImages.forEach(img => {
                const imgRect = img.getBoundingClientRect();
                const imgCenter = imgRect.left + imgRect.width / 2;
                const distance = Math.abs(imgCenter - centerX);
                const maxDistance = carouselRect.width / 2;
                const visibilityRatio = 1 - Math.min(distance / maxDistance, 1);
                
                // Apply subtle visibility effect
                img.style.opacity = 0.7 + (visibilityRatio * 0.3);
                img.style.transform = `scale(${0.95 + (visibilityRatio * 0.1)})`;
            });
        }
        
        carousel.addEventListener('scroll', updateCardsVisibility); 
        window.addEventListener('resize', updateCardsVisibility);
        updateCardsVisibility();

        console.log("Skill carousel with flip effect initialized successfully");
    }, 500);
});