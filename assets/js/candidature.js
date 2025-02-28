// Variables globales
let jobId = null;
let lastScrollPosition = window.pageYOffset;
let scrollThreshold = 100;

// Mocks pour simulations
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
    {
        id: 3,
        title: "Graduate Program Corporate Excellence: Immobilier et Services généraux",
        company: "Real Estate Corp",
        location: "Guyancourt",
        contract: "Salarié - Contrat à Durée Indéterminée",
        date: "25/1/2025",
        description: "Mauris tincidunt quam ut lacus feugiat, ut volutpat enim varius. Nunc et sapien nec metus semper tincidunt at vel turpis. Etiam euismod libero sit amet nisl finibus, vel fermentum arcu aliquam. Suspendisse potenti.<br><br>Sed laoreet diam at metus eleifend, id tincidunt nisi vulputate. Nam varius lacus id nulla hendrerit, ac euismod odio laoreet.<br><br>Profil recherché :<br>- Diplôme d'école de commerce ou d'ingénieur<br>- Forte capacité d'adaptation<br>- Excellente communication écrite et orale<br>- Esprit d'analyse et de synthèse",
        skills: ["Immobilier", "Graduate Program", "Corporate", "Management", "Services Généraux"],
        salary: "38000 - 42000 €/an",
        applicants: 5,
        logo: ""
    },
    {
        id: 4,
        title: "Chef de projet marketing digital (H/F)",
        company: "Digital Agency",
        location: "Paris",
        contract: "Stage (6 mois)",
        date: "24/1/2025",
        description: "Etiam euismod libero sit amet nisl finibus, vel fermentum arcu aliquam. Suspendisse potenti. Sed laoreet diam at metus eleifend, id tincidunt nisi vulputate.<br><br>Nam varius lacus id nulla hendrerit, ac euismod odio laoreet. Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br><br>Missions principales :<br>- Élaboration et suivi de campagnes marketing<br>- Analyse des performances<br>- Optimisation SEO/SEA<br>- Gestion des réseaux sociaux<br>- Coordination avec les équipes créatives",
        skills: ["Marketing Digital", "SEO", "Réseaux Sociaux", "Analytics", "Gestion de projet"],
        salary: "1100 €/mois",
        applicants: 15,
        logo: ""
    },
    {
        id: 5,
        title: "Développeur Full Stack JavaScript (H/F)",
        company: "Tech Innovators",
        location: "Lyon",
        contract: "Salarié - Contrat à Durée Indéterminée",
        date: "24/1/2025",
        description: "Sed laoreet diam at metus eleifend, id tincidunt nisi vulputate. Nam varius lacus id nulla hendrerit, ac euismod odio laoreet. Lorem ipsum dolor sit amet, consectetur adipiscing elit.<br><br>Curabitur in metus euismod, finibus massa a, tincidunt lorem. Maecenas tincidunt quam ut lacus feugiat, ut volutpat enim varius.<br><br>Compétences techniques requises :<br>- Maîtrise de JavaScript/TypeScript<br>- Expérience avec React et Node.js<br>- Connaissance des bases de données SQL et NoSQL<br>- Méthodologies Agile<br>- DevOps (CI/CD, Docker)",
        skills: ["JavaScript", "React", "Node.js", "MongoDB", "Express"],
        salary: "45000 - 55000 €/an",
        applicants: 23,
        logo: ""
    }
];

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", function() {
    // Vérification connexion utilisateur
    // Note: Cette partie est commentée car elle serait gérée côté backend
    // checkUserAuthentication();

    // Extraction ID de l'offre depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    jobId = urlParams.get('id');

    if (!jobId) {
        showError("Aucune offre spécifiée.");
        return;
    }

    // Configuration des écouteurs d'événements
    setupEventListeners();

    // Chargement des détails de l'offre
    loadJobDetails(jobId);

    // Création du bouton BackToTop
    createBackToTopButton();
});

// Configuration des écouteurs d'événements
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

// Gestion du défilement pour cacher/afficher la navbar
function handleScroll() {
    const navbar = document.querySelector('.navbar');
    const currentScrollPosition = window.pageYOffset;

    // Affichage/masquage du bouton BackToTop
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        if (currentScrollPosition > 200) {
            backToTopButton.classList.add('visible');
        } else {
            backToTopButton.classList.remove('visible');
        }
    }

    // Affichage/masquage de la navbar
    if (navbar) {
        if (currentScrollPosition > lastScrollPosition && currentScrollPosition > scrollThreshold) {
            navbar.classList.add('hidden');
        } else {
            navbar.classList.remove('hidden');
        }
    }

    lastScrollPosition = currentScrollPosition;
}

