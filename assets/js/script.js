let lastScrollPosition = window.pageYOffset;
let scrollThreshold = 100;

// ========= Fonction d'Initialisation =========
// Init chargement page
document.addEventListener("DOMContentLoaded", function() {
    // EventListeners
    setupEventListeners();
});

// Config EventListeners
function setupEventListeners() {
    // Gestion scroll
    window.addEventListener('scroll', handleScroll);
}

// ========= Gestion Scroll =========
function handleScroll() {
    const currentScrollPosition = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');

    // Gestion navbar
    if (currentScrollPosition > scrollThreshold) {
        // Si on scroll vers le bas, on cache la navbar
        if (currentScrollPosition > lastScrollPosition) {
            navbar.classList.add('hidden');
        } else {
            // Si on scroll vers le haut, on affiche la navbar
            navbar.classList.remove('hidden');
        }
    } else {
        navbar.classList.remove('hidden');
    }

    // Gestion BackToTop
    if (currentScrollPosition > scrollThreshold * 2) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    lastScrollPosition = currentScrollPosition;
}
