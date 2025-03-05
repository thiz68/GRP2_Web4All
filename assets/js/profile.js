//Variables globales
let currentPage = 1;
const itemsPerPage = 5;
let allprofiles = [];
let filteredprofiles = [];
let searchParams = {
    query: '',
    location: '',
    page: 1
};
let lastScrollPosition = window.pageYOffset;
let scrollThreshold = 100;

//DONNEES DE TEST - SIMULATION D'UNE API
const mockprofiles = [
    //Emplois de test
    {
        id: 1,
        title: "SZABLEWSKI Yanis",
        email: "yanis.szablewski@viacesi.fr",
        logo: ""
    },
    {
        id: 2,
        title: "GABUS Thibaud",
        email: "thibaud.gabus@viacesi.fr",
        logo: ""
    },
    {
        id: 3,
        title: "WEYANDT Jules",
        email: "jules.weyandt@viacesi.fr",
        logo: ""
    },
    {
        id: 4,
        title: "GARDES Cléry",
        email: "clery.gardes@viacesi.fr",
        logo: ""
    }
];

// ========= Fonction d'Initialisation =========

//Init chargement page
document.addEventListener("DOMContentLoaded", function() {
    //Charger les données (sim)
    fetchprofiles();

    //EventListeners
    setupEventListeners();

    //Params URL (si partage de lien)
    parseUrlParams();
});

//Config EventListeners
function setupEventListeners() {
    //EventListener Recherche
    document.getElementById('searchButton').addEventListener('click', handleSearch);
    document.getElementById('searchGeneral').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });

    //EventListener Localisation
    document.getElementById('location-icon').addEventListener('click', handleSearch);
    document.querySelector('.searchLocation').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') handleSearch();
    });

    //Bouton "Voir nos offres"
    document.getElementById('viewOffers').addEventListener('click', handleSearch);

    //Navigation de pagination
    document.querySelector('.pagination').addEventListener('click', handlePagination);

    //Gestion scroll
    window.addEventListener('scroll', handleScroll);

    createBackToTopButton();

    //Sécu données utilisateur
    document.getElementById('searchGeneral').addEventListener('input', sanitizeInput);
    document.querySelector('.searchLocation').addEventListener('input', sanitizeInput);
}

// ========= Fonctions Gestion Données =========

//Sim récupération offres (remplacer par appel API)
function fetchprofiles() {
    setTimeout(() => {
        allprofiles = [...mockprofiles];
        filteredprofiles = [...allprofiles];
        updateprofileCount();
        renderprofiles();
        renderPagination();
    }, 300);
}

/*
A remplacer par :
async function fetchprofilesFromAPI(params = {}) {
Code d'Appel API
}
*/

//Filtrage des offres en fonction de la recherche
function filterprofiles() {
    const query = searchParams.query.toLowerCase();
    const location = searchParams.location.toLowerCase();

    filteredprofiles = allprofiles.filter(profile => {
        const matchesQuery = !query ||
            profile.title.toLowerCase().includes(query) ||
            profile.description.toLowerCase().includes(query) ||
            profile.skills.some(skill => skill.toLowerCase().includes(query));

        const matchesLocation = !location ||
            profile.location.toLowerCase().includes(location);

        return matchesQuery && matchesLocation;
    });

    currentPage = 1; //Réinitialiser à la première page après app filtre
    updateprofileCount();
    renderprofiles();
    renderPagination();
}

//Màj nombre offres affichées
function updateprofileCount() {
    const countElement = document.querySelector('.profile-listings h2');
    countElement.textContent = `${filteredprofiles.length} sur ${allprofiles.length} offres disponibles`;
}


// ========= Fonctions rendu =========

//Offres sur page actu
function renderprofiles() {
    const profileListings = document.querySelector('.profile-listings');

    //Suppr offres actu sauf titre et pagination
    const titleElement = profileListings.querySelector('h2');
    const paginationElement = profileListings.querySelector('.pagination');

    profileListings.innerHTML = '';
    profileListings.appendChild(titleElement);

    //Calcul offre afficher page actu
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredprofiles.length);
    const profilesToDisplay = filteredprofiles.slice(startIndex, endIndex);

    //Création + ajout carte offres
    profilesToDisplay.forEach(profile => {
        profileListings.appendChild(createprofileCard(profile));
    });

    //Ajout pagination
    if (paginationElement) {
        profileListings.appendChild(paginationElement);
    } else {
        const newPagination = createPaginationElement();
        profileListings.appendChild(newPagination);
    }
}
//Fonction nettoyage entrées utilisateur
function sanitizeInput(e) {
    //Récup valeur actuelle
    let value = e.target.value;

    //Suppression balises HTML et script
    value = value.replace(/<[^>]*>/g, '');

    //Echapper les caractères spéciaux
    value = value.replace(/[&<>"']/g, function(m) {
        return {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        }[m];
    });

    //Limitation longueur
    if (value.length > 100) {
        value = value.substring(0, 100);
    }

    //Màj valeur
    if (value !== e.target.value) {
        e.target.value = value;
    }
}

