document.addEventListener('DOMContentLoaded', function () {
  let currentAbsolutePage = 0;
  let isMobile = window.innerWidth <= 700;

  function getBookElements() {
    const book = document.getElementById('book');
    const spreads = book ? Array.from(book.querySelectorAll('.own-size')) : [];
    const frontCover = book ? book.querySelector('.front-cover') : null;
    const backCover = book ? book.querySelector('.back-cover') : null;
    return { book, spreads, frontCover, backCover };
  }

  function getTotalAbsolutePages() {
    const { spreads } = getBookElements();
    // covers + (number of spreads * 2)
    return 2 + spreads.length * 2;
  }

  function showPage(pageNum) {
    const { spreads, frontCover, backCover } = getBookElements();
    const totalPages = getTotalAbsolutePages();
    // Hide everything
    if (frontCover) frontCover.style.display = 'none';
    if (backCover) backCover.style.display = 'none';
    spreads.forEach(spread => {
      spread.style.display = isMobile ? 'block' : 'flex';
      Array.from(spread.children).forEach(child => {
        child.style.display = isMobile ? 'none' : 'flex';
        child.classList.remove('active-page');
      });
    });

    // Show correct page
    if (pageNum === 0 && frontCover) {
      frontCover.style.display = 'block';
    } else if (pageNum === totalPages - 1 && backCover) {
      backCover.style.display = 'block';
    } else {
      // Which spread and which page in spread?
      const logicalPage = pageNum - 1;
      const spreadIndex = Math.floor(logicalPage / 2);
      const isLeft = logicalPage % 2 === 0;
      const spread = spreads[spreadIndex];
      if (spread) {
        if (isMobile) {
          Array.from(spread.children).forEach((child, idx) => {
            child.style.display = 'none';
            child.classList.remove('active-page');
            if ((isLeft && idx === 0) || (!isLeft && idx === 1)) {
              child.style.display = 'flex';
              child.classList.add('active-page');
            }
          });
        } else {
          Array.from(spread.children).forEach(child => {
            child.style.display = 'flex';
          });
        }
      }
    }
    updateNavigationControls(pageNum);
  }

  function updateNavigationControls(pageNum) {
    const totalPages = getTotalAbsolutePages();
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    if (prevBtn) prevBtn.style.display = pageNum > 0 ? 'flex' : 'none';
    if (nextBtn) nextBtn.style.display = pageNum < totalPages - 1 ? 'flex' : 'none';
    document.querySelectorAll('.dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === pageNum);
    });
  }

  function createNavigationControls() {
    ['prevBtn', 'nextBtn'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.remove();
    });
    const existingDots = document.querySelector('.page-dots');
    if (existingDots) existingDots.remove();

    const prevBtn = document.createElement('button');
    prevBtn.id = 'prevBtn';
    prevBtn.innerHTML = '&#8249;';
    prevBtn.classList.add('book-nav-btn');
    prevBtn.setAttribute('aria-label', 'Previous page');
    const nextBtn = document.createElement('button');
    nextBtn.id = 'nextBtn';
    nextBtn.innerHTML = '&#8250;';
    nextBtn.classList.add('book-nav-btn');
    nextBtn.setAttribute('aria-label', 'Next page');
    prevBtn.addEventListener('click', function () {
      if (currentAbsolutePage > 0) {
        currentAbsolutePage--;
        showPage(currentAbsolutePage);
      }
    });
    nextBtn.addEventListener('click', function () {
      if (currentAbsolutePage < getTotalAbsolutePages() - 1) {
        currentAbsolutePage++;
        showPage(currentAbsolutePage);
      }
    });
    document.body.appendChild(prevBtn);
    document.body.appendChild(nextBtn);

    // Dots
    const pageDots = document.createElement('div');
    pageDots.className = 'page-dots';
    const totalPages = getTotalAbsolutePages();
    for (let i = 0; i < totalPages; i++) {
      const dot = document.createElement('div');
      dot.className = 'dot';
      dot.dataset.page = i;
      dot.addEventListener('click', () => {
        currentAbsolutePage = i;
        showPage(currentAbsolutePage);
      });
      pageDots.appendChild(dot);
    }
    document.body.appendChild(pageDots);
  }

  function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 700;
    showPage(currentAbsolutePage);
  }

  // Keyboard
  document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowLeft' && currentAbsolutePage > 0) {
      currentAbsolutePage--;
      showPage(currentAbsolutePage);
    }
    if (e.key === 'ArrowRight' && currentAbsolutePage < getTotalAbsolutePages() - 1) {
      currentAbsolutePage++;
      showPage(currentAbsolutePage);
    }
  });

  // Swipe navigation
  let startX;
  document.addEventListener('touchstart', function (e) {
    startX = e.touches[0].clientX;
  }, { passive: true });
  document.addEventListener('touchend', function (e) {
    if (startX == null) return;
    const endX = e.changedTouches[0].clientX;
    if (Math.abs(startX - endX) > 50) {
      if (startX > endX && currentAbsolutePage < getTotalAbsolutePages() - 1) {
        currentAbsolutePage++;
        showPage(currentAbsolutePage);
      } else if (startX < endX && currentAbsolutePage > 0) {
        currentAbsolutePage--;
        showPage(currentAbsolutePage);
      }
    }
    startX = null;
  }, { passive: true });

  // Init after images load
  setTimeout(function () {
    createNavigationControls();
    showPage(currentAbsolutePage);
  }, 500);

  window.addEventListener('resize', handleResize);
});