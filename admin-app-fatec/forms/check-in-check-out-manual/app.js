$(document).ready(function() {
    console.log("ready!");
    $("#navbar").load("../../header.html");
});
//$("#page-header").hide();
//$("#collapse-tabs").hide();const parentDoc = window.parent.document;

var url = "https://www.clientestotvssm.com.br/";

var filiados = null;
var eventos = null;
var proximoEvento = null;
var atualizarDados = false;

function carregarPagina() {

    $('#processTabs', window.parent.document).hide();
    $('#textActivity', window.parent.document).hide();
    $('#breadcrumb', window.parent.document).hide();

    $('#page-header', window.parent.document).hide();
    $('#collapse-tabs', window.parent.document).hide();
    $('#centerContainer', window.parent.document).hide();
    $("#workflowActions", window.parent.document).show();
    $("#fixedTopBar", window.parent.document).show();
    $(".fixedTopBar", window.parent.document).remove();
    setTimeout(function() {
        $("body").css('padding-top', '0px');
    }, 1000);

    desenharTodosFiliados();

    carregarFiliados();

    buscarEventos();

}

function carregarFiliados() {

    var myLoading1 = FLUIGC.loading(window);
    myLoading1.show();

    var obj = {
        idEvento: ""
    };

    $.post(url + 'appfatec/listarFiliados.php',
        JSON.stringify(obj),
        function(retorno) {
            filiados = retorno;

            console.log(filiados);

            _.each(filiados, function(value, key, list) {
                var filiacao = "Convidado";
                if ((value.lide == "1") && (value.lidefuturo == "1")) {
                    filiacao = "LIDE e LIDE Futuro";
                } else if (value.lide == "1") {
                    filiacao = "LIDE";
                } else if (value.lidefuturo == "1") {
                    filiacao = "LIDE Futuro";
                }
                list[key]["filiacao"] = filiacao;
            });

        },
        "json"
    ).fail(function(retorno) {
        FLUIGC.toast({
            message: 'Erro ao buscar os filiados!',
            type: 'danger'
        });
    }).always(function(retorno) {
        var myLoading1 = FLUIGC.loading(window);
        myLoading1.hide();
    });
}

function desenharTodosFiliados() {

    autoCompleteFiliado = FLUIGC.autocomplete('#nomeFiliado', {
        source: (text, autocomplete) => {

            let data = filiados;
            let columns = ['nome', 'email', 'empresa'];

            let matches = []
            let regex = new RegExp(text, 'i')

            data.forEach((item) => {
                    if (columns && columns.length > 0) {
                        for (let index = 0; index < columns.length; index++) {
                            if (regex.test(item[columns[index]])) {
                                matches.push(item)
                                break;
                            }
                        }
                    }
                })
                //matches.splice(500, matches.length)
            autocomplete(matches)

        },
        displayKey: row => {

            return row['nome'].trim() + ' - ' + row['email'].trim()

        },
        tagClass: 'tag-gray',
        maxTags: 1,
        type: 'tagAutocomplete',
        tagMaxWidth: 300,
        onMaxTags: function(item, tag) {
            FLUIGC.toast({
                message: 'Apenas um filiado pode ser selecionado, por favor remova o filiado atual.',
                type: 'warning'
            });
        }
    });

    autoCompleteFiliado.on('fluig.autocomplete.itemAdded', function(ev) {
        $("#idFiliado").val(ev.item.id);
        $("#emailFiliado").val(ev.item.email);
        $("#empresaFiliado").val(ev.item.empresa);
        var lista = new Array("status", "lide", "lidefuturo", "patrocinador");
        _.each(lista, function(value, key, list) {
            $("#" + value + "Filiado").prop("checked", (ev.item[value] == "1"));
        });
    });

    autoCompleteFiliado.on('fluig.autocomplete.itemRemoved', function(ev) {
        limparCampos();
    });

}

function buscarEventos() {

    var myLoading1 = FLUIGC.loading(window);
    myLoading1.show();

    $.post(url + 'appfatec/listaEventos.php',
        "",
        function(retorno) {
            eventos = retorno;
            carregarEventos();
        },
        "json"
    ).fail(function(retorno) {
        FLUIGC.toast({
            message: 'Erro ao enviar post!',
            type: 'danger'
        });
    }).always(function(retorno) {
        var myLoading1 = FLUIGC.loading(window);
        myLoading1.hide();
    });

}

function carregarEventos() {

    if (typeof autoCompleteEvento != "undefined") {
        autoCompleteEvento.destroy();
        delete autoCompleteEvento;
    }

    autoCompleteEvento = FLUIGC.autocomplete('#pesquisaEvento', {
        source: substringMatcher(eventos, 'nome'),
        displayKey: 'nome',
        tagClass: 'tag-gray',
        maxTags: 1,
        type: 'tagAutocomplete',
        tagMaxWidth: 300,
        onMaxTags: function(item, tag) {
            FLUIGC.toast({
                message: 'Apenas um evento pode ser selecionado, por favor remova o evento atual.',
                type: 'warning'
            });
        }
    });

    autoCompleteEvento.on('fluig.autocomplete.itemAdded', function(ev) {
        //carregarFiliados();
    });

    autoCompleteEvento.on('fluig.autocomplete.itemRemoved', function(ev) {
        //carregarFiliados();
    });

    buscarProximoEvento();

}

