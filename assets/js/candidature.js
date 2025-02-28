// ========= Variables globales =========
let jobId = null;
let lastScrollPosition = window.pageYOffset;
let scrollThreshold = 100;
let jobData = null;

// ========= Mocks pour simulations =========
const mockJobs = [
    {
        id: 1,
        title: "Deputy Manager - BCM Team Lead",
        company: "Tech Solutions Inc.",
        location: "Chennai",
        contract: "Salarié - Contrat à Durée Indéterminée",
        date: "25/1/2025",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur in metus euismod, finibus massa a, tincidunt lorem. Maecenas tincidunt quam ut lacus feugiat, ut volutpat enim varius. Nunc et sapien nec metus semper tincidunt at vel turpis. Etiam euismod libero sit amet nisl finibus, vel fermentum arcu aliquam. Suspendisse potenti.<br><br>Sed laoreet diam at metus eleifend, id tincidunt nisi vulputate. Nam varius lacus id nulla hendrerit, ac euismod odio laoreet.<br><br>Nos attentes :<br>- Minimum 5 ans d'expérience<br>- Excellentes capacités de communication<br>- Esprit d'équipe<br>- Rigueur et sens de l'organisation",
        skills: ["Management", "BCM", "Leadership", "Communication", "Anglais courant"],
        salary: "45000 - 55000 €/an",
        applicants: 12,
        logo: ""
    },
    {
        id: 2,
        title: "AP25 - BAC+5 - Apprenti Compliance Evaluation des tiers (H/F)",
        company: "Finance Group",
        location: "Boulogne Billancourt",
        contract: "Apprenti/Doctorant (durée déterminée)",
        date: "25/1/2025",
        description: "Integer lacinia, nunc vel convallis lacinia, enim urna convallis magna, at commodo sem magna id nisi. Suspendisse pulvinar libero ac leo lobortis egestas.<br><br>Mauris tincidunt quam ut lacus feugiat, ut volutpat enim varius. Nunc et sapien nec metus semper tincidunt at vel turpis.<br><br>Vos responsabilités :<br>- Participation aux audits internes<br>- Analyse des documents de conformité<br>- Rédaction de rapports<br>- Support aux équipes opérationnelles",
        skills: ["Compliance", "Audit", "BAC+5", "Finance", "Analyse de données"],
        salary: "1200 - 1500 €/mois",
        applicants: 8,
        logo: ""
    },
    // Autres offres...
];

// ========= Fonction d'Initialisation =========
document.addEventListener("DOMContentLoaded", function() {
    // Extraction ID de l'offre depuis l'URL
    parseUrlParams();

    // Configuration des écouteurs d'événements
    setupEventListeners();

    // Vérification connexion utilisateur
    checkUserAuthentication();

    // Chargement des détails de l'offre
    fetchJobDetails(jobId);

    // Création du bouton BackToTop
    createBackToTopButton();
});

// ========= Fonctions parsing URL =========
function parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    jobId = urlParams.get('id');

    if (!jobId) {
        showError("Aucune offre spécifiée.");
        return;
    }
}

// ========= Configuration des écouteurs d'événements =========
function setupEventListeners() {
    // Gestion du scroll
    window.addEventListener('scroll', handleScroll);

    // Gestion du compteur de caractères pour la lettre de motivation
    const motivationLetter = document.getElementById('motivation-letter');
    if (motivationLetter) {
        motivationLetter.addEventListener('input', updateCharacterCount);
    }

    // Gestion du téléversement de fichier CV
    const resumeUpload = document.getElementById('resume-upload');
    if (resumeUpload) {
        resumeUpload.addEventListener('change', handleFileUpload);
    }

    // Gestion de la soumission du formulaire
    const applicationForm = document.getElementById('application-form');
    if (applicationForm) {
        applicationForm.addEventListener('submit', handleFormSubmit);
    }

    // Vérification des champs pour activer/désactiver le bouton de soumission
    setInterval(validateForm, 500);
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
            if (navbar) navbar.classList.add('hidden');
        } else {
            // Si on scroll vers le haut, on affiche la navbar
            if (navbar) navbar.classList.remove('hidden');
        }
    }

    // Gestion BackToTop
    if (backToTop) {
        if (currentScrollPosition > scrollThreshold * 2) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    lastScrollPosition = currentScrollPosition;
}

