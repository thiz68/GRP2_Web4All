//Variables globales
let currentPage = 1;
const itemsPerPage = 5;
let allJobs = [];
let filteredJobs = [];
let searchParams = {
    query: '',
    location: '',
    page: 1
};
let lastScrollPosition = window.pageYOffset;
let scrollThreshold = 100;

//DONNEES DE TEST - SIMULATION D'UNE API
const mockJobs = [
    //Emplois de test
    {
        id: 1,
        title: "Deputy Manager - BCM Team Lead",
        location: "Chennai",
        contract: "Salarié - Contrat à Durée Indéterminée",
        date: "25/01/2025",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in metus euismod, finibus massa a, tincidunt lorem.",
        skills: ["Management", "BCM", "Leadership"],
        salary: "45000 - 55000 €/an",
        applicants: 12,
        logo: ""
    },
    {
        id: 3,
        title: "Graduate Program Corporate Excellence: Immobilier et Services généraux",
        location: "Guyancourt",
        contract: "Salarié - Contrat à Durée Indéterminée",
        date: "25/01/2025",
        description: "Mauris tincidunt quam ut lacus feugiat, ut volutpat enim varius. Nunc et sapien nec metus semper tincidunt at vel turpis.",
        skills: ["Immobilier", "Graduate Program", "Corporate"],
        salary: "38000 - 42000 €/an",
        applicants: 5,
        logo: ""
    },
    {
        id: 5,
        title: "Développeur Full Stack JavaScript (H/F)",
        location: "Lyon",
        contract: "Salarié - Contrat à Durée Indéterminée",
        date: "24/01/2025",
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
        date: "23/01/2025",
        description: "Nous recherchons un Data Scientist expérimenté pour analyser des données complexes et développer des modèles prédictifs.",
        skills: ["Python", "Machine Learning", "SQL"],
        salary: "55000 - 70000 €/an",
        applicants: 18,
        logo: ""
    },
    {
        id: 7,
        title: "Chargé de communication digitale",
        location: "Lille",
        contract: "Stage (6 mois)",
        date: "21/01/2025",
        description: "Participez à l'élaboration et à la mise en œuvre de notre stratégie de communication digitale.",
        skills: ["Social Media", "Rédaction Web", "Stratégie Digitale"],
        salary: "1000 €/mois",
        applicants: 21,
        logo: ""
    },
    {
        id: 9,
        title: "Chargé de communication digitale",
        location: "Lille",
        contract: "Stage (6 mois)",
        date: "21/01/2025",
        description: "Participez à l'élaboration et à la mise en œuvre de notre stratégie de communication digitale.",
        skills: ["Social Media", "Rédaction Web", "Stratégie Digitale"],
        salary: "1000 €/mois",
        applicants: 21,
        logo: ""
    },
];

// ========= Fonction d'Initialisation =========

