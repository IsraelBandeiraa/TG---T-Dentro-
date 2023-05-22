$(document).ready(function() {
    console.log("ready!");
    $("#navbar").load("../../header.html");
});

// var url = "https://www.clientestotvssm.com.br/";
var url = "https://www.clientestotvssm.com.br/";

var filiados = null;

function carregarPagina() {

    $("#formularioAlteracao").hide();

    tabelaFiliados = $('#tabelaFiliados').DataTable({
        dom: '<"#botaoNovo">Bfrit',
        buttons: [{ extend: 'pdf', title: 'Relatório de empresas cadastradas' },
            { extend: 'csv', title: 'Relatório de empresas cadastradas' },
            { extend: 'excel', title: 'Relatório de empresas cadastradas' }
        ],
        columns: [
            { data: "id", defaultContent: "", title: "Código", width: "5%" },
            { data: "nome", defaultContent: "", title: "Nome", width: "30%" },
            { data: "filiacao", defaultContent: "", title: "Filiação", width: "15%" },
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
        ordering: false,
        language: {
            info: "Mostrando _TOTAL_ registros",
            infoEmpty: "Nenhum registro para exibir",
            emptyTable: "Nenhum Filiado para exibir",
            infoFiltered: " de _MAX_ registros",
            search: "Filtrar: "
        }
    });

    $("#botaoNovo").html('<button type="button" class="btn btn-primary" data-toggle="button" onclick="novoFiliado();">Novo</button>');

    carregarFiliados();

}

function carregarFiliados() {

    voltar();

    var myLoading1 = FLUIGC.loading(window);
    myLoading1.show();

    var obj = {
        idEvento: ""
    };

    $.post(url + 'appfatec/listarEmpresas.php',
        JSON.stringify(obj),
        function(retorno) {
            filiados = retorno;

            console.log(filiados);

            _.each(filiados, function(value, key, list) {
                var filiacao = "Convidado";
                if ((value.lide == "1") && (value.lidefuturo == "1") && (value.lidemulher == "1")) {
                    filiacao = "LIDE, LIDE Futuro e LIDE Mulher";
                } else if ((value.lide == "1") && (value.lidefuturo == "1")) {
                    filiacao = "LIDE e LIDE Futuro";
                } else if ((value.lide == "1") && (value.lidemulher == "1")) {
                    filiacao = "LIDE e LIDE Mulher";
                } else if ((value.lidefuturo == "1") && (value.lidemulher == "1")) {
                    filiacao = "LIDE Futuro e LIDE Mulher";
                } else if (value.lide == "1") {
                    filiacao = "LIDE";
                } else if (value.lidefuturo == "1") {
                    filiacao = "LIDE Futuro";
                } else if (value.lidemulher == "1") {
                    filiacao = "LIDE Mulher";
                }
                if (value.patrocinador == "1") {
                    filiacao += " Patrocinador";
                }
                list[key]["filiacao"] = filiacao;
            });

            desenharFiliados();
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

function desenharFiliados() {

    tabelaFiliados.rows().remove().draw();
    tabelaFiliados.rows.add(filiados).draw();

}

function excluirFiliado(idFiliado, nomeFiliado) {

    Swal({
        title: 'Atenção',
        html: 'Confima a exclusão da ' + nomeFiliado + '?',
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
                "tabela": "empresa"
            };

            $.post(url + 'appfatec/alterarTabela.php',
                JSON.stringify(obj),
                function(retorno) {
                    if (retorno.success == true) {
                        FLUIGC.toast({
                            message: retorno.message,
                            type: 'success'
                        });

                        voltar();
                        carregarFiliados();
                    } else {
                        FLUIGC.toast({
                            message: retorno.message,
                            type: 'danger'
                        });
                    }
                },
                "json"
            ).fail(function(retorno) {
                FLUIGC.toast({
                    message: 'Erro ao buscar filiado!',
                    type: 'danger'
                });
            }).always(function(retorno) {
                var myLoading1 = FLUIGC.loading(window);
                myLoading1.hide();
            });

        }
    });

}

function alterarFiliado(idFiliado) {

    var obj = {
        iduser: idFiliado
    };

    $.post(url + 'appfatec/getEmpresa.php',
        JSON.stringify(obj),
        function(retorno) {
            if (retorno.success == true) {
                carregarDados(retorno.dados);
            } else {
                FLUIGC.toast({
                    message: retorno.message,
                    type: 'danger'
                });
            }
        },
        "json"
    ).fail(function(retorno) {
        FLUIGC.toast({
            message: 'Erro ao buscar empresa!',
            type: 'danger'
        });
    }).always(function(retorno) {
        var myLoading1 = FLUIGC.loading(window);
        myLoading1.hide();
    });

}

function carregarDados(filiado) {

    var lista = new Array("id", "nome", "endereco", "segmento", "site", "tel");
    _.each(lista, function(value, key, list) {
        $("#" + value + "Filiado").val(filiado[value]);
    });

    var lista = new Array("status", "lide", "lidefuturo", "lidemulher");
    _.each(lista, function(value, key, list) {
        $("#" + value + "Filiado").prop("checked", (filiado[value] == "1"));
    });

    $("#imagem64Filiado").val(filiado.foto);
    $("#falseinputFiliado").attr("src", filiado.foto);

    $("#tabelaAlteracao").hide();
    $("#formularioAlteracao").show();
}

function novoFiliado() {

    $("#idFiliado").val("NOVO");

    var lista = new Array("id", "nome", "endereco", "segmento", "site", "tel");
    _.each(lista, function(value, key, list) {
        $("#" + value + "Filiado").val("");
    });

    var lista = new Array("status", "lide", "lidefuturo", "lidemulher");
    _.each(lista, function(value, key, list) {
        $("#" + value + "Filiado").prop("checked", false);
    });
    $("#statusFiliado").prop("checked", true);

    $("#imagem64Filiado").val("img/empresa.jpg");
    $("#falseinputFiliado").attr("src", "img/empresa.jpg");

    $("#tabelaAlteracao").hide();
    $("#formularioAlteracao").show();
}

function voltar() {

    $("#tabelaAlteracao").show();
    $("#formularioAlteracao").hide();
}

function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function(e) {
            $('#falseinputFiliado').attr('src', e.target.result);
            $('#imagem64Filiado').val(e.target.result);
        };
        reader.readAsDataURL(input.files[0]);
    }
}

