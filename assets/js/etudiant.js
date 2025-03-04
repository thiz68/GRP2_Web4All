//Variables globales
let currentPage = 1;
const itemsPerPage = 5;
let allstuds = [];
let filteredstuds = [];
let searchParams = {
    query: '',
    location: '',
    page: 1
};
let lastScrollPosition = window.pageYOffset;
let scrollThreshold = 100;

//DONNEES DE TEST - SIMULATION D'UNE API
const mockstuds = [
    //Emplois de test
    {
        id: 1,
        title: "SZABLEWSKI Yanis",
        location: "Colmar",
        age: "19 ans",
        email:"yanis.szablewski@viacesi.fr",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in metus euismod, finibus massa a, tincidunt lorem.",
        skills: ["Management", "BCM", "Leadership"],
        stages: " En recherche",
        logo: ""
    },
    {
        id: 2,
        title: "GABUS Thibaud",
        location:"Strasbourg",
        age: "19 ans",
        email:"thibaud.gabus@viacesi.fr",
        description: "Integer lacinia, nunc vel convallis lacinia, enim urna convallis magna, at commodo sem magna id nisi. Suspendisse pulvinar libero ac leo lobortis egestas.",
        skills: ["Compliance", "Audit", "BAC+5"],
        stages: " En recherche",
        logo: ""
    },
    {
        id: 3,
        title: "WEYANDT Jules",
        location: "Strasbourg",
        age: "19 ans",
        email:"jules.weyandt@viacesi.fr",
        description: "Pellentesque habitant morbi tristique sen",
        skills: ["Immobilier", "Graduate Program", "Corporate"],
        stages: " En recherche",
        logo: ""
    },
    {
        id: 4,
        title: "GARDES Cléry",
        location: "Selestat",
        age: "19 ans",
        email:"clery.gardes@viacesi.fr",
        description: "Etiam euismod libero sit amet nisl finibus, vel fermentum arcu aliquam. Suspendisse potenti.",
        skills: ["Marketing Digital", "SEO", "Réseaux Sociaux"],
        stages: " En recherche",
        logo: ""
    },
    {
        id: 5,
        title: "Développeur Full Stack JavaScript (H/F)",
        location: "Lyon",
        age: "24/1/2025",
        email:"flemme.flemme@viacesi.fr",
        description: "Sed laoreet diam at metus eleifend, id tincidunt nisi vulputate. Nam varius lacus id nulla hendrerit, ac euismod odio laoreet.",
        skills: ["JavaScript", "React", "Node.js"],
        stages: " En recherche",
        logo: ""
    },
    {
        id: 6,
        title: "Développeur Full Stack JavaScript (H/F)",
        location: "Lyon",
        age: "24/1/2025",
        email:"flemme.flemme@viacesi.fr",
        description: "Sed laoreet diam at metus eleifend, id tincidunt nisi vulputate. Nam varius lacus id nulla hendrerit, ac euismod odio laoreet.",
        skills: ["JavaScript", "React", "Node.js"],
        stages: " En recherche",
        logo: ""
},
    {
        id: 7,
        title: "Développeur Full Stack JavaScript (H/F)",
        location: "Lyon",
        age: "24/1/2025",
        email:"flemme.flemme@viacesi.fr",
        description: "Sed laoreet diam at metus eleifend, id tincidunt nisi vulputate. Nam varius lacus id nulla hendrerit, ac euismod odio laoreet.",
        skills: ["JavaScript", "React", "Node.js"],
        stages: " En recherche",
        logo: ""
    },
    {
        id: 8,
        title: "Développeur Full Stack JavaScript (H/F)",
        location: "Lyon",
        age: "24/1/2025",
        email:"flemme.flemme@viacesi.fr",
        description: "Sed laoreet diam at metus eleifend, id tincidunt nisi vulputate. Nam varius lacus id nulla hendrerit, ac euismod odio laoreet.",
        skills: ["JavaScript", "React", "Node.js"],
        stages: " En recherche",
        logo: ""
    },
    {
        id: 9,
        title: "Développeur Full Stack JavaScript (H/F)",
        location: "Lyon",
        age: "24/1/2025",
        email:"flemme.flemme@viacesi.fr",
        description: "Sed laoreet diam at metus eleifend, id tincidunt nisi vulputate. Nam varius lacus id nulla hendrerit, ac euismod odio laoreet.",
        skills: ["JavaScript", "React", "Node.js"],
        stages: " En recherche",
        logo: ""
    },
    {
        id: 10,
        title: "Développeur Full Stack JavaScript (H/F)",
        location: "Lyon",
        age: "24/1/2025",
        email:"flemme.flemme@viacesi.fr",
        description: "Sed laoreet diam at metus eleifend, id tincidunt nisi vulputate. Nam varius lacus id nulla hendrerit, ac euismod odio laoreet.",
        skills: ["JavaScript", "React", "Node.js"],
        stages: " En recherche",
        logo: ""
    },
    {
        id: 11,
        title: "Développeur Full Stack JavaScript (H/F)",
        location: "Lyon",
        age: "24/1/2025",
        email:"flemme.flemme@viacesi.fr",
        description: "Sed laoreet diam at metus eleifend, id tincidunt nisi vulputate. Nam varius lacus id nulla hendrerit, ac euismod odio laoreet.",
        skills: ["JavaScript", "React", "Node.js"],
        stages: " En recherche",
        logo: ""
    },
];

// ========= Fonction d'Initialisation =========

