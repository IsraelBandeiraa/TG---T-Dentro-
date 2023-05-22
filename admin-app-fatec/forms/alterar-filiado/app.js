$(document).ready(function() {
    console.log("ready!");
    $("#navbar").load("../../header.html");
});
var url = "https://www.clientestotvssm.com.br/";
var filiados = [];
var listaEmpresas = [];

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

    $("#formularioAlteracao").hide();

    tabelaFiliados = $('#tabelaFiliados').DataTable({
        dom: 'Bit',
        buttons: [{
                extend: 'pdf',
                title: 'Relatório de Convidados'
            },
            {
                extend: 'csv',
                title: 'Relatório de Convidados'
            },
            {
                extend: 'excel',
                title: 'Relatório de Convidados'
            }
        ],
        columns: [{
                data: "id",
                defaultContent: "",
                title: "Código",
                width: "5%"
            },
            {
                data: "nome",
                defaultContent: "",
                title: "Nome",
                width: "30%"
            },
            {
                data: "empresa",
                defaultContent: "",
                title: "Empresa",
                width: "20%"
            },
            {
                data: "email",
                defaultContent: "",
                title: "E-mail",
                width: "20%"
            },
            {
                data: "filiacao",
                defaultContent: "",
                title: "Filiação",
                width: "15%"
            },
            {
                data: "id",
                defaultContent: "",
                title: "",
                width: "10%",
                render: function(data, type, row, meta) {
                    var nome = row.nome + " (" + row.email + ")"
                    return '<button type="button" class="btn btn-primary btn-xs" data-toggle="button" onclick="alterarFiliado(' + data + ');">Alterar</button>' +
                        '<button type="button" class="btn btn-danger btn-xs" data-toggle="button" onclick=\'excluirFiliado(' + data + ',"' + nome + '");\'>Excluir</button>';
                }
            }
        ],
        paging: false,
        ordering: true,
        search: {
            regex: true
        },
        language: {
            info: "Mostrando _TOTAL_ registros",
            infoEmpty: "Nenhum registro para exibir",
            emptyTable: "Ninguém para exibir",
            infoFiltered: " de _MAX_ registros",
            search: "Filtrar:"
        }
    });

    mySimpleCalendar = FLUIGC.calendar('#nascimento', {
        pickDate: true,
        pickTime: false
    });
    $("#nascimento").on("blur", function(ev) {
        $("#nascimentoFiliado").val(moment($("#nascimento").val(), "DD/MM/YYYY").format("YYYY-MM-DD"));
    });

    $("#empresaidFiliado").on("change", function(ev) {

        var empresa = _.findWhere(listaEmpresas, {
            id: $("#empresaidFiliado").val()
        })

        $("#empresaFiliado").val(empresa.nome)

        var lista = new Array("lide", "lidefuturo", "lidemulher");
        _.each(lista, function(value, key, list) {
            $("#" + value + "Filiado").prop("checked", (empresa[value] == "1"));
        });

    })


    efetuarRequisicao("listarEmpresas.php", {}, function(retorno) {

        listaEmpresas = retorno;

        $("#empresaidFiliado").html('<option value="0"></option>');
        listaEmpresas.forEach(empresa => {
            $("#empresaidFiliado").append('<option value="' + empresa.id + '">' + empresa.nome + '</option>');
        })

    });


    criarACFiliados();

    carregarFiliados();

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

            tabelaFiliados.rows().remove().draw();
            tabelaFiliados.rows.add(acFiliado.items()).draw();

        })
        .on('fluig.autocomplete.itemUpdated', event => {

        })
        .on('fluig.autocomplete.itemRemoved', event => {

            if (acFiliado.items().length > 0) {
                tabelaFiliados.rows().remove().draw();
                tabelaFiliados.rows.add(acFiliado.items()).draw();
            } else {
                desenharFiliados()
            }

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
        voltar();

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

    tabelaFiliados.rows().remove().draw();
    tabelaFiliados.rows.add(filiadosFiltrados).draw();

}

function excluirFiliado(idFiliado, nomeFiliado) {

    Swal({
        title: 'Atenção',
        html: 'Confima a exclusão do filiado ' + nomeFiliado + '?',
        type: 'info',
        showCancelButton: true,
        allowOutsideClick: false,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#D8D8D8',
        confirmButtonText: 'Sim',
        cancelButtonText: 'Não'
    }).then(function(result) {
        if (result.value) {

            var obj = {
                "idcampo": idFiliado,
                "tipo": "DELETE",
                "tabela": "pessoa"
            };

            efetuarRequisicao("alterarTabela.php", obj, function(retorno) {
                if (retorno.success == true) {
                    FLUIGC.toast({
                        message: retorno.message,
                        type: 'success'
                    });

                    carregarFiliados();

                } else {
                    FLUIGC.toast({
                        message: retorno.message,
                        type: 'danger'
                    });
                }
            });

        }
    });

}

function alterarFiliado(idFiliado) {

    toggleCampoEmailSenha(true);


    var obj = {
        iduser: idFiliado
    };

    efetuarRequisicao("getFiliado.php", obj, function(retorno) {
        if (retorno.success == true) {
            carregarDados(retorno.dados);
        } else {
            FLUIGC.toast({
                message: retorno.message,
                type: 'danger'
            });
        }
    });

}

function carregarDados(filiado) {

    var lista = new Array("id", "nome", "nomeCompleto", "email", "cpf", "senha", "cargo", "empresa", "empresaid", "emailSec", "site", "tel", "telSec", "nascimento", "perfil", "vip", "qtd_convidados");
    _.each(lista, function(value, key, list) {
        $("#" + value + "Filiado").val(filiado[value]);
    });

    var lista = new Array("primeirologin", "compTel", "compTelSec", "compEmail", "compEmailSec", "status", "lide", "lidefuturo", "lidemulher", "patrocinador", "teste", "staff", "imprensa", "acessoApp", "admin");
    _.each(lista, function(value, key, list) {
        $("#" + value + "Filiado").prop("checked", (filiado[value] == "1"));
    });

    mySimpleCalendar.setDate(moment($("#nascimentoFiliado").val(), "YYYY-MM-DD"));
    //$("#imagem64Filiado").val(filiado.imagem);
    $("#falseinputFiliado").attr("src", filiado.imagem);

    $("#tabelaAlteracao").hide();
    $("#formularioAlteracao").show();
}

function novoFiliado() {

    toggleCampoEmailSenha(true);

    $("#idFiliado").val("NOVO");

    var lista = new Array("nome", "nomeCompleto", "email", "cpf", "senha", "cargo", "empresa", "empresaid", "emailSec", "site", "tel", "telSec", "nascimento", "perfil", "vip", "qtd_convidados");
    _.each(lista, function(value, key, list) {
        $("#" + value + "Filiado").val("");
    });

    var lista = new Array("primeirologin", "compTel", "compTelSec", "compEmail", "compEmailSec", "status", "lide", "lidefuturo", "lidemulher", "patrocinador", "teste", "staff", "imprensa", "acessoApp", "admin");
    _.each(lista, function(value, key, list) {
        $("#" + value + "Filiado").prop("checked", false);
    });
    $("#statusFiliado").prop("checked", true);

    mySimpleCalendar.setDate("");

    //$("#imagem64Filiado").val("img/avatar.png");
    $("#falseinputFiliado").attr("src", "avatar.png");

    $("#tabelaAlteracao").hide();
    $("#formularioAlteracao").show();
}

function voltar() {

    toggleCampoEmailSenha(false);

    $("#tabelaAlteracao").show();
    $("#formularioAlteracao").hide();
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

    var lista = new Array("primeirologin", "compTel", "compTelSec", "compEmail", "compEmailSec", "status", "lide", "lidefuturo", "lidemulher", "patrocinador", "teste", "staff", "imprensa", "acessoApp", "admin");
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

    //alterar para appfatec
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

function toggleCampoEmailSenha(exibir) {

    if (exibir) {
        if ($("#div_email_senha").html().trim() == "") {
            $("#div_email_senha").html(`
        <div class="col-md-6 col-sm-6 col-xs-12">
          <label>Email</label>
          <input type="text" class="form-control" name="emailFiliado" value="" id="emailFiliado" placeholder="" autocomplete="off" >
        </div>
        <div class="col-md-6 col-sm-6 col-xs-12">
          <label>Senha</label>
          <input type="password" class="form-control" name="senhaFiliado" value="" id="senhaFiliado" placeholder="" autocomplete="off" >
        </div>
      `);
        }
    } else {
        $("#div_email_senha").html(``);
    }


}