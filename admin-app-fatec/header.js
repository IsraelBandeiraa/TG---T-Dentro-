$(document).ready(function() {
    console.log("ready!");
});

function sair() {
    localStorage.setItem("usuariolide", "");
    window.location.href = '/admin-app-fatec/login'
}