// Création du bouton BackToTop
function createBackToTopButton() {
    const backToTopButton = document.createElement('div');
    backToTopButton.className = 'back-to-top';
    backToTopButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
    backToTopButton.addEventListener('click', scrollToTop);
    document.body.appendChild(backToTopButton);
}

// Fonction pour remonter en haut de la page
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

// Chargement des détails de l'offre
function loadJobDetails(jobId) {
    // Affichage de l'indicateur de chargement
    document.getElementById('loading-indicator').style.display = 'flex';
    document.getElementById('job-details-container').style.display = 'none';
    document.getElementById('error-container').style.display = 'none';

    // Simulation d'un appel API avec un délai artificiel
    setTimeout(() => {
        try {
            // Recherche de l'offre dans les mocks
            const job = mockJobs.find(job => job.id === parseInt(jobId));

            if (!job) {
                showError("L'offre demandée n'existe pas.");
                return;
            }

            // Mise à jour du fil d'Ariane
            document.getElementById('breadcrumb-title').textContent = job.title;

            // Mise à jour des détails de l'offre
            document.getElementById('job-title').textContent = job.title;
            document.getElementById('job-company').querySelector('span').textContent = job.company;
            document.getElementById('job-location').querySelector('span').textContent = job.location;
            document.getElementById('job-contract').querySelector('span').textContent = job.contract;
            document.getElementById('job-date').querySelector('span').textContent = `Publié le ${job.date}`;
            document.getElementById('job-description').innerHTML = job.description;

            // Mise à jour des compétences
            const skillsContainer = document.getElementById('job-skills');
            skillsContainer.innerHTML = '';
            job.skills.forEach(skill => {
                const skillTag = document.createElement('span');
                skillTag.className = 'skill-tag';
                skillTag.textContent = skill;
                skillsContainer.appendChild(skillTag);
            });

            // Mise à jour des informations complémentaires
            document.getElementById('job-salary').textContent = job.salary || 'Non communiqué';
            document.getElementById('job-applicants').textContent =
                `${job.applicants} candidat${job.applicants > 1 ? 's' : ''}`;

            // Mise à jour du logo de l'entreprise si disponible
            const companyLogo = document.getElementById('company-logo');
            if (job.logo && job.logo.trim() !== '') {
                companyLogo.src = job.logo;
            } else {
                companyLogo.src = 'assets/images/default-logo.png';
            }

            // Affichage du conteneur de détails
            document.getElementById('loading-indicator').style.display = 'none';
            document.getElementById('job-details-container').style.display = 'block';
            document.getElementById('application-form-section').style.display = 'block';

        } catch (error) {
            showError("Une erreur s'est produite lors du chargement des détails de l'offre.");
            console.error(error);
        }
    }, 800); // Délai simulé de 800ms
}

// Affichage d'un message d'erreur
function showError(message) {
    document.getElementById('loading-indicator').style.display = 'none';
    document.getElementById('job-details-container').style.display = 'none';

    const errorContainer = document.getElementById('error-container');
    errorContainer.style.display = 'block';
    errorContainer.querySelector('p').textContent = message;
}

// Mise à jour du compteur de caractères pour la lettre de motivation
function updateCharacterCount() {
    const motivationLetter = document.getElementById('motivation-letter');
    const charCount = document.getElementById('char-count');

    if (motivationLetter && charCount) {
        const currentLength = motivationLetter.value.length;
        charCount.textContent = currentLength;

        // Mise en surbrillance du compteur si proche de la limite
        if (currentLength > 1800) {
            charCount.style.color = '#e67e22'; // Orange
        } else if (currentLength > 1950) {
            charCount.style.color = '#c0392b'; // Rouge
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

    // Simulation de l'envoi des données à l'API

    // Dans un cas réel, nous utiliserions FormData et fetch/axios
    const formData = new FormData();
    formData.append('jobId', jobId);
    formData.append('motivationLetter', motivationLetter);
    formData.append('resume', resumeFile);
    formData.append('applicationDate', new Date().toISOString());

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
        console.log('CV:', resumeFile.name);

        // Dans un environnement réel, on pourrait rediriger l'utilisateur ou mettre à jour l'interface
    }, 1500);
}

// Vérification de l'authentification de l'utilisateur (à implémenter avec backend)
function checkUserAuthentication() {
    // Simulation - À implémenter avec une vérification réelle côté backend
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated) {
        // Redirection vers la page de connexion
        window.location.href = 'connexion.html?redirect=' + encodeURIComponent(window.location.href);
    }
}

// Fonction de sécurité pour échapper le HTML et prévenir les XSS
function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}