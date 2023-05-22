$(document).ready(function() {
    console.log("ready!");
    $("#navbar").load("../../header.html");
    carregaPaiFilho();
    $("#cadastroConvidado").hide();
});

var url = "https://www.clientestotvssm.com.br/";
var contadoresPaiFilho = {};
var filiados = [];
var listaEmpresas = [];
var eventos = null;

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

    var filiacao = [{
            'descricao': 'LIDE'
        },
        {
            'descricao': 'LIDE Futuro'
        },
        {
            'descricao': 'LIDE Mulher'
        },
        {
            'descricao': 'Convidados'
        },
        {
            'descricao': 'Patrocinadores'
        },
        {
            'descricao': 'Testes'
        },
        {
            'descricao': 'Inativos'
        }
    ]

    myAutocompleteselectFiltrar = FLUIGC.autocomplete('#selectFiltrar', {
        source: substringMatcher(filiacao, 'descricao'),
        name: 'descricao',
        displayKey: 'descricao',
        tagClass: 'tag-gray',
        type: 'tagAutocomplete'
    });

    myAutocompleteselectFiltrar.add({
        'descricao': 'Convidados'
    });

    myAutocompleteselectFiltrar.on('fluig.autocomplete.itemAdded', function(ev) {
        desenharFiliados();
    });

    myAutocompleteselectFiltrar.on('fluig.autocomplete.itemRemoved', function(ev) {
        desenharFiliados();
    });

    efetuarRequisicao("listaEventos.php", null, function(retorno) {
        eventos = retorno;
        console.log(retorno);
        carregarDados();
    });


    criarACFiliados();

    carregarFiliados();

}

function carregarDados() {

    if (typeof autoCompleteEvento != "undefined") {
        autoCompleteEvento.destroy();
        delete autoCompleteEvento;
    }

    console.log(eventos);

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
        console.log(ev);
        $("#idEvento").val(ev.item.id);
        $("#nomeEvento").val(ev.item.nome);
        $("#dataEvento").val(moment(ev.item.data, "YYYY-MM-DD").format("DD/MM/YYYY"));
        $("#horaEvento").val(ev.item.hora);
    });

    autoCompleteEvento.on('fluig.autocomplete.itemRemoved', function(ev) {
        console.log(ev);
        $("#idEvento").val("");
        $("#nomeEvento").val("");
        $("#dataEvento").val("");
        $("#horaEvento").val("");
    });

}

const criarACFiliados = () => {

    $("#acFiliado").removeAttr("disabled");

    acFiliado = FLUIGC.autocomplete('#acFiliado', {
            source: (text, autocomplete) => {

                let data = filiados;
                let columns = ['id', 'nome', 'empresa', 'email'];

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
                autocomplete(matches)

            },
            displayKey: row => {

                return row['id'] + ' - ' + row['nome'].trim() + ' - ' + row['empresa'].trim();

            },
            type: 'tagAutocomplete',
            tagClass: 'tag-gray',
        })
        .on('fluig.autocomplete.itemAdded', event => {

            console.log(event);

            $("#idFiliado").val(event.item.id);

            var obj = {
                "idevento": $("#idEvento").val(),
                "idPatrocinador": $("#idFiliado").val()
            }

            efetuarRequisicao("consultaCheckinPatrocinador.php", obj, function(retorno) {
                if (retorno["dados"]) {
                    for (item in retorno.dados) {
                        adicionarConvidado(retorno.dados[item]);
                    }
                }
            });
            $("#cadastroConvidado").show();

        })
        .on('fluig.autocomplete.itemUpdated', event => {

        })
        .on('fluig.autocomplete.itemRemoved', event => {

            $("#cadastroConvidado").hide();
            $("#idFiliado").val("");

        })

}

function carregarFiliados() {

    FLUIGC.loading(window).show();

    var obj = {
        idEvento: ""
    };

    efetuarRequisicao("listarFiliados.php", obj, function(retorno) {

        filiados = retorno;

        console.log(filiados);

        _.each(filiados, function(value, key, list) {
            var filiacao = "";
            if (value.lide == "1") {
                filiacao += (filiacao != "") ? ", " : "";
                filiacao += "LIDE";
            }
            if (value.lidefuturo == "1") {
                filiacao += (filiacao != "") ? ", " : "";
                filiacao += "LIDE Futuro";
            }
            if (value.lidemulher == "1") {
                filiacao += (filiacao != "") ? ", " : "";
                filiacao += "LIDE Mulher";
            }
            if (value.staff == "1") {
                filiacao += (filiacao != "") ? ", " : "";
                filiacao += "Staff";
            }
            if (value.imprensa == "1") {
                filiacao += (filiacao != "") ? ", " : "";
                filiacao += "Imprensa";
            }
            if (filiacao == "") {
                filiacao = "Convidado";
            }
            if (value.patrocinador == "1") {
                filiacao += " Patrocinador";
            }
            list[key]["filiacao"] = filiacao;
        });

        desenharFiliados();

    });

}

