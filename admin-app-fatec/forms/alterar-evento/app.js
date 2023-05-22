$(document).ready(function() {
    console.log("ready!");
    $("#navbar").load("../../header.html");
    carregaPaiFilho();
});

var url = "https://www.clientestotvssm.com.br/";
var contadoresPaiFilho = {};

//$("#page-header").hide();
//$("#collapse-tabs").hide();

var eventos = null;
var editor = null;
var qtdImagens = 0;

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

    buscarEventos();

}

function buscarEventos() {

    efetuarRequisicao("listaEventos.php", null, function(retorno) {
        eventos = retorno;
        console.log(retorno);
        carregarDados();
    });

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
        exibirDados(ev.item);
    });

    autoCompleteEvento.on('fluig.autocomplete.itemRemoved', function(ev) {
        limparDados();
    });

    calendarDATAINICIO = FLUIGC.calendar('#dataEventoCalendar', {
        pickDate: true,
        pickTime: false
    });
    calendarHORAINICIO = FLUIGC.calendar('#horaEvento', {
        pickDate: false,
        pickTime: true
    });
    var settings = {
        extraPlugins: 'liststyle,image',
        resize_enabled: true,
        width: "auto",
        height: "280",
        allowedContent: true
    };
    editor = FLUIGC.richeditor('descricaoEvento', settings);

}

function exibirDados(objeto) {

    var lista = new Array("id", "nome", "descricao", "latitude", "longitude", "endereco", "palestrante", "funcao", "local", "organizador", "mesa", "link", "data", "perfil", "perfilConfig", "vagas");
    _.each(lista, function(value, key, list) {
        $("#" + value + "Evento").val(objeto[value]);
    });

    var lista = new Array("status", "lide", "lidefuturo", "lidemulher");
    _.each(lista, function(value, key, list) {
        $("#" + value + "Evento").prop("checked", (objeto[value] == "1"));;
    });

    calendarDATAINICIO.setDate(moment(objeto.data, "YYYY-MM-DD"));
    calendarHORAINICIO.setDate(moment(objeto.hora, "HH:mm"));

    editor.setData(objeto.descricao);

    var obj = {
        "eventoid": $("#idEvento").val()
    }
    efetuarRequisicao("getImagemEvento.php", obj, function(retorno) {
        if (retorno.dados) {
            for (item in retorno.dados) {
                adicionarImagem(retorno.dados[item]);
            }
        }
    });

    var obj = {
        "eventoid": $("#idEvento").val()
    }
    efetuarRequisicao("getSetorEvento.php", obj, function(retorno) {
        if (retorno.dados) {
            for (item in retorno.dados) {
                adicionarSetor(retorno.dados[item]);
            }
        }
    });

    var obj = {
        "id": $("#idEvento").val()
    }
    efetuarRequisicao("eventoid.php", obj, function(retorno) {
        if (retorno.posevento) {
            for (item in retorno.posevento) {
                adicionarConteudo(retorno.posevento[item]);
            }
        }
    });

}

