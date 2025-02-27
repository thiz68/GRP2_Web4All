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

//DONNEES DE TEST - SIMULATION D'UNE API
const mockJobs = [
    //Emplois de test
    {
        id: 1,
        title: "Deputy Manager - BCM Team Lead",
        location: "Chennai",
        contract: "Salarié - Contrat à Durée Indéterminée",
        date: "25/1/2025",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in metus euismod, finibus massa a, tincidunt lorem.",
        skills: ["Management", "BCM", "Leadership"],
        salary: "45000 - 55000 €/an",
        applicants: 12,
        logo: ""
    },
    {
        id: 2,
        title: "AP25 - BAC+5 - Apprenti Compliance Evaluation des tiers (H/F)",
        location: "Boulogne Billancourt",
        contract: "Apprenti/Doctorant (durée déterminée)",
        date: "25/1/2025",
        description: "Integer lacinia, nunc vel convallis lacinia, enim urna convallis magna, at commodo sem magna id nisi. Suspendisse pulvinar libero ac leo lobortis egestas.",
        skills: ["Compliance", "Audit", "BAC+5"],
        salary: "1200 - 1500 €/mois",
        applicants: 8,
        logo: ""
    },
    {
        id: 3,
        title: "Graduate Program Corporate Excellence: Immobilier et Services généraux",
        location: "Guyancourt",
        contract: "Salarié - Contrat à Durée Indéterminée",
        date: "25/1/2025",
        description: "Mauris tincidunt quam ut lacus feugiat, ut volutpat enim varius. Nunc et sapien nec metus semper tincidunt at vel turpis.",
        skills: ["Immobilier", "Graduate Program", "Corporate"],
        salary: "38000 - 42000 €/an",
        applicants: 5,
        logo: ""
    },
    {
        id: 4,
        title: "Chef de projet marketing digital (H/F)",
        location: "Paris",
        contract: "Stage (6 mois)",
        date: "24/1/2025",
        description: "Etiam euismod libero sit amet nisl finibus, vel fermentum arcu aliquam. Suspendisse potenti.",
        skills: ["Marketing Digital", "SEO", "Réseaux Sociaux"],
        salary: "1100 €/mois",
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