function buscarProximoEvento() {

    var myLoading1 = FLUIGC.loading(window);
    myLoading1.show();

    $.post(url + 'appfatec/proximoevento.php',
        "",
        function(retorno) {
            proximoEvento = retorno;

            evento = _.where(eventos, {
                id: proximoEvento.id
            });
            if (evento.length == 1) {
                autoCompleteEvento.add(evento[0]);
            } else {
                autoCompleteEvento.add(eventos[eventos.length]);
            }

        },
        "json"
    ).fail(function(retorno) {
        FLUIGC.toast({
            message: 'Erro ao enviar post!',
            type: 'danger'
        });
    }).always(function(retorno) {
        var myLoading1 = FLUIGC.loading(window);
        myLoading1.hide();
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

function enviarCheck() {

    var eventos = autoCompleteEvento.items();
    if (eventos.length != 1) {
        FLUIGC.toast({
            message: 'Selecione o evento para registrar a chega e a saida.',
            type: 'warning'
        });
        return;
    }
    var idEvento = eventos[0].id;
    var nomeEvento = eventos[0].nome;
    var dataEvento = eventos[0].data;
    var horaEvento = eventos[0].hora;
    var impressora = $("#impressora").val();
    if (impressora == "") {
        FLUIGC.toast({
            message: 'Selecione a impressora para registrar a chega e a saida.',
            type: 'warning'
        });
        return;
    }

    if ($("#remover").is(":checked")) {
        removerCheckin();
        return;
    }

    if ($("#idFiliado").val() == "") {

        var nome = autoCompleteFiliado.input().val();
        if (nome == "") {
            FLUIGC.toast({
                message: 'Nome não informado.',
                type: 'warning'
            });
            return;
        }
        var empresa = $("#empresaFiliado").val();
        if (empresa == "") {
            FLUIGC.toast({
                message: 'Empresa não informado.',
                type: 'warning'
            });
            return;
        }
        var email = $("#emailFiliado").val();
        if (email == "") {
            email = "mail" + moment().format("YYYYMMDDHHmmss");
        }

        atualizarDados = false;

        var myLoading1 = FLUIGC.loading(window);
        myLoading1.show();

        var obj = {
            "idcampo": "NOVO",
            "tipo": "INSERT",
            "tabela": "pessoa",
            "dados": {
                "lidefuturo": $("#lidefuturoFiliado").is(":checked") ? "1" : "0",
                "nome": nome,
                "lide": $("#lideFiliado").is(":checked") ? "1" : "0",
                "patrocinador": $("#patrocinadorFiliado").is(":checked") ? "1" : "0",
                "empresa": empresa,
                "nomeCompleto": nome,
                "status": $("#statusFiliado").is(":checked") ? "1" : "0",
                "email": email
            }
        };

        $.post(url + 'appfatec/alterarTabela.php',
            JSON.stringify(obj),
            function(retorno) {
                if (retorno.success) {
                    FLUIGC.toast({
                        message: retorno.message,
                        type: 'success'
                    });

                    atualizarDados = false;

                    $("#idFiliado").val(retorno.registro.id);
                    enviarCheck();

                    carregarFiliados();

                } else {
                    FLUIGC.toast({
                        message: 'ERRO: ' + retorno.message,
                        type: 'warning'
                    });
                }
            },
            "json"
        ).fail(function(retorno) {
            FLUIGC.toast({
                message: 'Erro ao cadastrar os filiados!',
                type: 'danger'
            });
        }).always(function(retorno) {
            var myLoading1 = FLUIGC.loading(window);
            myLoading1.hide();
        });

        return;
    }

    var endpoint = "";
    if ($("#checkin").is(":checked") || $("#checkout").is(":checked") || $("#confirmar").is(":checked")) {
        endpoint = url + 'appfatec/checkinManual.php';
    } else if ($("#imprimir").is(":checked")) {
        endpoint = url + 'appfatec/impressaoManual.php';
    } else {
        FLUIGC.toast({
            message: "Nenhuma ação selecionada.",
            type: 'warning'
        });
        return;
    }

    var myLoading1 = FLUIGC.loading(window);
    myLoading1.show();

    var obj = {
        "iduser": $("#idFiliado").val(),
        "idevento": idEvento,
        "idimpressora": $("#impressora").val(),
        "imprimir": ($("#imprimir").is(":checked") ? "1" : "0"),
        "checkin": ($("#checkin").is(":checked") ? "1" : "0"),
        "checkout": ($("#checkout").is(":checked") ? "1" : "0"),
        "confirmar": ($("#confirmar").is(":checked") ? "1" : "0"),
        "nomeUser": $("#nomeFiliado").val(),
        "emailUser": $("#emailFiliado").val(),
        "nomeEvento": nomeEvento,
        "dataEvento": dataEvento,
        "horaEvento": horaEvento,
    };

    console.log("objEventoCheckinManual", obj);

    $.post(endpoint,
        JSON.stringify(obj),
        function(retorno) {
            console.log("retorno", retorno);
            if (retorno.success) {
                FLUIGC.toast({
                    message: retorno.message,
                    type: 'success'
                });

                if (atualizarDados) {

                    atualizarFiliado();

                } else {

                    autoCompleteFiliado.removeAll();
                    autoCompleteFiliado.input().val("");
                    limparCampos();

                }

                atualizarDados = false;

            } else {
                FLUIGC.toast({
                    message: 'ERRO: ' + retorno.message,
                    type: 'warning'
                });
            }
        },
        "json"
    ).fail(function(retorno) {
        console.log("retornoErro", retorno);
        FLUIGC.toast({
            message: 'Erro ao comunicar com o servidor!',
            type: 'danger'
        });
    }).always(function(retorno) {
        var myLoading1 = FLUIGC.loading(window);
        myLoading1.hide();
    });

}

function atualizar() {

    atualizarDados = true;

}

function atualizarFiliado() {

    var empresa = $("#empresaFiliado").val();
    if (empresa == "") {
        FLUIGC.toast({
            message: 'Empresa não informado.',
            type: 'warning'
        });
        return;
    }
    var email = $("#emailFiliado").val();
    if (email == "") {
        email = "mail" + moment().format("YYYYMMDDHHmmss");
    }

    var myLoading1 = FLUIGC.loading(window);
    myLoading1.show();

    var obj = {
        "idcampo": $("#idFiliado").val(),
        "tipo": "UPDATE",
        "tabela": "pessoa",
        "dados": {
            "lidefuturo": $("#lidefuturoFiliado").is(":checked") ? "1" : "0",
            "lide": $("#lideFiliado").is(":checked") ? "1" : "0",
            "patrocinador": $("#patrocinadorFiliado").is(":checked") ? "1" : "0",
            "empresa": empresa,
            "status": $("#statusFiliado").is(":checked") ? "1" : "0",
            "email": email
        }
    };

    $.post(url + 'appfatec/alterarTabela.php',
        JSON.stringify(obj),
        function(retorno) {
            if (retorno.success) {
                FLUIGC.toast({
                    message: retorno.message,
                    type: 'success'
                });

                autoCompleteFiliado.removeAll();
                autoCompleteFiliado.input().val("");
                limparCampos();

                carregarFiliados();

            } else {
                FLUIGC.toast({
                    message: 'ERRO: ' + retorno.message,
                    type: 'warning'
                });
            }
        },
        "json"
    ).fail(function(retorno) {
        FLUIGC.toast({
            message: 'Erro ao alterar os filiados!',
            type: 'danger'
        });
    }).always(function(retorno) {
        var myLoading1 = FLUIGC.loading(window);
        myLoading1.hide();
    });

}

function limparCampos() {
    $("#idFiliado").val("");
    $("#empresaFiliado").val("");
    $("#emailFiliado").val("");
    var lista = new Array("status", "lide", "lidefuturo", "patrocinador");
    _.each(lista, function(value, key, list) {
        $("#" + value + "Filiado").prop("checked", false);
    });
}

function digitarID() {
    if (event.keyCode == 13) {
        enviarCheck();
    }
}

function removerCheckin() {

    var eventos = autoCompleteEvento.items();
    if (eventos.length != 1) {
        FLUIGC.toast({
            message: 'Selecione o evento para registrar a chega e a saida.',
            type: 'warning'
        });
        return;
    }
    var idEvento = eventos[0].id;
    var impressora = $("#impressora").val();
    if (impressora == "") {
        FLUIGC.toast({
            message: 'Selecione a impressora para registrar a chega e a saida.',
            type: 'warning'
        });
        return;
    }

    var endpoint = "";
    endpoint = url + 'appfatec/removerCheckin.php';

    var myLoading1 = FLUIGC.loading(window);
    myLoading1.show();

    var obj = {
        "iduser": $("#idFiliado").val(),
        "idevento": idEvento,
        "idimpressora": $("#impressora").val(),
        "imprimir": ($("#imprimir").is(":checked") ? "1" : "0")
    };

    $.post(endpoint,
        JSON.stringify(obj),
        function(retorno) {
            if (retorno.success) {
                FLUIGC.toast({
                    message: retorno.message,
                    type: 'success'
                });

                $("#idFiliado").val("");
                autoCompleteFiliado.removeAll();
                autoCompleteFiliado.input().val("");
                $("#empresaFiliado").val("");
                $("#idFiliado").focus();

            } else {
                FLUIGC.toast({
                    message: 'ERRO: ' + retorno.message,
                    type: 'warning'
                });
            }
        },
        "json"
    ).fail(function(retorno) {
        FLUIGC.toast({
            message: 'Erro ao comunicar com o servidor!',
            type: 'danger'
        });
    }).always(function(retorno) {
        var myLoading1 = FLUIGC.loading(window);
        myLoading1.hide();
    });

}