// ========= Gestion BackToTop =========
function createBackToTopButton() {
    const backToTop = document.createElement('div');
    backToTop.className = 'back-to-top';
    backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';

    backToTop.addEventListener('click', scrollToTop);
    document.body.appendChild(backToTop);
}

// Fonction pour remonter en haut de la page
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// ========= Fonctions Gestion Données =========

// Récupération des détails de l'offre
function fetchJobDetails(jobId) {
    // Affichage de l'indicateur de chargement
    showLoadingState();

    // En environnement réel, utiliser cette fonction pour l'API
    // fetchJobDetailsFromAPI(jobId);

    // Simulation d'un appel API avec un délai artificiel pour dev
    simulateFetchJobDetails(jobId);
}

// Simulation de récupération - À remplacer par appel API réel
function simulateFetchJobDetails(jobId) {
    setTimeout(() => {
        try {
            // Recherche de l'offre dans les mocks
            const job = mockJobs.find(job => job.id === parseInt(jobId));

            if (!job) {
                showError("L'offre demandée n'existe pas.");
                return;
            }

            // Stockage des données pour utilisation ultérieure
            jobData = job;

            // Mise à jour de l'interface avec les données
            renderJobDetails(job);

        } catch (error) {
            showError("Une erreur s'est produite lors du chargement des détails de l'offre.");
            console.error(error);
        } finally {
            hideLoadingState();
        }
    }, 800); // Délai simulé de 800ms
}

// ========= Fonctions à implémenter avec backend =========
async function fetchJobDetailsFromAPI(jobId) {
    try {
        // Affichage indicateur chargement
        showLoadingState();

        // Construction URL API
        const apiUrl = `/api/jobs/${jobId}`;

        // Appel API
        const response = await fetch(apiUrl);

        if (!response.ok) {
            throw new Error(`Erreur: ${response.status}`);
        }

        const data = await response.json();

        // Stockage des données pour utilisation ultérieure
        jobData = data;

        // Mise à jour de l'interface avec les données
        renderJobDetails(data);

    } catch (error) {
        console.error("Erreur lors de la récupération des détails de l'offre:", error);
        showError("Impossible de charger les détails de l'offre. Veuillez réessayer plus tard.");
    } finally {
        hideLoadingState();
    }
}

// Fonction pour soumettre la candidature à l'API
async function submitApplicationToAPI(formData) {
    try {
        // Affichage état chargement
        document.getElementById('application-form').style.opacity = '0.5';
        document.getElementById('submit-application').disabled = true;
        document.getElementById('submit-application').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

        // Construction URL API
        const apiUrl = `/api/applications`;

        // Appel API
        const response = await fetch(apiUrl, {
            method: 'POST',
            body: formData,
            // Pas de header Content-Type avec FormData, il est automatiquement défini
        });

        if (!response.ok) {
            throw new Error(`Erreur: ${response.status}`);
        }

        const data = await response.json();

        // Traitement de la réponse
        if (data.success) {
            // Cacher le formulaire et afficher le message de succès
            document.getElementById('application-form').style.display = 'none';
            document.getElementById('success-message').style.display = 'flex';
        } else {
            throw new Error(data.message || "Erreur lors de l'envoi de la candidature");
        }

    } catch (error) {
        console.error("Erreur lors de l'envoi de la candidature:", error);
        showApplicationError("Une erreur s'est produite lors de l'envoi de votre candidature. Veuillez réessayer plus tard.");
    }
}

