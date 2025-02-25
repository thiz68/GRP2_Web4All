document.addEventListener("DOMContentLoaded", function() {
    let connectForm = document.getElementById("connect-form");
    let emailInput = document.getElementById("emailInput");
    let passwordInput = document.getElementById("passwordInput");
    let errorMsg = document.getElementById("errorMsg");

    connectForm.addEventListener("submit", function (event) {
        errorMsg.innerHTML = "";
        errorMsg.style.display = "none";

        let regex_email = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))/i;
        let regex_password = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

        let errors = [];

        if (emailInput.value.trim() === "") {
            errors.push("L'email est requis.");
        } else if (!regex_email.test(emailInput.value)) {
            errors.push("L'adresse email est invalide.");
        }

        if (passwordInput.value.trim() === "") {
            errors.push("Le mot de passe est requis.");
        } else if (!regex_password.test(passwordInput.value)) {
            errors.push("Le mot de passe est incorrect.");
        }

        if (errors.length > 0) {
            errorMsg.innerHTML = errors.join("<br>");
            errorMsg.style.display = "block";
            event.preventDefault();
        }
    });
});
