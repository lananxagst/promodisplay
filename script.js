// Carousel functionality
let currentSlide = 0;
let slides = [];
let indicators = [];
let promotionsData = null;

function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => slide.classList.remove('active'));
    indicators.forEach(indicator => indicator.classList.remove('active'));
    
    // Show current slide
    slides[index].classList.add('active');
    indicators[index].classList.add('active');
}

function changeSlide(direction) {
    currentSlide += direction;
    
    if (slides.length === 0) return;
    
    if (currentSlide >= slides.length) {
        currentSlide = 0;
    } else if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    }
    
    showSlide(currentSlide);
}

function goToSlide(index) {
    currentSlide = index;
    showSlide(currentSlide);
}

// Auto-advance carousel
setInterval(() => {
    changeSlide(1);
}, 4000);

// Load promotions data from localStorage
function loadPromotionsData() {
    const storedData = localStorage.getItem('promoDisplayData');
    if (storedData) {
        try {
            promotionsData = JSON.parse(storedData);
            return true;
        } catch (e) {
            console.error('Error loading promotions data:', e);
            return false;
        }
    }
    return false;
}

// Create carousel slides from uploaded images
function createCarouselFromData() {
    const carousel = document.querySelector('.carousel');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    
    // Clear existing content
    carousel.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    
    if (!promotionsData || !promotionsData.uploadedImages || promotionsData.uploadedImages.length === 0) {
        // Show default placeholder slides if no images uploaded
        const defaultImages = [
            { src: 'https://picsum.photos/seed/promo1/800/400.jpg', title: 'Promotion 1', description: 'Amazing deals waiting for you' },
            { src: 'https://picsum.photos/seed/promo2/800/400.jpg', title: 'Promotion 2', description: 'Limited time offers available' },
            { src: 'https://picsum.photos/seed/promo3/800/400.jpg', title: 'Promotion 3', description: 'Exclusive promotions just for you' }
        ];
        
        defaultImages.forEach((image, index) => {
            createSlide(image.src, image.title, image.description, index);
        });
    } else {
        // Create slides from uploaded images
        promotionsData.uploadedImages.forEach((image, index) => {
            createSlide(image.src, `Promotion ${index + 1}`, image.name, index);
        });
    }
    
    // Update slides and indicators arrays
    slides = document.querySelectorAll('.carousel-slide');
    indicators = document.querySelectorAll('.indicator');
    
    // Show first slide
    if (slides.length > 0) {
        showSlide(0);
    }
}

// Create individual slide
function createSlide(imageSrc, title, description, index) {
    const carousel = document.querySelector('.carousel');
    const indicatorsContainer = document.querySelector('.carousel-indicators');
    
    // Create slide
    const slide = document.createElement('div');
    slide.className = 'carousel-slide';
    slide.innerHTML = `
        <img src="${imageSrc}" alt="${title}">
    `;
    carousel.appendChild(slide);
    
    // Create indicator
    const indicator = document.createElement('span');
    indicator.className = 'indicator';
    indicator.onclick = () => goToSlide(index);
    indicatorsContainer.appendChild(indicator);
}

// Check if promotions are enabled
function arePromotionsEnabled() {
    return promotionsData && promotionsData.promotionsEnabled !== false;
}

// Initialize carousel on page load
document.addEventListener('DOMContentLoaded', function() {
    loadPromotionsData();
    
    // Check if promotions are enabled
    if (!arePromotionsEnabled()) {
        // Show message that promotions are disabled
        const carousel = document.querySelector('.carousel-container');
        carousel.innerHTML = `
            <div style="text-align: center; padding: 60px 20px; color: white;">
                <i class="fas fa-pause-circle" style="font-size: 4rem; margin-bottom: 20px; opacity: 0.7;"></i>
                <h2 style="font-size: 2rem; margin-bottom: 10px;">Promotions Currently Disabled</h2>
                <p style="opacity: 0.8;">Please contact administrator to activate promotional content</p>
            </div>
        `;
        return;
    }
    
    createCarouselFromData();
    initializeTouchSupport();
});

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

function initializeTouchSupport() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;
    
    carousel.addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    carousel.addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        changeSlide(1); // Swipe left, go to next slide
    }
    if (touchEndX > touchStartX + 50) {
        changeSlide(-1); // Swipe right, go to previous slide
    }
}