function alterarData() {
    $("#dataEvento").val(calendarDATAINICIO.getDate().format("YYYY-MM-DD"));
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

function adicionarSetor(objeto) {

    var row = customWdkAddChild('setores');
    if (!objeto) {
        $("#idSetor___" + row).val("NOVO");
        $("#nome___" + row).val("");
        $("#cor___" + row).val("");
        $('#vagas___' + row).val("");
    } else {
        $("#idSetor___" + row).val(objeto.id);
        $("#nome___" + row).val(objeto.nome);
        $("#cor___" + row).val(objeto.cor);
        $('#vagas___' + row).val(objeto.vagas);
    }
}

function novoEvento() {
    limparDados();
    autoCompleteEvento.removeAll();
    $("#idEvento").val("NOVO");
}

function limparDados() {

    var lista = new Array("id", "nome", "latitude", "longitude", "endereco", "palestrante", "funcao", "local", "organizador", "mesa", "link", "data", "perfil", "perfilConfig", "vagas");
    _.each(lista, function(value, key, list) {
        $("#" + value + "Evento").val("");
    });

    var lista = new Array("status", "lide", "lidefuturo", "lidemulher");
    _.each(lista, function(value, key, list) {
        $("#" + value + "Evento").prop("checked", false);;
    });
    calendarDATAINICIO.setDate("");
    calendarHORAINICIO.setDate("");

    $("input[name^=idImagem___]").each(function() {
        customFnWdkRemoveChild(this);
    });

    $("input[name^=idPosEvento___]").each(function() {
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
var enviado = new Object();
var objJsonEnvio = new Object();

function enviarEvento() {

    var nome = $("#nomeEvento").val();

    if (nome == "") {
        FLUIGC.toast({
            message: 'Informe o evento.',
            type: 'warning'
        });
        return;
    }

    var objDados = new Object()

    var lista = new Array("nome", "latitude", "longitude", "endereco", "palestrante", "funcao", "local", "organizador", "mesa", "link", "perfil", "perfilConfig", "vagas");
    _.each(lista, function(value, key, list) {
        objDados[value] = $("#" + value + "Evento").val();
    });

    var lista = new Array("status", "lide", "lidefuturo", "lidemulher");
    _.each(lista, function(value, key, list) {
        objDados[value] = ($("#" + value + "Evento").is(":checked") ? "1" : "0");
    });

    objDados['data'] = calendarDATAINICIO.getDate().format("YYYY-MM-DD");
    objDados['hora'] = calendarHORAINICIO.getDate().format("HH:mm");
    objDados['descricao'] = editor.getData();

    var notificar = $("#notificarEvento").is(":checked");

    var idcampo = $('#idEvento').val();
    if (nome == "") {
        FLUIGC.toast({
            message: 'Código do evento não informadao.',
            type: 'warning'
        });
        return;
    }

    var tipo = "UPDATE"
    if (idcampo == 'NOVO') {
        tipo = "INSERT"
    }

    var obj = {
        "idcampo": idcampo,
        "tipo": tipo,
        "tabela": "evento",
        "notificar": notificar,
        "dados": objDados
    };

    FLUIGC.loading(window).show();

    //objDados['imagem'] = $('#imagem64Evento').html();

    console.log("enviando evento", obj);

    efetuarRequisicao("alterarTabela.php", obj, function(retorno) {
        if (retorno.success) {
            FLUIGC.toast({
                message: retorno.message,
                type: 'success'
            });
            FLUIGC.toast({
                message: "Salvando imagens",
                type: 'info'
            });

            $("input[name^=idImagem___]").each(function() {
                var row = this.name.split("___")[1];
                enviando['imagem' + row] = true;
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

                console.log("enviando imagem", row, obj);

                efetuarRequisicao("alterarImagem.php", obj, function(retorno) {
                    if (retorno.success) {
                        enviando['imagem' + row] = false;
                        FLUIGC.toast({
                            message: retorno.message,
                            type: 'success'
                        });
                    } else {
                        FLUIGC.toast({
                            message: 'ERRO: ' + retorno.message,
                            type: 'warning'
                        });
                    }
                });

            });

            $("input[name^=idSetor___]").each(function() {
                var row = this.name.split("___")[1];
                enviando['setor' + row] = true;
                var idcampo = $("#idSetor___" + row).val();
                var tipo = "UPDATE"
                if (idcampo == 'NOVO') {
                    tipo = "INSERT"
                }
                var obj = {
                    "idcampo": idcampo,
                    "tipo": tipo,
                    "tabela": "eventosetor",
                    "dados": {
                        "eventoid": $('#idEvento').val(),
                        "nome": $('#nome___' + row).val(),
                        "cor": $('#cor___' + row).val(),
                        "vagas": $('#vagas___' + row).val()
                    }
                };

                console.log("enviando setor", row, obj);

                efetuarRequisicao("alterarSetorEvento.php", obj, function(retorno) {
                    console.log("retorno setor", retorno);
                    if (retorno.success) {
                        enviando['setor' + row] = false;
                        FLUIGC.toast({
                            message: retorno.message,
                            type: 'success'
                        });
                    } else {
                        FLUIGC.toast({
                            message: 'ERRO: ' + retorno.message,
                            type: 'warning'
                        });
                    }
                });

            });

            $("input[name^=idPosEvento___]").each(function() {
                var row = parseInt(this.name.split("___")[1]);
                enviado['video' + row] = false;
                enviando['video' + row] = true;

                var idcampo = $("#idPosEvento___" + row).val();
                var tipo = "UPDATE"
                if (idcampo == 'NOVO') {
                    tipo = "INSERT"
                }
                var obj = {
                    "idcampo": idcampo,
                    "tipo": tipo,
                    "tabela": "posevento",
                    "dados": {
                        "eventoid": $('#idEvento').val(),
                        "video": "",
                        "type": "",
                        "poster": "",
                        "imagem": $('#imagem64PosEvento___' + row).html(),
                        "texto": editorPosEvento[row].getData(),
                        "youtube": $("#youtubePosEvento___" + row).val(),
                        "ordem": ($("#ordemPosEvento___" + row).val() == "") ? row : $("#ordemPosEvento___" + row).val()
                    }
                };
                objJsonEnvio[row] = obj;

                fileUploader[row].startUpload();

                if (!enviado['video' + row]) {

                    console.log("enviando video manual", row, obj);

                    $.ajax({
                        type: "POST",
                        data: obj,
                        url: "https://www.clientestotvssm.com.br/lidephp/alterarVideo.php",
                        dataType: "html",
                        success: function(result) {

                            console.log("retorno alterar video", retorno);

                            if (retorno.success) {
                                enviando['video' + row] = false;
                                FLUIGC.toast({
                                    message: retorno.message,
                                    type: 'success'
                                });
                            } else {
                                FLUIGC.toast({
                                    message: 'ERRO: ' + retorno.message,
                                    type: 'warning'
                                });
                            }

                        },
                        fail: function(retorno) {
                            FLUIGC.toast({
                                message: 'Erro ao buscar os filiados!',
                                type: 'danger'
                            });
                        },
                        always: function(retorno) {
                            var myLoading1 = FLUIGC.loading(window);
                            myLoading1.hide();
                        }
                    });

                }

            });




        } else {
            FLUIGC.toast({
                message: 'ERRO: ' + retorno.message,
                type: 'warning'
            });
        }
        checarEnvio();
    });
}

function checarEnvio() {

    console.log("checando envio: ", enviando);

    var estaEnviando = false;
    for (item in enviando) {
        if (enviando[item]) {
            estaEnviando = true;
        }
    }
    console.log("estaEnviando: ", estaEnviando);
    if (!estaEnviando) {
        limparDados();
        autoCompleteEvento.removeAll();
        FLUIGC.loading(window).hide();
    } else {
        setTimeout(function() {
            checarEnvio();
        }, 1000);
    }

}

function excluirEvento() {

    Swal({
        title: 'Atenção',
        html: 'Confima a exclusão do evento ?',
        type: 'info',
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#D8D8D8',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
    }).then(function(result) {
        if (result.value) {

            var idcampo = $('#idEvento').val();

            var tipo = "DELETE"

            var obj = {
                "idcampo": idcampo,
                "tipo": tipo,
                "tabela": "evento",
                "dados": {
                    "id": idcampo
                }
            };

            FLUIGC.loading(window).show();

            console.log(obj);

            efetuarRequisicao("alterarTabela.php", obj, function(retorno) {
                if (retorno.success) {
                    FLUIGC.toast({
                        message: retorno.message,
                        type: 'success'
                    });

                    limparDados();
                    autoCompleteEvento.removeAll();
                    FLUIGC.loading(window).hide();

                } else {
                    FLUIGC.toast({
                        message: 'ERRO: ' + retorno.message,
                        type: 'warning'
                    });
                }
            });

        }
    });

}

function removerLinha(elemento) {
    Swal({
        title: 'Atenção',
        html: "Confima a exclusão da imagem?",
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
                efetuarRequisicao("alterarTabela.php", obj, function(retorno) {
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

function removerLinhaSetor(elemento) {
    Swal({
        title: 'Atenção',
        html: "Confima a exclusão do setor?",
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
            var idcampo = $("#idSetor___" + row).val();
            if (idcampo != "NOVO") {
                FLUIGC.loading(window).show();
                var tipo = "DELETE"
                var obj = {
                    "idcampo": idcampo,
                    "tipo": tipo,
                    "tabela": "eventosetor",
                    "dados": {
                        "eventoid": $('#idEvento').val(),
                        "nome": "",
                        "cor": "",
                        "vagas": ""
                    }
                };
                efetuarRequisicao("alterarTabela.php", obj, function(retorno) {
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

var fileUploader = new Object();
var editorPosEvento = new Object();

function readURLPos(input) {
    var row = input.name.split("___")[1];
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#falseinputPosEvento___' + row).attr('src', e.target.result);
            $('#imagem64PosEvento___' + row).html(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function adicionarConteudo(objeto) {

    var row = customWdkAddChild('posevento');

    var settings = {
        extraPlugins: 'liststyle,image',
        resize_enabled: true,
        width: "auto",
        height: "280",
        allowedContent: true
    };
    //editorPosEvento[row] = FLUIGC.richeditor('descricaoPosEvento___' + row, settings);

    if (!objeto) {
        $("#idPosEvento___" + row).val("NOVO");
        $("#ordemPosEvento___" + row).val("");
        editorPosEvento[row].setData("");
        $('#falseinputPosEvento___' + row).attr('src', "");
        $('#imagem64PosEvento___' + row).html("");
        $('#videoViwer___' + row).attr('src', "");
        $("#youtubePosEvento___" + row).val("");

    } else {
        $("#idPosEvento___" + row).val(objeto.id);
        $("#ordemPosEvento___" + row).val(objeto.ordem);
        editorPosEvento[row].setData(objeto.texto);
        $('#falseinputPosEvento___' + row).attr('src', objeto.imagem);
        $('#imagem64PosEvento___' + row).html(objeto.imagem);
        $('#videoViwer___' + row).attr('src', objeto.video);
        $("#youtubePosEvento___" + row).val(objeto.youtube);
    }

    fileUploader[row] = $("#fileuploader___" + row).uploadFile({
        url: "https://www.clientestotvssm.com.br/lidephp/alterarVideo.php",
        multiple: false,
        dragDrop: true,
        autoSubmit: false,
        maxFileCount: 1,
        fileName: "myfile",
        acceptFiles: "video/mp4",
        maxFileSize: 50 * 1024 * 1024,
        dynamicFormData: function() {
            var obj = objJsonEnvio[row];
            console.log("enviando video", row, obj);
            return obj;
        },
        onLoad: function(obj) {},
        onSubmit: function(files) {
            FLUIGC.toast({
                message: "Enviando videos: " + JSON.stringify(files),
                type: 'info'
            });
        },
        onSuccess: function(files, data, xhr, pd) {
            enviando['video' + row] = false;
            FLUIGC.toast({
                message: "Videos enviados: " + JSON.stringify(data),
                type: 'info'
            });
        },
        afterUploadAll: function(obj) {},
        onError: function(files, status, errMsg, pd) {
            FLUIGC.toast({
                message: "ERRO videos: " + errMsg,
                type: 'danger'
            });
        },
        onCancel: function(files, pd) {}
    });

    $('a[data-toggle="collapse"]').each(function() {
        var ida = $(this).attr("id");
        $(this).attr("href", "#" + ida.substr(1, ida.length));
    });

}

function removerLinhaPosEvento(elemento) {

    Swal({
        title: 'Atenção',
        html: 'Confima a exclusão do pós evento ?',
        type: 'info',
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#D8D8D8',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
    }).then(function(result) {
        if (result.value) {

            FLUIGC.loading(window).show();

            var row = elemento.id.split("___")[1];
            var idcampo = $("#idPosEvento___" + row).val();
            if (idcampo != "NOVO") {
                var tipo = "DELETE"
                var obj = {
                    "idcampo": idcampo,
                    "tipo": tipo,
                    "tabela": "posevento",
                    "dados": {
                        "eventoid": $('#idEvento').val(),
                        "imagem": "",
                        "link": ""
                    }
                };
                efetuarRequisicao("alterarTabela.php", obj, function(retorno) {
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
            }
            FLUIGC.loading(window).hide();
            customFnWdkRemoveChild(elemento);

        }
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
        FLUIGC.toast({
            message: "Erro ao chamar WS: " + erro,
            type: 'danger'
        });
    }).always(function(retorno) {

        FLUIGC.loading(window).hide();
    });

}

function validaVagas(id) {
    var totalVagas = parseInt($("#vagasEvento").val());
    var somaVagas = 0;
    $("input[name^=idSetor___]").each(function() {
        var row = this.name.split("___")[1];
        somaVagas += parseInt($("#vagas___" + row).val());
    });
    if (totalVagas < somaVagas) {
        $("#" + id).val("0");
        FLUIGC.toast({
            title: 'Atenção',
            message: 'Número de vagas por setor excedeu o número total de vagas do evento.',
            type: 'warning'
        });
    }
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