//Création carte offre
function createprofileCard(profile) {
    const profileCard = document.createElement("div");
    profileCard.className = 'profile-card';
    profileCard.setAttribute('data-profile-id', profile.id);

    // Échapper les données pour éviter les attaques XSS

    const safeTitle = escapeHtml(profile.title);
    const safeEmail = escapeHtml(profile.email);

    profileCard.innerHTML = `
        <div class="profile-container">
            <div class="header">
                <div class="Profile-picture">
                    <img src="${profile.logo || 'assets/images/default-logo.png'}" alt="Logo entreprise" onserror="this.src='assets/images/default-logo.png'">
                <h2>${safeTitle}</h2>
                </div>
                <div class="info">
                    <p>${safeEmail}</p>
                </div>
            </div>
        </div>
    `;

    //EventListener "VoirPlus"
    const viewMoreBtn = profileCard.querySelector('.view-more-btn');
    viewMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        viewprofileDetails(profile.id);
    });

    return profileCard;
}

// Fonction pour échapper le HTML
function escapeHtml(unsafe) {
    if (typeof unsafe !== 'string') {
        return '';
    }
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

//Element pagination
function createPaginationElement() {
    const pagination = document.createElement("div");
    pagination.className = 'pagination';

    return pagination;
}

//Màj pagination
function renderPagination() {
    const pagination = document.querySelector('.pagination');
    const totalPages = Math.ceil(filteredprofiles.length / itemsPerPage);

    pagination.innerHTML = '';

    //Bouton précédent
    const prevButton = document.createElement('a');
    prevButton.href = '#';
    prevButton.className = 'prev-page';
    prevButton.innerHTML = '<i class="fas fa-chevron-left"></i>';
    prevButton.setAttribute('data-page', 'prev');
    pagination.appendChild(prevButton);

    //Génération num page
    const maxVisiblePages = 5; //Nbre max pages affichage
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    //Ajustement si près fin
    if (endPage - startPage + 1 < maxVisiblePages && startPage > 1) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    //Première page si autre conditions non remplies
    if (startPage > 1) {
        const firstPage = document.createElement('a');
        firstPage.href = '#';
        firstPage.className = 'page-number';
        firstPage.textContent = '1';
        firstPage.setAttribute('data-page', '1');
        pagination.appendChild(firstPage);

        //Ajout point de suspension si nécessaire
        if (startPage > 2) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            firstPage.appendChild(ellipsis);
        }
    }

    //Pages principales
    for (let i = startPage; i <= endPage; i++) {
        const pageLink = document.createElement('a');
        pageLink.href = '#';
        pageLink.className = 'page-number' + (i === currentPage ? ' active' : '');
        pageLink.textContent = i;
        pageLink.setAttribute('data-page', i);
        pagination.appendChild(pageLink);
    }

    //Dernière page si autre conditions non remplies
    if (endPage < totalPages) {
        //Ajout point de suspension
        if (endPage < totalPages - 1) {
            const ellipsis = document.createElement('span');
            ellipsis.className = 'page-ellipsis';
            ellipsis.textContent = '...';
            pagination.appendChild(ellipsis);
        }

        const lastPage = document.createElement('a');
        lastPage.href = '#';
        lastPage.className = 'page-number';
        lastPage.textContent = totalPages;
        lastPage.setAttribute('data-page', totalPages);
        pagination.appendChild(lastPage);
    }

    //Bouton suivant
    const nextButton = document.createElement('a');
    nextButton.href = '#';
    nextButton.className = 'next-page';
    nextButton.innerHTML = '<i class="fas fa-chevron-right"></i>';
    nextButton.setAttribute('data-page', 'next');
    pagination.appendChild(nextButton);
}

// ========= Gestionnaires d'événements =========

//Gestion recherche et filtrage
function handleSearch() {
    searchParams.query = document.getElementById('searchGeneral').value.trim();
    searchParams.location = document.querySelector('.searchLocation').value.trim();

    //Màj URL paramètres de recherche
    updateUrlParams();

    //Filtrage offres
    filterprofiles();
}

//Gestion navigation pagination
function handlePagination(e) {
    e.preventDefault();

    if (e.target.closest('a')) {
        const pageElement = e.target.closest('a');
        const page = pageElement.getAttribute('data-page');

        if (page === 'prev') {
            if (currentPage > 1) {
                currentPage--;
            }
        } else if (page === 'next') {
            const totalPages = Math.ceil(filteredprofiles.length / itemsPerPage);
            if (currentPage < totalPages) {
                currentPage++;
            }
        } else  {
            currentPage = parseInt(page);
        }

        //Màj URL
        searchParams.page = currentPage;
        updateUrlParams();

        //Màj affichage
        renderprofiles();
        renderPagination();

        //Défilage vers le haut
        document.querySelector('.profile-listings').scrollIntoView({ behavior: 'smooth' });
    }
}