function enviarFiliado() {

    var nome = $("#nome").val();

    if (nome == "") {
        FLUIGC.toast({
            message: 'Informe o nome da empresa.',
            type: 'warning'
        });
        return;
    }

    var objDados = new Object()

    var lista = new Array("nome", "endereco", "segmento", "site", "tel");
    _.each(lista, function(value, key, list) {
        objDados[value] = $("#" + value + "Filiado").val();
    });

    var lista = new Array("status", "lide", "lidefuturo", "lidemulher");
    _.each(lista, function(value, key, list) {
        objDados[value] = ($("#" + value + "Filiado").is(":checked") ? "1" : "0");
    });

    objDados['foto'] = $('#imagem64Filiado').val();

    var idcampo = $('#idFiliado').val();
    var tipo = "UPDATE"
    if (idcampo == 'NOVO') {
        tipo = "INSERT"
    }

    var myLoading1 = FLUIGC.loading(window);
    myLoading1.show();

    var obj = {
        "idcampo": idcampo,
        "tipo": tipo,
        "tabela": "empresa",
        "dados": objDados
    };

    console.log(obj);

    $.post(url + 'appfatec/alterarTabela.php',
        JSON.stringify(obj),
        function(retorno) {
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
        },
        "json"
    ).fail(function(retorno) {
        FLUIGC.toast({
            message: 'Erro ao cadastrar empresa!',
            type: 'danger'
        });
    }).always(function(retorno) {
        var myLoading1 = FLUIGC.loading(window);
        myLoading1.hide();
    });

}