// ========= Fonctions rendu =========
function renderJobDetails(job) {
    // Sécurisation des données pour éviter XSS
    const safeTitle = escapeHtml(job.title);
    const safeCompany = escapeHtml(job.company);
    const safeLocation = escapeHtml(job.location);
    const safeContract = escapeHtml(job.contract);
    const safeDate = escapeHtml(job.date);

    // Mise à jour du fil d'Ariane
    document.getElementById('breadcrumb-title').textContent = safeTitle;

    // Mise à jour des détails de l'offre
    document.getElementById('job-title').textContent = safeTitle;
    document.getElementById('job-company').querySelector('span').textContent = safeCompany;
    document.getElementById('job-location').querySelector('span').textContent = safeLocation;
    document.getElementById('job-contract').querySelector('span').textContent = safeContract;
    document.getElementById('job-date').querySelector('span').textContent = `Publié le ${safeDate}`;

    // Pour la description, nous permettons certaines balises HTML contrôlées
    // car elles sont nécessaires pour le formatage du texte
    document.getElementById('job-description').innerHTML = job.description;

    // Mise à jour des compétences avec échappement HTML
    const skillsContainer = document.getElementById('job-skills');
    skillsContainer.innerHTML = '';
    job.skills.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.textContent = skill; // textContent applique l'échappement
        skillsContainer.appendChild(skillTag);
    });

    // Mise à jour des informations complémentaires
    document.getElementById('job-salary').textContent = job.salary || 'Non communiqué';
    document.getElementById('job-applicants').textContent = `${job.applicants} candidat${job.applicants > 1 ? 's' : ''}`;

    // Mise à jour du logo de l'entreprise si disponible
    const companyLogo = document.getElementById('company-logo');
    if (job.logo && job.logo.trim() !== '') {
        companyLogo.src = job.logo;
    } else {
        companyLogo.src = 'assets/images/default-logo.png';
    }

    // Affichage du conteneur de détails
    document.getElementById('job-details-container').style.display = 'block';
    document.getElementById('application-form-section').style.display = 'block';
}

// ========= Gestion des états d'affichage =========
function showLoadingState() {
    document.getElementById('loading-indicator').style.display = 'flex';
    document.getElementById('job-details-container').style.display = 'none';
    document.getElementById('error-container').style.display = 'none';
    document.getElementById('application-form-section').style.display = 'none';
}

function hideLoadingState() {
    document.getElementById('loading-indicator').style.display = 'none';
}

// Affichage d'un message d'erreur
function showError(message) {
    hideLoadingState();
    document.getElementById('job-details-container').style.display = 'none';
    document.getElementById('application-form-section').style.display = 'none';

    const errorContainer = document.getElementById('error-container');
    errorContainer.style.display = 'block';
    errorContainer.querySelector('p').textContent = message;
}

// Affichage d'une erreur de candidature
function showApplicationError(message) {
    const errorElement = document.createElement('div');
    errorElement.className = 'application-error';
    errorElement.textContent = message;

    // Réinitialisation de l'état du bouton
    document.getElementById('application-form').style.opacity = '1';
    document.getElementById('submit-application').disabled = false;
    document.getElementById('submit-application').innerHTML = 'Envoyer ma candidature';

    // Ajout du message d'erreur au-dessus du bouton
    const formActions = document.querySelector('.form-actions');
    formActions.parentNode.insertBefore(errorElement, formActions);

    // Masquer le message après 5 secondes
    setTimeout(() => {
        errorElement.remove();
    }, 5000);
}

// ========= Gestion du formulaire de candidature =========
// Mise à jour du compteur de caractères pour la lettre de motivation
function updateCharacterCount() {
    const motivationLetter = document.getElementById('motivation-letter');
    const charCount = document.getElementById('char-count');

    if (motivationLetter && charCount) {
        const currentLength = motivationLetter.value.length;
        charCount.textContent = currentLength;

        // Mise en surbrillance du compteur si proche de la limite
        if (currentLength > 1950) {
            charCount.style.color = '#c0392b'; // Rouge
        } else if (currentLength > 1800) {
            charCount.style.color = '#e67e22'; // Orange
        } else {
            charCount.style.color = ''; // Couleur par défaut
        }
    }
}

