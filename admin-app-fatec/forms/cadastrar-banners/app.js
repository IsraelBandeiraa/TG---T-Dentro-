$(document).ready(function() {
    console.log("ready!");
    $("#navbar").load("../../header.html");
    carregaPaiFilho();
});

var url = "https://www.clientestotvssm.com.br/";
var contadoresPaiFilho = {};

var eventos = null;
var editor = null;
var qtdImagens = 0;

function carregarPagina() {
    console.log("carregando pagina");
    $('#processTabs', window.parent.document).hide();
    $('#textActivity', window.parent.document).hide();
    $('#breadcrumb', window.parent.document).hide();

    $('#page-header', window.parent.document).hide();
    $('#collapse-tabs', window.parent.document).hide();
    $('#centerContainer', window.parent.document).hide();
    $("#workflowActions", window.parent.document).show();
    $("#fixedTopBar", window.parent.document).show();
    $(".fixedTopBar", window.parent.document).remove();
    setTimeout(function() { $("body").css('padding-top', '0px'); }, 1000);

    exibirDados();

}

function exibirDados() {
    console.log("function exibirDados");
    var obj = {
        "eventoid": $("#idEvento").val()
    }
    efetuarRequisicao("getImagemEvento.php", obj, function(retorno) {
        console.log("RETORNO", retorno)
        if (retorno.dados) {
            for (item in retorno.dados) {
                adicionarImagem(retorno.dados[item]);
            }
        }
    });

}

function adicionarImagem(objeto) {

    var row = customWdkAddChild('imagens');
    if (!objeto) {
        $("#idImagem___" + row).val("NOVO");
        $("#imagem64Evento___" + row).html("0.png");
        $("#falseinputEvento___" + row).attr("src", "0.png");
        $('#linkImagem___' + row).val("");
    } else {
        $("#idImagem___" + row).val(objeto.id);
        $("#imagem64Evento___" + row).html(objeto.imagem);
        $("#falseinputEvento___" + row).attr("src", objeto.imagem);
        $('#linkImagem___' + row).val(objeto.link);
    }
}

function limparDados() {

    $("input[name^=idImagem___]").each(function() {
        customFnWdkRemoveChild(this);
    });

}

function substringMatcher(listaObjetos, campo) {
    return function findMatches(q, cb) {
        var matches, substrRegex;
        matches = [];
        substrRegex = new RegExp(q, 'i');
        $.each(listaObjetos, function(i, objeto) {
            if (substrRegex.test(objeto[campo])) {
                matches.push(objeto);
            }
        });
        cb(matches);
    };
}

function readURL(input) {
    var row = input.name.split("___")[1];
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#falseinputEvento___' + row).attr('src', e.target.result);
            $('#imagem64Evento___' + row).html(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

var enviando = new Object();

function enviarEvento() {

    FLUIGC.loading(window).show();

    FLUIGC.toast({
        message: "Salvando imagens",
        type: 'info'
    });

    $("input[name^=idImagem___]").each(function() {
        var row = this.name.split("___")[1];
        enviando[row] = true;
        var idcampo = $("#idImagem___" + row).val();
        var tipo = "UPDATE"
        if (idcampo == 'NOVO') {
            tipo = "INSERT"
        }
        var obj = {
            "idcampo": idcampo,
            "tipo": tipo,
            "tabela": "eventoimagem",
            "dados": {
                "eventoid": $('#idEvento').val(),
                "imagem": $('#imagem64Evento___' + row).html(),
                "link": $('#linkImagem___' + row).val()
            }
        };
        efetuarRequisicao("alterarImagem.php", obj, function(retorno) {
            if (retorno.success) {
                enviando[row] = false;
                FLUIGC.toast({
                    message: retorno.message,
                    type: 'success'
                });
                var estaEnviando = false;
                for (item in enviando) {
                    if (enviando[item]) {
                        estaEnviando = true;
                    }
                }
                if (!estaEnviando) {
                    FLUIGC.loading(window).hide();
                    limparDados();
                }
            } else {
                FLUIGC.toast({
                    message: 'ERRO: ' + retorno.message,
                    type: 'warning'
                });
            }
        });
    });

}

function removerLinha(elemento) {

    Swal({
        title: 'Atenção',
        html: "Confima a exclusão do banner?",
        type: 'info',
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#D8D8D8',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
    }).then(function(result) {
        if (result.value) {

            var row = elemento.id.split("___")[1];
            var idcampo = $("#idImagem___" + row).val();
            if (idcampo != "NOVO") {
                FLUIGC.loading(window).show();
                var tipo = "DELETE"
                var obj = {
                    "idcampo": idcampo,
                    "tipo": tipo,
                    "tabela": "eventoimagem",
                    "dados": {
                        "eventoid": $('#idEvento').val(),
                        "imagem": "",
                        "link": ""
                    }
                };
                efetuarRequisicao("alterarImagem.php", obj, function(retorno) {
                    if (retorno.success) {
                        FLUIGC.toast({
                            message: retorno.message,
                            type: 'success'
                        });
                        FLUIGC.loading(window).hide();
                        customFnWdkRemoveChild(elemento);
                    } else {
                        FLUIGC.toast({
                            message: 'ERRO: ' + retorno.message,
                            type: 'warning'
                        });
                    }
                });
            } else {
                customFnWdkRemoveChild(elemento);
            }

        }
    });
}

function efetuarRequisicao(endpoint, obj, callback) {

    FLUIGC.loading(window).show();

    $.post(url + 'apptsm/' + endpoint,
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

function carregaPaiFilho() {
    var tables = $(".pai-filho");

    $.each(tables, function(index, table) {
        console.log(table);
        let linhaModelo = $(table).find('tbody').find('tr');
        console.log(linhaModelo);
        if (linhaModelo.length > 0) {
            $(linhaModelo[0]).hide();
        }
        contadoresPaiFilho[$(table).attr("tablename")] = 0;
    });
}

function customWdkAddChild(tablename) {
    console.log("Adicionado linha na tabela " + tablename);
    var corpoTabela = $("[tablename=" + tablename + "]").find('tbody');
    var linhaModelo = $("[tablename=" + tablename + "]").find('tbody').find('tr');
    if (linhaModelo.length > 0) {
        console.log("Adicionado linha no corpo da tabela " + tablename);
        $(corpoTabela).append("<tr>" + linhaModelo[0].innerHTML + "</tr>");
        contadoresPaiFilho[tablename]++;
        var idNovaLinha = contadoresPaiFilho[tablename];
        var novaLinha = $("[tablename=" + tablename + "]").find('tbody').find('tr').last();
        $(novaLinha).find("input:text, input:radio, input:file, select, img, textarea, i, div, span").each(function(index, input) {
            if ($(input).attr("id") != undefined) {
                $(input).attr("id", $(input).attr("id") + "___" + idNovaLinha);
            }
            if ($(input).attr("name") != undefined) {
                $(input).attr("name", $(input).attr("name") + "___" + idNovaLinha);
            }
        });
    }
    return contadoresPaiFilho[tablename];
}

function customFnWdkRemoveChild(element) {
    $(element).closest("tr").remove();
}