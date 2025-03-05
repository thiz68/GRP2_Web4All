        // Fonction de validation d'email
        function validateEmail(email) {
            // Vérifie la présence de @ et de .
            if (!email.includes('@')) {
                return false;
            }

            // Vérifie que @ n'est pas au début ou à la fin
            const parts = email.split('@');
            if (parts.length !== 2 || parts[0].length === 0 || parts[1].length === 0) {
                return false;
            }

            // Vérifie la présence d'un point après @
            const domainParts = parts[1].split('.');
            if (domainParts.length < 2 || domainParts[domainParts.length - 1].length < 2) {
                return false;
            }

            // Vérifie qu'il n'y a pas de caractères spéciaux consécutifs
            if (/[.@]{2,}/.test(email)) {
                return false;
            }

            return true;
        }

        // Validation en temps réel
        document.getElementById('email').addEventListener('input', function() {
            const emailInput = this;
            const emailError = document.getElementById('emailError');

            if (validateEmail(emailInput.value)) {
                emailInput.classList.remove('invalid');
                emailError.style.display = 'none';
            } else {
                emailInput.classList.add('invalid');
                emailError.style.display = 'block';
            }
        });

        // Validation à la soumission du formulaire
        document.getElementById('studentForm').addEventListener('submit', function(event) {
            event.preventDefault();
            
            const nomInput = document.getElementById('nom');
            const prenomInput = document.getElementById('prenom');
            const emailInput = document.getElementById('email');
            const emailError = document.getElementById('emailError');

            // Validation de tous les champs
            let isValid = true;

            // Validation du nom
            if (nomInput.value.trim() === '') {
                nomInput.classList.add('invalid');
                isValid = false;
            } else {
                nomInput.classList.remove('invalid');
            }

            // Validation du prénom
            if (prenomInput.value.trim() === '') {
                prenomInput.classList.add('invalid');
                isValid = false;
            } else {
                prenomInput.classList.remove('invalid');
            }

            // Validation de l'email
            if (!validateEmail(emailInput.value)) {
                emailInput.classList.add('invalid');
                emailError.style.display = 'block';
                isValid = false;
            } else {
                emailInput.classList.remove('invalid');
                emailError.style.display = 'none';
            }

            // Si tout est valide, soumettre le formulaire
            if (isValid) {
                alert('Formulaire soumis avec succès !');
                // Ici, vous pourriez ajouter une logique d'envoi de formulaire
            }
        });

        function resetForm() {
            document.getElementById('studentForm').reset();
            
            // Réinitialiser les classes et messages d'erreur
            document.getElementById('nom').classList.remove('invalid');
            document.getElementById('prenom').classList.remove('invalid');
            document.getElementById('email').classList.remove('invalid');
            document.getElementById('emailError').style.display = 'none';
        }

        function goBack() {
            window.history.back();
        }

        // Fonction pour valider le numéro de téléphone
function validatePhoneInput() {
    const telInput = document.getElementById('tel');
    
    // Écouteur d'événement pour empêcher l'entrée de lettres
    telInput.addEventListener('input', function(e) {
        // Remplace tous les caractères non-numériques par une chaîne vide
        this.value = this.value.replace(/[^\d+\s()-]/g, '');
    });

    // Validation à la soumission du formulaire
    telInput.addEventListener('blur', function() {
        const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
        const errorMessage = document.createElement('div');
        errorMessage.id = 'telError';
        errorMessage.style.color = 'red';
        errorMessage.style.fontSize = '0.8em';
        errorMessage.style.marginTop = '5px';

        // Supprime toute erreur précédente
        const existingError = document.getElementById('telError');
        if (existingError) {
            existingError.remove();
        }

        // Vérifie la validité du numéro de téléphone
        if (this.value.trim() !== '' && !phoneRegex.test(this.value)) {
            this.classList.add('invalid');
            errorMessage.textContent = 'Veuillez entrer un numéro de téléphone valide';
            this.parentNode.insertBefore(errorMessage, this.nextSibling);
        } else {
            this.classList.remove('invalid');
        }
    });
}

// Appeler la fonction de validation
validatePhoneInput();