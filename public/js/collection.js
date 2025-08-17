document.addEventListener("DOMContentLoaded", function() {
    const cardsRow = document.querySelector('.cards-row');
    const cards = Array.from(cardsRow.children);
    const prevBtn = document.querySelector('.arrow[aria-label="Previous"]');
    const nextBtn = document.querySelector('.arrow[aria-label="Next"]');
    const pageIndicator = document.querySelector('.collection-page');

    let currentStart = 0;

    // Responsive visible card count based on window width
    function getVisibleCount() {
        if (window.innerWidth <= 600) return 1;
        if (window.innerWidth <= 900) return 2;
        return 3;
    }

    function updateSlider() {
        const visibleCount = getVisibleCount();
        let showCards = [];
        for (let i = 0; i < visibleCount; i++) {
            let idx = (currentStart + i) % cards.length;
            showCards.push(cards[idx]);
        }

        // Remove all cards from cardsRow
        while (cardsRow.firstChild) {
            cardsRow.removeChild(cardsRow.firstChild);
        }

        // Add the visible cards in correct order and assign classes
        showCards.forEach((card, i) => {
            card.classList.remove('card-large', 'card-medium');
            if (visibleCount === 1) {
                card.classList.add('card-large');
            } else if (i === 0) {
                card.classList.add('card-large');
            } else {
                card.classList.add('card-medium');
            }
            card.style.display = '';
            cardsRow.appendChild(card);
        });

        // Update page indicator (always shows first card index, for simplicity)
        pageIndicator.textContent = ((currentStart % cards.length) + 1).toString().padStart(2, '0');

        // Always enable arrows for cycling
        prevBtn.disabled = false;
        nextBtn.disabled = false;
        prevBtn.style.opacity = "1";
        nextBtn.style.opacity = "1";
        prevBtn.style.cursor = "pointer";
        nextBtn.style.cursor = "pointer";
    }

    prevBtn.addEventListener('click', function() {
        currentStart = (currentStart - 1 + cards.length) % cards.length;
        updateSlider();
    });

    nextBtn.addEventListener('click', function() {
        currentStart = (currentStart + 1) % cards.length;
        updateSlider();
    });

    window.addEventListener('resize', updateSlider);

    updateSlider();
});