function desenharFiliados() {

    if (myAutocompleteselectFiltrar.items().length > 0) {

        var filtros = new Object();
        var teste = false;
        var inativos = false;

        myAutocompleteselectFiltrar.items().forEach(obj => {

            //'LIDE', 'LIDE Futuro', 'LIDE Mulher', 'Convidados', 'Patrocinadores', 'Testes', 'Ativos'

            var item = obj.descricao;

            if (item == 'LIDE') {
                filtros['lide'] = "1";
            } else if (item == 'LIDE Futuro') {
                filtros['lidefuturo'] = "1";
            } else if (item == 'LIDE Mulher') {
                filtros['lidemulher'] = "1";
            } else if (item == 'Convidados') {
                filtros['lide'] = "0";
                filtros['lidefuturo'] = "0";
                filtros['lidemulher'] = "0";
            } else if (item == 'Patrocinadores') {
                filtros['patrocinador'] = "1";
            } else if (item == 'Inativos') {
                inativos = true;
            } else if (item == 'Testes') {
                teste = true;
            }

        })

        if (!inativos) {
            filtros['status'] = "1";
        } else {
            filtros['status'] = "0";
        }

        if (!teste) {
            filtros['teste'] = "0";
        } else {
            filtros['teste'] = "1";
        }

        filiadosFiltrados = _.where(filiados, filtros);

    } else {

        filiadosFiltrados = filiados;

    }

}

