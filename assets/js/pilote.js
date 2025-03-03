//Variables globales
let currentPage = 1;
const itemsPerPage = 5;
let allpilots = [];
let filteredpilots = [];
let searchParams = {
    query: '',
    location: '',
    page: 1
};
let lastScrollPosition = window.pageYOffset;
let scrollThreshold = 100;

//DONNEES DE TEST - SIMULATION D'UNE API
const mockpilots = [
    //Emplois de test
    {
        id: 1,
        title: "ESSAID-FARHAT Amira",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in metus euismod, finibus massa a, tincidunt lorem.",
        skills: ["Sys. Embarqués", "FrontEnd", "Leadership"],
        applicants: 12,
        logo: ""
    },
    {
        id: 2,
        title: "SCHNEIDER Etienne",
        description: "Integer lacinia, nunc vel convallis lacinia, enim urna convallis magna, at commodo sem magna id nisi. Suspendisse pulvinar libero ac leo lobortis egestas.",
        skills: ["Apache", "BackEnd", "Java"],
        applicants: 8,
        logo: ""
    },
    {
        id: 3,
        title: "BELTZ Herve",
        description: "Mauris tincidunt quam ut lacus feugiat, ut volutpat enim varius. Nunc et sapien nec metus semper tincidunt at vel turpis.",
        skills: ["Alternance", "Mathematic", "Physic"],
        applicants: 5,
        logo: ""
    },
    {
        id: 4,
        title: "KAHLOUCHE Faouzi",
        description: "Etiam euismod libero sit amet nisl finibus, vel fermentum arcu aliquam. Suspendisse potenti.",
        skills: ["Sys. Embarqués", "Bool", "Robotique"],
        applicants: 15,
        logo: ""
    },
    {
        id: 5,
        title: "Développeur Full Stack JavaScript (H/F)",
        location: "Lyon",
        contract: "Salarié - Contrat à Durée Indéterminée",
        date: "24/1/2025",
        description: "Sed laoreet diam at metus eleifend, id tincidunt nisi vulputate. Nam varius lacus id nulla hendrerit, ac euismod odio laoreet.",
        skills: ["JavaScript", "React", "Node.js"],
        salary: "45000 - 55000 €/an",
        applicants: 23,
        logo: ""
    },
    {
        id: 6,
        title: "Data Scientist Senior",
        location: "Paris",
        contract: "Salarié - Contrat à Durée Indéterminée",
        date: "23/1/2025",
        description: "Nous recherchons un Data Scientist expérimenté pour analyser des données complexes et développer des modèles prédictifs.",
        skills: ["Python", "Machine Learning", "SQL"],
        salary: "55000 - 70000 €/an",
        applicants: 18,
        logo: ""
    },
    {
        id: 7,
        title: "UX/UI Designer",
        location: "Bordeaux",
        contract: "Salarié - Contrat à Durée Indéterminée",
        date: "22/1/2025",
        description: "Créez des interfaces utilisateur intuitives et esthétiques pour nos applications web et mobiles.",
        skills: ["Figma", "Adobe XD", "Prototypage"],
        salary: "38000 - 45000 €/an",
        applicants: 9,
        logo: ""
    },
    {
        id: 8,
        title: "Ingénieur DevOps",
        location: "Nantes",
        contract: "Salarié - Contrat à Durée Indéterminée",
        date: "22/1/2025",
        description: "Optimisez nos processus de déploiement et maintenez notre infrastructure cloud.",
        skills: ["Docker", "Kubernetes", "AWS"],
        salary: "48000 - 60000 €/an",
        applicants: 7,
        logo: ""
    },
    {
        id: 9,
        title: "Chargé de communication digitale",
        location: "Lille",
        contract: "Stage (6 mois)",
        date: "21/1/2025",
        description: "Participez à l'élaboration et à la mise en œuvre de notre stratégie de communication digitale.",
        skills: ["Social Media", "Rédaction Web", "Stratégie Digitale"],
        salary: "1000 €/mois",
        applicants: 21,
        logo: ""
    },
    {
        id: 10,
        title: "Développeur Front-End React",
        location: "Toulouse",
        contract: "Salarié - Contrat à Durée Indéterminée",
        date: "20/1/2025",
        description: "Rejoignez notre équipe pour développer des interfaces modernes et réactives.",
        skills: ["React", "TypeScript", "CSS"],
        salary: "40000 - 50000 €/an",
        applicants: 14,
        logo: ""
    }
];

// ========= Fonction d'Initialisation =========