//Init chargement page
document.addEventListener("DOMContentLoaded", function() {
    //Charger les données (sim)
    fetchstuds();

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
function fetchstuds() {
    setTimeout(() => {
        allstuds = [...mockstuds];
        filteredstuds = [...allstuds];
        updatestudCount();
        renderstuds();
        renderPagination();
    }, 300);
}

/*
A remplacer par :
async function fetchstudsFromAPI(params = {}) {
Code d'Appel API
}
*/

//Filtrage des offres en fonction de la recherche
function filterstuds() {
    const query = searchParams.query.toLowerCase();
    const location = searchParams.location.toLowerCase();

    filteredstuds = allstuds.filter(stud => {
       const matchesQuery = !query ||
           stud.title.toLowerCase().includes(query) ||
           stud.description.toLowerCase().includes(query) ||
           stud.skills.some(skill => skill.toLowerCase().includes(query));

       const matchesLocation = !location ||
           stud.location.toLowerCase().includes(location);

       return matchesQuery && matchesLocation;
    });

    currentPage = 1; //Réinitialiser à la première page après app filtre
    updatestudCount();
    renderstuds();
    renderPagination();
}

//Màj nombre offres affichées
function updatestudCount() {
    const countElement = document.querySelector('.stud-listings h2');
    countElement.textContent = `${filteredstuds.length} sur ${allstuds.length} offres disponibles`;
}


// ========= Fonctions rendu =========

//Offres sur page actu
function renderstuds() {
    const studListings = document.querySelector('.stud-listings');

    //Suppr offres actu sauf titre et pagination
    const titleElement = studListings.querySelector('h2');
    const paginationElement = studListings.querySelector('.pagination');

    studListings.innerHTML = '';
    studListings.appendChild(titleElement);

    //Calcul offre afficher page actu
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredstuds.length);
    const studsToDisplay = filteredstuds.slice(startIndex, endIndex);

    //Création + ajout carte offres
    studsToDisplay.forEach(stud => {
        studListings.appendChild(createstudCard(stud));
    });

    //Ajout pagination
    if (paginationElement) {
        studListings.appendChild(paginationElement);
    } else {
        const newPagination = createPaginationElement();
        studListings.appendChild(newPagination);
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
function createstudCard(stud) {
    const studCard = document.createElement("div");
    studCard.className = 'stud-card';
    studCard.setAttribute('data-stud-id', stud.id);

    // Échapper les données pour éviter les attaques XSS
    const safeTitle = escapeHtml(stud.title);
    const safeLocation = escapeHtml(stud.location);
    const safeAge = escapeHtml(stud.age);
    const safeDescription = escapeHtml(stud.description);
    const safeEmail = escapeHtml(stud.email);

    studCard.innerHTML = `
        <div class="stud-content">
            <div class="stud-info">
                <div class="company-logo">
                    <img src="${stud.logo || 'assets/images/default-logo.png'}" alt="Logo entreprise" onerror="this.src='assets/images/default-logo.png'">
                </div>
                <div class="stud-details">
                    <h3 class="stud-title">${safeTitle}</h3>
                    <div class="stud-meta">
                        <div class="stud-location"><i class="fas fa-map-marker-alt"></i> ${safeLocation}</div>
                        <div class="stud-age"><i class="fas fa-calendar-alt"></i> Agé(e) de ${safeAge}</div>
                        <div class="stud-email"><i class="fas fa-envelope"></i> ${safeEmail}</div> 
                    </div>
                    <p class="stud-description">${safeDescription}</p>
                    <div class="stud-skills">
                        ${stud.skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                    </div>
                    <div class="stud-additional">
                        <span class="stud-stage"><i class="fas fa-user-graduate"></i>${stud.stages} </span>
                    </div>
                </div>
            </div>
            <div class="stud-actions">
                <a href="InspecterE.html?id=${stud.id}" class="view-more-btn">Inspecter</a>
            </div>
        </div>
    `;

    //EventListener "VoirPlus"
    const viewMoreBtn = studCard.querySelector('.view-more-btn');
    viewMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        viewstudDetails(stud.id);
    });

    return studCard;
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
    const totalPages = Math.ceil(filteredstuds.length / itemsPerPage);

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
    filterstuds();
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
            const totalPages = Math.ceil(filteredstuds.length / itemsPerPage);
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
        renderstuds();
        renderPagination();

        //Défilage vers le haut
        document.querySelector('.stud-listings').scrollIntoView({ behavior: 'smooth' });
    }
}

//Affichage détails offre
function viewstudDetails(studId) {
    //A IMPLEMENTER : Redirection vers la page de détails ou affichage modal
    console.log(`Voir détails de l'offre ${studId}`);

    //A IMPLEMENTER : Redirection vers une page de détails
    window.location.href = `details.html?id=${studId}`;
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
        filterstuds();
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
async function fetchstudsFromAPI(params = {}) {
    try {
        //Construction URL avec params
        const queryParams = new URLSearchParams();
        if (params.query) queryParams.set('query', params.query);
        if (params.location) queryParams.set('location', params.location);
        if (params.page) queryParams.set('page', params.page);

        const apiUrl = `/api/studs?${queryParams.toString()}`;

        //Affichage indicateur chargement
        showLoadingState();

        //Appel API
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }

        const data = await response.json();

        //Màj données
        allstuds = data.studs || [];
        filteredstuds = [...allstuds];

        //Màj affichage
        updatestudCount();
        renderstuds();
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

    document.querySelector('.stud-listings').appendChild(loadingElement);
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

    document.querySelector('.stud-listings').appendChild(errorElement);

    // Masquer le message après 5 secondes
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}