function enviarFiliado() {

    var nome = $("#nomeFiliado").val();

    if (nome == "") {
        FLUIGC.toast({
            message: 'Informe o nome do filiado.',
            type: 'warning'
        });
        return;
    }

    var objDados = new Object()

    var lista = new Array("nome", "nomeCompleto", "email", "cpf", "senha", "cargo", "empresa", "empresaid", "emailSec", "site", "tel", "telSec", "nascimento", "perfil", "vip", "qtd_convidados");
    _.each(lista, function(value, key, list) {
        objDados[value] = $("#" + value + "Filiado").val();
    });

    var lista = new Array("primeirologin", "compTel", "compTelSec", "compEmail", "compEmailSec", "status", "lide", "lidefuturo", "lidemulher", "patrocinador", "teste", "staff", "imprensa");
    _.each(lista, function(value, key, list) {
        objDados[value] = ($("#" + value + "Filiado").is(":checked") ? "1" : "0");
    });

    var idcampo = $('#idFiliado').val();
    var tipo = "UPDATE"
    if (idcampo == 'NOVO') {
        tipo = "INSERT"
    }

    FLUIGC.loading(window).show();

    var obj = {
        "idcampo": idcampo,
        "tipo": tipo,
        "tabela": "pessoa",
        "dados": objDados
    };

    console.log(obj);

    efetuarRequisicao("alterarTabela.php", obj, function(retorno) {
        if (retorno.success) {
            FLUIGC.toast({
                message: retorno.message,
                type: 'success'
            });

            carregarFiliados();

        } else {
            FLUIGC.toast({
                message: 'ERRO: ' + retorno.message,
                type: 'warning'
            });
        }

        FLUIGC.loading(window).hide();

    });

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
        /*FLUIGC.toast({
            message: "Erro ao chamar WS: " + erro,
            type: 'danger'
        });*/
        callback.apply(null, [
            []
        ])
    }).always(function(retorno) {

        FLUIGC.loading(window).hide();
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

function adicionarConvidado(objeto) {

    var row = customWdkAddChild('convidados');
    if (!objeto) {
        $("#idConvidado___" + row).val("NOVO");
        $("#idConvidado___" + row).attr("readonly", "readonly");
        $("#empresa___" + row).val("");
        $("#nome___" + row).val("");
        $('#email___' + row).val("");
    } else {
        $("#idConvidado___" + row).val(objeto.id);
        $("#idConvidado___" + row).attr("readonly", "readonly");
        $("#idUser___" + row).val(objeto.iduser);
        $("#empresa___" + row).val(objeto.empresa);
        $("#empresa___" + row).attr("readonly", "readonly");
        $("#nome___" + row).val(objeto.nome);
        $("#nome___" + row).attr("readonly", "readonly");
        $('#email___' + row).val(objeto.email);
        $("#email___" + row).attr("readonly", "readonly");
        $('#obsConvidado___' + row).val(objeto.obsConvidado);
        $("#obsConvidado___" + row).attr("readonly", "readonly");
    }
}

function removerLinhaConvidado(elemento) {
    Swal({
        title: 'Atenção',
        html: "Confima a exclusão do convidado?",
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
            var idcampo = $("#idConvidado___" + row).val();
            if (idcampo != "NOVO") {
                FLUIGC.loading(window).show();
                var obj = {
                    iduser: $("#idUser___" + row).val(),
                    idevento: $("#idEvento").val(),
                    idpatrocinador: $("#idFiliado").val()
                };
                console.log("objRemover", obj);
                efetuarRequisicao("removerCheckinPatrocinador.php", obj, function(retorno) {
                    console.log("retorno setor", retorno);
                    if (retorno['success'] != false) {
                        customFnWdkRemoveChild(elemento);
                        FLUIGC.toast({
                            message: 'Convidado excluído com sucesso!',
                            type: 'success'
                        });
                    } else {
                        FLUIGC.toast({
                            message: 'ERRO [3]: ' + retorno3.message,
                            type: 'warning'
                        });
                    }
                });
                FLUIGC.loading(window).show();
            } else {
                customFnWdkRemoveChild(elemento);
            }
        }
    });
}

function salvarConvidados() {

    if ($("#idEvento").val() == "") {
        FLUIGC.toast({
            message: 'Informe o evento.',
            type: 'warning'
        });
        return;
    }

    if ($("#idFiliado").val() == "") {
        FLUIGC.toast({
            message: 'Informe o filiado.',
            type: 'warning'
        });
        return;
    }

    FLUIGC.loading(window).show();

    $("input[name^=idConvidado___]").each(function() {
        var row = this.name.split("___")[1];
        var idcampo = $("#idConvidado___" + row).val();
        var tipo = "UPDATE"
        if (idcampo == 'NOVO') {
            tipo = "INSERT"
        }

        if (tipo == "INSERT") {

            let obj = {
                nome: $("#nome___" + row).val(),
                cargo: "",
                email: $("#email___" + row).val(),
                status: true,
                cpf: "",
                empresa: $("#empresa___" + row).val(),
                segmento: "",
                tel: this.tel,
                compTel: 0,
                telSec: "",
                compTelSec: 0,
                emailSec: "",
                compEmail: 0,
                site: "",
                imagem: 'assets/imgs/fundo.svg',
                lide: 0,
                lidefuturo: 0,
                compEmailSec: 0,
                senha: (Math.floor(Math.random() * (999999 - 100000)) + 1000).toString()
            }

            efetuarRequisicao("inserircadastro.php", obj, function(retorno) {
                console.log("retorno inserir cadastro", retorno);
                if (retorno['success'] != false || (retorno['success'] == false && retorno['dados'])) {
                    var idUser = retorno['id'] == undefined ? retorno['dados']['id'] : retorno['id'];
                    let obj2 = {
                        idevento: $("#idEvento").val(),
                        iduser: idUser,
                        lat: 0,
                        long: 0,
                        email: $("#email___" + row).val(),
                        nome: $("#nome___" + row).val(),
                        confirmar: 1,
                        evento: $("#nomeEvento").val(),
                        idPatrocinador: $("#idFiliado").val(),
                        obsConvidado: $("#obsConvidado___" + row).val()
                    };
                    console.log("objCheckin", obj2);
                    efetuarRequisicao("inserircheckin.php", obj2, function(retorno2) {
                        console.log("retorno inserir checkin", retorno2);
                        if (retorno2["success"]) {
                            let objMail = {
                                idUser: idUser,
                                idEvento: $("#idEvento").val(),
                                email: $("#email___" + row).val(),
                                nome: $("#nome___" + row).val(),
                                nomeEvento: $("#nomeEvento").val(),
                                horaEvento: $("#horaEvento").val(),
                                dataEvento: $("#dataEvento").val()
                            };
                            console.log("objMail", objMail);
                            efetuarRequisicao("enviaEmailConvidado.php", objMail, function(retorno3) {
                                console.log("retorno setor", retorno);
                                if (retorno3['success'] != false) {
                                    FLUIGC.toast({
                                        message: 'Convidado inserido com sucesso!',
                                        type: 'success'
                                    });
                                } else {
                                    FLUIGC.toast({
                                        message: 'ERRO [3]: ' + retorno3.message,
                                        type: 'warning'
                                    });
                                }
                            });
                        } else {
                            FLUIGC.toast({
                                message: 'ERRO [2]: ' + retorno2.message,
                                type: 'warning'
                            });
                        }
                    });
                } else {
                    FLUIGC.toast({
                        message: 'ERRO [1]: ' + retorno.message,
                        type: 'warning'
                    });
                }
            });

        }

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
        $(novaLinha).find("input, input:text, input:radio, input:file, select, img, textarea, i, div, span").each(function(index, input) {
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