//Init chargement page
document.addEventListener("DOMContentLoaded", function() {
    //Charger les données (sim)
    fetchpilots();

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
function fetchpilots() {
    setTimeout(() => {
        allpilots = [...mockpilots];
        filteredpilots = [...allpilots];
        updatepilotCount();
        renderpilots();
        renderPagination();
    }, 300);
}

/*
A remplacer par :
async function fetchpilotsFromAPI(params = {}) {
Code d'Appel API
}
*/

//Filtrage des offres en fonction de la recherche
function filterpilots() {
    const query = searchParams.query.toLowerCase();
    const location = searchParams.location.toLowerCase();

    filteredpilots = allpilots.filter(pilot => {
       const matchesQuery = !query ||
           pilot.title.toLowerCase().includes(query) ||
           pilot.description.toLowerCase().includes(query) ||
           pilot.skills.some(skill => skill.toLowerCase().includes(query));

       const matchesLocation = !location ||
           pilot.location.toLowerCase().includes(location);

       return matchesQuery && matchesLocation;
    });

    currentPage = 1; //Réinitialiser à la première page après app filtre
    updatepilotCount();
    renderpilots();
    renderPagination();
}

//Màj nombre offres affichées
function updatepilotCount() {
    const countElement = document.querySelector('.pilot-listings h2');
    countElement.textContent = `${filteredpilots.length} sur ${allpilots.length} offres disponibles`;
}


// ========= Fonctions rendu =========

//Offres sur page actu
function renderpilots() {
    const pilotListings = document.querySelector('.pilot-listings');

    //Suppr offres actu sauf titre et pagination
    const titleElement = pilotListings.querySelector('h2');
    const paginationElement = pilotListings.querySelector('.pagination');

    pilotListings.innerHTML = '';
    pilotListings.appendChild(titleElement);

    //Calcul offre afficher page actu
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredpilots.length);
    const pilotsToDisplay = filteredpilots.slice(startIndex, endIndex);

    //Création + ajout carte offres
    pilotsToDisplay.forEach(pilot => {
        pilotListings.appendChild(createpilotCard(pilot));
    });

    //Ajout pagination
    if (paginationElement) {
        pilotListings.appendChild(paginationElement);
    } else {
        const newPagination = createPaginationElement();
        pilotListings.appendChild(newPagination);
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
function createpilotCard(pilot) {
    const pilotCard = document.createElement("div");
    pilotCard.className = 'pilot-card';
    pilotCard.setAttribute('data-pilot-id', pilot.id);

    // Échapper les données pour éviter les attaques XSS
    
    const safeTitle = escapeHtml(pilot.title);
    const safeDescription = escapeHtml(pilot.description);

    pilotCard.innerHTML = `
        <div class="pilot-content">
            <div class="pilot-info">
                <div class="company-logo">
                    <img src="${pilot.logo || 'assets/images/default-logo.png'}" alt="Logo entreprise" onserror="this.src='assets/images/default-logo.png'">
                </div>
                <div class="pilot-details">
                    <h3 class="pilot-title">${safeTitle}</h3>
                    <p class="pilot-description">${safeDescription}</p>
                    <div class="pilot-skills">
                        ${pilot.skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                    </div>
                </div>
            </div>
            <div class="pilot-actions">
                <a href="InspecterP.html?id=${pilot.id}" class="view-more-btn">Inspecter</a>
            </div>
        </div>
    `;

    //EventListener "VoirPlus"
    const viewMoreBtn = pilotCard.querySelector('.view-more-btn');
    viewMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        viewpilotDetails(pilot.id);
    });

    return pilotCard;
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
    const totalPages = Math.ceil(filteredpilots.length / itemsPerPage);

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
    filterpilots();
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
            const totalPages = Math.ceil(filteredpilots.length / itemsPerPage);
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
        renderpilots();
        renderPagination();

        //Défilage vers le haut
        document.querySelector('.pilot-listings').scrollIntoView({ behavior: 'smooth' });
    }
}

//Affichage détails offre
function viewpilotDetails(pilotId) {
    //A IMPLEMENTER : Redirection vers la page de détails ou affichage modal
    console.log(`Voir détails de l'offre ${pilotId}`);

    //A IMPLEMENTER : Redirection vers une page de détails
    window.location.href = `details.html?id=${pilotId}`;
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
        filterpilots();
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
async function fetchpilotsFromAPI(params = {}) {
    try {
        //Construction URL avec params
        const queryParams = new URLSearchParams();
        if (params.query) queryParams.set('query', params.query);
        if (params.location) queryParams.set('location', params.location);
        if (params.page) queryParams.set('page', params.page);

        const apiUrl = `/api/pilots?${queryParams.toString()}`;

        //Affichage indicateur chargement
        showLoadingState();

        //Appel API
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }

        const data = await response.json();

        //Màj données
        allpilots = data.pilots || [];
        filteredpilots = [...allpilots];

        //Màj affichage
        updatepilotCount();
        renderpilots();
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

    document.querySelector('.pilot-listings').appendChild(loadingElement);
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

    document.querySelector('.pilot-listings').appendChild(errorElement);

    // Masquer le message après 5 secondes
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}