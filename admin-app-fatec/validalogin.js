$(document).ready(function() {
    var encryptedAES = localStorage.getItem("usuariolide");
    if (encryptedAES != null && encryptedAES != undefined && encryptedAES != "") {
        var decryptedBytes = CryptoJS.AES.decrypt(encryptedAES, "LIDE");
        var plaintext = decryptedBytes.toString(CryptoJS.enc.Utf8);
        try {
            if (plaintext != null && plaintext != undefined && plaintext != "") {
                let obj = JSON.parse(plaintext);
            } else {
                window.location.href = "/admin-app-fatec/login";
            }
        } catch (error) {
            window.location.href = "/admin-app-fatec/login";
        }
    } else {
        window.location.href = "/admin-app-fatec/login";
    }
});