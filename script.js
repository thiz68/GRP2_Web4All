document.getElementById('name').addEventListener('input', function() {this.value = this.value.toUpperCase();});


function fonction_verification_password(event) {
    const pass = document.getElementById('password').value;
    const pass_v = document.getElementById('password_verif').value;

    if (pass != pass_v) {
        alert("Les mots de passe ne sont pas identiques");
        event.preventDefault();
        return false;
    }
}