// Gestion du téléversement de fichier CV
function handleFileUpload(event) {
    const fileInput = event.target;
    const fileNameElement = document.getElementById('file-name');
    const fileErrorElement = document.getElementById('file-error');

    // Réinitialisation des messages d'erreur
    fileErrorElement.textContent = '';
    fileNameElement.textContent = 'Aucun fichier sélectionné';

    if (fileInput.files.length > 0) {
        const file = fileInput.files[0];

        // Vérification du type de fichier
        const fileType = file.type;
        const allowedTypes = [
            'application/pdf',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/msword'
        ];

        if (!allowedTypes.includes(fileType)) {
            fileErrorElement.textContent = 'Format de fichier non accepté. Veuillez sélectionner un fichier PDF ou DOCX.';
            fileInput.value = ''; // Réinitialiser l'input
            return;
        }

        // Vérification de la taille du fichier (max 2MB)
        const maxSize = 2 * 1024 * 1024; // 2MB en octets
        if (file.size > maxSize) {
            fileErrorElement.textContent = 'Le fichier est trop volumineux. La taille maximale autorisée est de 2MB.';
            fileInput.value = ''; // Réinitialiser l'input
            return;
        }

        // Affichage du nom du fichier
        fileNameElement.textContent = file.name;
    }

    // Validation du formulaire pour activer/désactiver le bouton
    validateForm();
}

// Validation du formulaire
function validateForm() {
    const motivationLetter = document.getElementById('motivation-letter');
    const resumeUpload = document.getElementById('resume-upload');
    const submitButton = document.getElementById('submit-application');
    const fileErrorElement = document.getElementById('file-error');

    let isValid = true;

    // Vérification de la lettre de motivation
    if (!motivationLetter || !motivationLetter.value.trim()) {
        isValid = false;
    }

    // Vérification du CV
    if (!resumeUpload || !resumeUpload.files.length) {
        isValid = false;
    }

    // Vérification qu'il n'y a pas d'erreur de fichier
    if (fileErrorElement && fileErrorElement.textContent !== '') {
        isValid = false;
    }

    // Activation/désactivation du bouton de soumission
    if (submitButton) {
        submitButton.disabled = !isValid;
    }
}

// Gestion de la soumission du formulaire
function handleFormSubmit(event) {
    event.preventDefault();

    const motivationLetter = document.getElementById('motivation-letter').value;
    const resumeFile = document.getElementById('resume-upload').files[0];

    // Vérification finale avant envoi
    if (!motivationLetter.trim() || !resumeFile) {
        return; // Ne pas soumettre si les champs ne sont pas remplis
    }

    // Préparation des données à envoyer
    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('motivationLetter', motivationLetter);
    formData.append('resume', resumeFile);
    formData.append('applicationDate', new Date().toISOString());

    // En environnement réel, utiliser cette fonction
    // submitApplicationToAPI(formData);

    // Simulation pour développement
    simulateSubmitApplication(formData);
}

// Simulation d'envoi de candidature - À remplacer en production
function simulateSubmitApplication(formData) {
    // Simulation d'un appel API avec délai artificiel
    document.getElementById('application-form').style.opacity = '0.5';
    document.getElementById('submit-application').disabled = true;
    document.getElementById('submit-application').innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';

    setTimeout(() => {
        // Simulation d'une réponse réussie
        // Cacher le formulaire et afficher le message de succès
        document.getElementById('application-form').style.display = 'none';
        document.getElementById('success-message').style.display = 'flex';

        // Ajout d'un log pour simulation
        console.log('Candidature soumise pour le poste ID:', jobId);
        console.log('Date de candidature:', new Date().toISOString());
        console.log('Lettre de motivation:', motivationLetter.substring(0, 50) + '...');
        console.log('CV:', formData.get('resume').name);
    }, 1500);
}

// ========= Sécurité =========
// Vérification de l'authentification de l'utilisateur
function checkUserAuthentication() {
    // Simulation - À implémenter avec une vérification réelle côté backend
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    // Dans une application réelle, cette vérification serait côté serveur
    // Pour le moment, version simplifiée côté client pour le développement
    if (!isAuthenticated) {
        // Option 1: Rediriger vers la page de connexion (désactivé pour le développement)
        // window.location.href = 'connexion.html?redirect=' + encodeURIComponent(window.location.href);

        // Option 2: Pour le développement, simuler connexion
        console.log('Utilisateur non authentifié, connexion simulée pour test');
        localStorage.setItem('isAuthenticated', 'true');
    }
}

// Fonction de sécurité pour échapper le HTML et prévenir les XSS
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