/**
 * Preloader Script
 * Loads images in the background to improve performance between levels.
 */

const IMAGES_TO_PRELOAD = [
    "assets/images/boy.jpg",
    "assets/images/recycling.jpg",
    "assets/images/im.jpg",
    "assets/images/flower1.png",
    "assets/images/tree.jpg",
    "assets/images/moon.jpg",
    "assets/images/flower2.png",
    "assets/images/sunrise.jpg",
    "assets/images/flower3.png",
    "assets/images/bee.jpg",
    "assets/images/3d-cartoon-apple.jpg",
    "assets/images/green.png",
    "assets/images/play.jpg"
];

const PRELOADED_IMAGES = {};

function startPreloading() {
    console.log("Starting asset preloading...");
    // Silently preload in the background — no UI shown on start/map pages
    IMAGES_TO_PRELOAD.forEach(src => {
        if (!PRELOADED_IMAGES[src]) {
            const img = new Image();
            img.onload = () => {
                PRELOADED_IMAGES[src] = true;
            };
            img.src = src;
        }
    });
}

// Start preloading immediately
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startPreloading);
} else {
    startPreloading();
}

/**
 * Loading Screen Logic
 */
function injectLoadingScreen(isMini = false) {
    if (document.getElementById('loading-overlay')) {
        const overlay = document.getElementById('loading-overlay');
        if (isMini) overlay.classList.add('mini');
        else overlay.classList.remove('mini');
        return;
    }
    
    const overlay = document.createElement('div');
    overlay.id = 'loading-overlay';
    if (isMini) overlay.classList.add('mini');
    
    overlay.innerHTML = `
        <div class="loader-spinner"></div>
        <div class="loading-text">${isMini ? 'Readying assets...' : 'Loading Level...'}</div>
    `;
    document.body.appendChild(overlay);
}

function showLoading(isMini = false) {
    injectLoadingScreen(isMini);
    const overlay = document.getElementById('loading-overlay');
    overlay.classList.remove('hidden');
}

function hideLoading() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.classList.add('hidden');
    }
}

// Auto-inject on puzzle pages (full screen)
if (window.location.pathname.includes('puzzle')) {
    document.addEventListener('DOMContentLoaded', () => injectLoadingScreen(false));
}