//Init chargement page
document.addEventListener("DOMContentLoaded", function() {
    //Charger les données (sim)
    fetchJobs();

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
function fetchJobs() {
    setTimeout(() => {
        allJobs = [...mockJobs];
        filteredJobs = [...allJobs];
        updateJobCount();
        renderJobs();
        renderPagination();
    }, 300);
}

/*
A remplacer par :
async function fetchJobsFromAPI(params = {}) {
Code d'Appel API
}
*/

//Filtrage des offres en fonction de la recherche
function filterJobs() {
    const query = searchParams.query.toLowerCase();
    const location = searchParams.location.toLowerCase();

    filteredJobs = allJobs.filter(job => {
        const matchesQuery = !query ||
            job.title.toLowerCase().includes(query) ||
            job.description.toLowerCase().includes(query) ||
            job.skills.some(skill => skill.toLowerCase().includes(query));

        const matchesLocation = !location ||
            job.location.toLowerCase().includes(location);

        return matchesQuery && matchesLocation;
    });

    currentPage = 1; //Réinitialiser à la première page après app filtre
    updateJobCount();
    renderJobs();
    renderPagination();
}

//Màj nombre offres affichées
function updateJobCount() {
    const countElement = document.querySelector('.job-listings h2');
    countElement.textContent = `${filteredJobs.length} sur ${allJobs.length} offres disponibles`;
}


// ========= Fonctions rendu =========

//Offres sur page actu
function renderJobs() {
    const jobListings = document.querySelector('.job-listings');

    //Suppr offres actu sauf titre et pagination
    const titleElement = jobListings.querySelector('h2');
    const paginationElement = jobListings.querySelector('.pagination');

    jobListings.innerHTML = '';
    jobListings.appendChild(titleElement);

    //Calcul offre afficher page actu
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredJobs.length);
    const jobsToDisplay = filteredJobs.slice(startIndex, endIndex);

    //Création + ajout carte offres
    jobsToDisplay.forEach(job => {
        jobListings.appendChild(createJobCard(job));
    });

    //Ajout pagination
    if (paginationElement) {
        jobListings.appendChild(paginationElement);
    } else {
        const newPagination = createPaginationElement();
        jobListings.appendChild(newPagination);
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
function createJobCard(job) {
    const jobCard = document.createElement("div");
    jobCard.className = 'job-card';
    jobCard.setAttribute('data-job-id', job.id);

    // Échapper les données pour éviter les attaques XSS
    const safeTitle = escapeHtml(job.title);
    const safeLocation = escapeHtml(job.location);
    const safeContract = escapeHtml(job.contract);
    const safeDate = escapeHtml(job.date);
    const safeDescription = escapeHtml(job.description);
    const safeSalary = escapeHtml(job.salary);

    jobCard.innerHTML = `
        <div class="job-content">
            <div class="job-info">
                <div class="company-logo">
                    <img src="${job.logo || 'assets/images/default-logo.png'}" alt="Logo entreprise" onerror="this.src='assets/images/default-logo.png'">
                </div>
                <div class="job-details">
                    <h3 class="job-title">${safeTitle}</h3>
                    <div class="job-meta">
                        <div class="job-location"><i class="fas fa-map-marker-alt"></i> ${safeLocation}</div>
                        <div class="job-contract"><i class="fas fa-file-contract"></i> ${safeContract}</div>
                        <div class="job-date"><i class="fas fa-calendar-alt"></i> Publié le ${safeDate}</div>
                    </div>
                    <p class="job-description">${safeDescription}</p>
                    <div class="job-skills">
                        ${job.skills.map(skill => `<span class="skill-tag">${escapeHtml(skill)}</span>`).join('')}
                    </div>
                    <div class="job-additional">
                        <span class="job-salary"><i class="fas fa-euro-sign"></i> ${safeSalary}</span>
                        <span class="job-applicants"><i class="fas fa-users"></i> ${job.applicants} candidats</span>
                    </div>
                </div>
            </div>
            <div class="job-actions">
                <a href="candidature.html?id=${job.id}" class="view-more-btn">Postuler</a>
            </div>
        </div>
    `;

    //EventListener "VoirPlus"
    const viewMoreBtn = jobCard.querySelector('.view-more-btn');
    viewMoreBtn.addEventListener('click', function(e) {
        e.preventDefault();
        viewJobDetails(job.id);
    });

    return jobCard;
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
    const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

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
    filterJobs();
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
            const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
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
        renderJobs();
        renderPagination();

        //Défilage vers le haut
        document.querySelector('.job-listings').scrollIntoView({ behavior: 'smooth' });
    }
}

//Affichage détails offre
function viewJobDetails(jobId) {
    //A IMPLEMENTER : Redirection vers la page de détails ou affichage modal
    console.log(`Voir détails de l'offre ${jobId}`);

    //A IMPLEMENTER : Redirection vers une page de détails
    window.location.href = `candidature.html?id=${jobId}`;
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
        filterJobs();
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
async function fetchJobsFromAPI(params = {}) {
    try {
        //Construction URL avec params
        const queryParams = new URLSearchParams();
        if (params.query) queryParams.set('query', params.query);
        if (params.location) queryParams.set('location', params.location);
        if (params.page) queryParams.set('page', params.page);

        const apiUrl = `/api/jobs?${queryParams.toString()}`;

        //Affichage indicateur chargement
        showLoadingState();

        //Appel API
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erreur : ${response.status}`);
        }

        const data = await response.json();

        //Màj données
        allJobs = data.jobs || [];
        filteredJobs = [...allJobs];

        //Màj affichage
        updateJobCount();
        renderJobs();
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

    document.querySelector('.job-listings').appendChild(loadingElement);
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

    document.querySelector('.job-listings').appendChild(errorElement);

    // Masquer le message après 5 secondes
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}