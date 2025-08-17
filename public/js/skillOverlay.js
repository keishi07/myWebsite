document.addEventListener('DOMContentLoaded', function() {
    // Wait for everything to load properly
    setTimeout(function() {
        // Get the carousel and all skill cards
        const carousel = document.querySelector('.corousel');
        const skillCards = Array.from(carousel.querySelectorAll('img'));
        
        // If no carousel or no cards, exit
        if (!carousel || skillCards.length === 0) {
            console.error("Carousel or skill cards not found");
            return;
        }
        
        console.log("Found carousel with", skillCards.length, "cards");
        
        // Add necessary styles for flip effect
        const style = document.createElement('style');
        style.textContent = `
            /* Remove background container effect from the cards */
            .skill-card-container {
                perspective: 1000px;
                position: relative;
                cursor: pointer;
                flex-shrink: 0;
                transition: transform 0.3s ease;
                width: 380px !important;
                height: 532px !important;
                background: transparent !important;
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
                margin: 0 5px !important;
            }
            
            /* Remove any background styling from parent containers */
            .corousel > div {
                background: transparent !important;
                box-shadow: none !important;
                padding: 0 !important;
            }
            
            .skill-card-inner {
                position: relative;
                width: 100%;
                height: 100%;
                text-align: center;
                transition: transform 0.6s;
                transform-style: preserve-3d;
                background: transparent !important;
            }
            
            .skill-card-container.flipped .skill-card-inner {
                transform: rotateY(180deg);
            }
            
            .skill-card-front, .skill-card-back {
                position: absolute;
                width: 100%;
                height: 100%;
                -webkit-backface-visibility: hidden;
                backface-visibility: hidden;
                display: flex;
                justify-content: center;
                align-items: center;
                background: transparent !important;
            }
            
            .skill-card-front {
                transform: rotateY(0deg);
                background: transparent !important;
            }
            
            .skill-card-back {
                transform: rotateY(180deg);
                background: transparent !important;
                padding: 0;
            }
            
            /* Make images display at full size without container effect */
            .skill-card-front img,
            .skill-card-back img,
            .corousel img {
                width: 100% !important;
                height: auto !important;
                max-height: 100% !important;
                object-fit: contain !important;
                box-shadow: 0 8px 20px rgba(129, 67, 101, 0.3) !important;
                border-radius: 15px !important;
                background: transparent !important;
                margin: 0 auto !important;
                display: block !important;
                padding: 0 !important;
            }
            
            /* Override any parent container styling */
            .corousel > div,
            .carousel-container > div {
                background: transparent !important;
                box-shadow: none !important;
                border: none !important;
            }
            
            /* Override carousel styling for flipped cards */
            .skill-card-container.flipped {
                z-index: 10;
            }
        `;
        document.head.appendChild(style);
        
        // Additional style to remove any container backgrounds
        const extraStyle = document.createElement('style');
        extraStyle.textContent = `
            /* Target and remove all background containers in the carousel */
            .corousel > div,
            .corousel > div > div,
            .corousel .skill-card-container,
            .corousel .skill-card-inner,
            .corousel .skill-card-front,
            .corousel .skill-card-back {
                background: transparent !important;
                box-shadow: none !important;
                border: none !important;
                padding: 0 !important;
            }
            
        `;
        document.head.appendChild(extraStyle);
        
        // Process each skill card
        skillCards.forEach((card, index) => {
            // Skip processing if already wrapped
            if (card.parentNode.classList.contains('skill-card-front')) return;
            
            // Get the current image source
            const src = card.getAttribute('src');
            
            // Create detailed image path
            let detailedSrc = src;
            const srcParts = src.split('/');
            const filename = srcParts[srcParts.length - 1];
            const filenameNumber = parseInt(filename.split('.')[0]);
            
            if (!isNaN(filenameNumber) && filenameNumber % 2 === 1) {
                const detailedFilename = (filenameNumber + 1) + '.png';
                srcParts[srcParts.length - 1] = detailedFilename;
                detailedSrc = srcParts.join('/');
            }
            
            // Create the card container and inner elements
            const cardContainer = document.createElement('div');
            cardContainer.className = 'skill-card-container';
            cardContainer.style.background = 'transparent';
            
            const cardInner = document.createElement('div');
            cardInner.className = 'skill-card-inner';
            cardInner.style.background = 'transparent';
            
            const cardFront = document.createElement('div');
            cardFront.className = 'skill-card-front';
            cardFront.style.background = 'transparent';
            
            const cardBack = document.createElement('div');
            cardBack.className = 'skill-card-back';
            cardBack.style.background = 'transparent';
            
            // Set up front side (original card)
            card.parentNode.insertBefore(cardContainer, card);
            cardFront.appendChild(card);
            
            // Ensure card has proper styling
            card.style.width = '100%';
            card.style.height = 'auto';
            card.style.maxHeight = '100%';
            card.style.objectFit = 'contain';
            card.style.background = 'transparent';
            
            // Set up back side (just the detailed image)
            cardBack.innerHTML = `
                <img src="${detailedSrc}" alt="Detailed Skill" onerror="this.src='${src}'" style="width:100%; height:auto; max-height:100%; object-fit:contain; background:transparent;">
            `;
            
            // Assemble the card structure
            cardInner.appendChild(cardFront);
            cardInner.appendChild(cardBack);
            cardContainer.appendChild(cardInner);
            
            // Add click event to flip the card
            cardContainer.addEventListener('click', function(e) {
                e.stopPropagation();
                
                this.classList.toggle('flipped');
                
                if (this.classList.contains('flipped')) {
                    carousel.style.overflow = 'visible';
                    
                    const overlay = document.createElement('div');
                    overlay.className = 'flip-overlay';
                    overlay.style.cssText = `
                        position: fixed;
                        top: 0;
                        left: 0;
                        width: 100%;
                        height: 100%;
                        z-index: 5;
                        background: transparent;
                    `;
                    document.body.appendChild(overlay);
                    
                    overlay.addEventListener('click', (e) => {
                        this.classList.remove('flipped');
                        document.body.removeChild(overlay);
                        carousel.style.overflow = '';
                    });
                }
            });
        });
        
        // Find and remove any background container divs
        const allDivs = carousel.querySelectorAll('div');
        allDivs.forEach(div => {
            if (div.className !== 'skill-card-container' && 
                div.className !== 'skill-card-inner' && 
                div.className !== 'skill-card-front' && 
                div.className !== 'skill-card-back') {
                
                div.style.background = 'transparent';
                div.style.boxShadow = 'none';
                div.style.border = 'none';
                div.style.padding = '0';
            }
        });
        
        console.log("Skill flip cards initialized successfully with container effect removed");
        
    }, 1500); // Wait for carousel.js to initialize
});