//Affichage détails offre
function viewprofileDetails(profileId) {
    //A IMPLEMENTER : Redirection vers la page de détails ou affichage modal
    console.log(`Voir détails de l'offre ${profileId}`);

    //A IMPLEMENTER : Redirection vers une page de détails
    window.location.href = `details.html?id=${profileId}`;
}

// ========= Gestion URL =========

//Extraction paramètres URL
function parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.has('query')) {
        searchParams.query = urlParams.get('query').slice(0, 100);
        document.getElementById('searchGeneral').value = searchParams.query;
    }

    if (urlParams.has('location')) {
        searchParams.location = urlParams.get('location').slice(0, 100);
        document.querySelector('.searchLocation').value = searchParams.location;
    }

    if (urlParams.has('page')) {
        const pageParam = parseInt(urlParams.get('page')) || 1;
        // Validation pour éviter les valeurs négatives ou trop grandes
        currentPage = Math.max(1, Math.min(pageParam, 1000));
    }

    // Si paramètres, alors recherche
    if (searchParams.query || searchParams.location) {
        filterprofiles();
    }
}

//Màj URL avec params
function updateUrlParams() {
    const urlParams = new URLSearchParams();

    if (searchParams.query) {
        // Limiter la longueur et nettoyer la chaîne
        const safeQuery = searchParams.query.slice(0, 100);
        urlParams.set('query', safeQuery);
    }

    if (searchParams.location) {
        // Limiter la longueur et nettoyer la chaîne
        const safeLocation = searchParams.location.slice(0, 100);
        urlParams.set('location', safeLocation);
    }

    if (currentPage > 1) {
        // S'assurer que la page est un nombre valide
        const safePage = Number.isInteger(currentPage) ? currentPage : 1;
        urlParams.set('page', safePage);
    }

    const newUrl = urlParams.toString()
        ? `${window.location.pathname}?${urlParams.toString()}`
        : window.location.pathname;

    // Mise à jour URL sans recharger la page
    window.history.pushState({path: newUrl}, '', newUrl);
}

// ========= Gestion Scroll =========
function handleScroll() {
    const currentScrollPosition = window.pageYOffset;
    const navbar = document.querySelector('.navbar');
    const backToTop = document.querySelector('.back-to-top');

    //Gestion navbar
    if (currentScrollPosition > scrollThreshold) {
        // Si on scroll vers le bas, on cache la navbar
        if (currentScrollPosition > lastScrollPosition) {
            navbar.classList.add('hidden');
        } else {
            // Si on scroll vers le haut, on affiche la navbar
            navbar.classList.remove('hidden');
        }
    }

    //Gestion BackToTop
    if (currentScrollPosition > scrollThreshold * 2) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    lastScrollPosition = currentScrollPosition;
}

// ========= Gestion BackToTop =========
function createBackToTopButton() {
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-chevron-up"></i>';

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    document.body.appendChild(backToTop);
}

// ========= A IMPLEMENTER : Interaction API =========

//Récupération offres depuis API
async function fetchprofilesFromAPI(params = {}) {
    try {
        //Construction URL avec params
        const queryParams = new URLSearchParams();
        if (params.query) queryParams.set('query', params.query);
        if (params.location) queryParams.set('location', params.location);
        if (params.page) queryParams.set('page', params.page);

        const apiUrl = `/api/profiles?${queryParams.toString()}`;

        //Affichage indicateur chargement
        showLoadingState();

        //Appel API
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }

        const data = await response.json();

        //Màj données
        allprofiles = data.profiles || [];
        filteredprofiles = [...allprofiles];

        //Màj affichage
        updateprofileCount();
        renderprofiles();
        renderPagination();
    } catch (error) {
        console.error("Erreur lors de la récupération des offres : ", error);
        showErrorMessage("Impossible de charger les offres. Veuillez réessayer plus tard.");
    } finally {
        //Masquage indicateur chargement
        hideLoadingState();
    }
}

//Affichage indicateur chargement
function showLoadingState() {
    //Création et affichage chargement
    const loadingElement = document.getElementById('div');
    loadingElement.className = 'loading-indicator'
    loadingElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Chargement...\''

    document.querySelector('.profile-listings').appendChild(loadingElement);
}

//Masquage l'indicateur de chargement
function hideLoadingState() {
    //Suppression indicateur chargement
    const loadingElement = document.querySelector('.loading-indicator');
    if (loadingElement) {
        loadingElement.remove();
    }
}

//Affichage message erreur
function showErrorMessage(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;

    document.querySelector('.profile-listings').appendChild(errorElement);

    // Masquer le message après 5 secondes
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}