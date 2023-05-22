var url = "https://www.clientestotvssm.com.br/";
// var url = "";

function login() {
    localStorage.setItem("usuariolide", "");
    var email = $("#email").val();
    var senha = $("#senha").val();
    if (senha != "" && email != "") {
        let obj = {
            "email": email,
            "senha": senha
        }
        efetuarRequisicao("login-portal.php", obj, function(retorno) {
            console.log("RETORNO", retorno)
            if (retorno.success) {
                FLUIGC.toast({
                    message: "Login efetuado com sucesso!",
                    type: 'success'
                });
                localStorage.setItem("usuariolide", CryptoJS.AES.encrypt(JSON.stringify(retorno.usuario), "LIDE"));
                // window.location.href = '/admin-app-fatec'
                window.location.href = '/admin-app-fatec'
            } else {
                FLUIGC.toast({
                    message: retorno.message,
                    type: 'danger'
                });
                localStorage.setItem("usuariolide", "");
            }
        });
    }


}

function efetuarRequisicao(endpoint, obj, callback) {

    FLUIGC.loading(window).show();

    $.post(url + 'appfatec/' + endpoint,
        JSON.stringify(obj),
        function(resposta) {
            console.log(resposta);
            //if (resposta.STATUS == "SUCCESS") {

            var objResposta = resposta;

            /*try {
                objResposta = JSON.parse(resposta);
            } catch (e) {
                FLUIGC.toast({
                    message: "ERRO DO WS: " + resposta,
                    type: 'danger'
                });
                FLUIGC.loading(window).hide();
                return;
            }*/

            callback.apply(null, [objResposta])

            /*} else if (resposta.STATUS == "ERROR") {
                FLUIGC.toast({
                    message: "ERRO DO WS (E): " + resposta.MENSAGEM,
                    type: 'danger'
                });
            }*/
        },
        "json"
    ).fail(function(retorno) {
        FLUIGC.toast({
            message: "Erro ao chamar WS: " + erro,
            type: 'danger'
        });
    }).always(function(retorno) {

        FLUIGC.loading(window).hide();
    });

}