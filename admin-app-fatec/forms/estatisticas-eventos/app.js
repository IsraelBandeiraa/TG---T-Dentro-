$(document).ready(function() {
    console.log("ready!");
    $("#navbar").load("../../header.html");
});

window.chartColors = {
    red: 'rgb(255, 99, 132)',
    orange: 'rgb(255, 159, 64)',
    yellow: 'rgb(255, 205, 86)',
    green: 'rgb(50, 205, 50)',
    blue: 'rgb(54, 162, 235)',
    purple: 'rgb(153, 102, 255)',
    grey: 'rgb(201, 203, 207)'
};

var url = "https://www.clientestotvssm.com.br/";

var eventos = null;
var perguntas = null;

function carregarPagina() {

    tabelaFiliadosCompareceram = $('#tabelaFiliadosCompareceram').DataTable({
        dom: 'Bt',
        buttons: [{
                extend: 'pdf',
                title: 'Relatório de Pessoas que compareceram'
            },
            {
                extend: 'csv',
                title: 'Relatório de Pessoas que compareceram'
            },
            {
                extend: 'excel',
                title: 'Relatório de Pessoas que compareceram'
            }
        ],
        columns: [{
                data: "iduser",
                defaultContent: "",
                title: "Código"
            },
            {
                data: "nome",
                defaultContent: "",
                title: "Nome"
            },
            {
                data: "email",
                defaultContent: "",
                title: "Email"
            },
            {
                data: "empresa",
                defaultContent: "",
                title: "Empresa"
            },
            {
                data: "filiacao",
                defaultContent: "",
                title: "Filiação"
            }
        ],
        paging: false,
        ordering: false,
        language: {
            info: "Mostrando _TOTAL_ registros",
            infoEmpty: "Nenhum registro para exibir",
            emptyTable: "Ninguém irá comparecer",
            infoFiltered: " de _MAX_ registros",
            search: "Filtrar: "
        }
    });

    tabelaConvidadosCompareceram = $('#tabelaConvidadosCompareceram').DataTable({
        dom: 'Bt',
        buttons: [{
                extend: 'pdf',
                title: 'Relatório de convidados de Pessoas que compareceram'
            },
            {
                extend: 'csv',
                title: 'Relatório de convidados de Pessoas que compareceram'
            },
            {
                extend: 'excel',
                title: 'Relatório de convidados de Pessoas que compareceram'
            }
        ],
        columns: [{
                data: "iduser",
                defaultContent: "",
                title: "Código"
            },
            {
                data: "nome",
                defaultContent: "",
                title: "Nome"
            },
            {
                data: "email",
                defaultContent: "",
                title: "Email"
            },
            {
                data: "empresa",
                defaultContent: "",
                title: "Empresa"
            },
            {
                data: "filiacao",
                defaultContent: "",
                title: "Filiação"
            }
        ],
        paging: false,
        ordering: false,
        language: {
            info: "Mostrando _TOTAL_ registros",
            infoEmpty: "Nenhum registro para exibir",
            emptyTable: "Ninguém irá comparecer",
            infoFiltered: " de _MAX_ registros",
            search: "Filtrar: "
        }
    });

    tabelaPatrocinadoresCompareceram = $('#tabelaPatrocinadoresCompareceram').DataTable({
        dom: 'Bt',
        buttons: [{
                extend: 'pdf',
                title: 'Relatório de convidados de Pessoas que compareceram'
            },
            {
                extend: 'csv',
                title: 'Relatório de convidados de Pessoas que compareceram'
            },
            {
                extend: 'excel',
                title: 'Relatório de convidados de Pessoas que compareceram'
            }
        ],
        columns: [{
                data: "iduser",
                defaultContent: "",
                title: "Código"
            },
            {
                data: "nome",
                defaultContent: "",
                title: "Nome"
            },
            {
                data: "email",
                defaultContent: "",
                title: "Email"
            },
            {
                data: "empresa",
                defaultContent: "",
                title: "Empresa"
            },
            {
                data: "filiacao",
                defaultContent: "",
                title: "Filiação"
            }
        ],
        paging: false,
        ordering: false,
        language: {
            info: "Mostrando _TOTAL_ registros",
            infoEmpty: "Nenhum registro para exibir",
            emptyTable: "Ninguém não irá comparecer",
            infoFiltered: " de _MAX_ registros",
            search: "Filtrar: "
        }
    });

    tabelaNaoCompareceram = $('#tabelaNaoCompareceram').DataTable({
        dom: 'Bt',
        buttons: [{
                extend: 'pdf',
                title: 'Relatório de convidados de Pessoas que compareceram'
            },
            {
                extend: 'csv',
                title: 'Relatório de convidados de Pessoas que compareceram'
            },
            {
                extend: 'excel',
                title: 'Relatório de convidados de Pessoas que compareceram'
            }
        ],
        columns: [{
                data: "iduser",
                defaultContent: "",
                title: "Código"
            },
            {
                data: "nome",
                defaultContent: "",
                title: "Nome"
            },
            {
                data: "email",
                defaultContent: "",
                title: "Email"
            },
            {
                data: "empresa",
                defaultContent: "",
                title: "Empresa"
            },
            {
                data: "filiacao",
                defaultContent: "",
                title: "Filiação"
            }
        ],
        paging: false,
        ordering: false,
        language: {
            info: "Mostrando _TOTAL_ registros",
            infoEmpty: "Nenhum registro para exibir",
            emptyTable: "Ninguém não irá comparecer",
            infoFiltered: " de _MAX_ registros",
            search: "Filtrar: "
        }
    });

    tabelaCheckin = $('#tabelaCheckin').DataTable({
        dom: 'Bt',
        buttons: [{
                extend: 'pdf',
                title: 'Relatório de Pessoas que fizeram check-in'
            },
            {
                extend: 'csv',
                title: 'Relatório de Pessoas que fizeram check-in'
            },
            {
                extend: 'excel',
                title: 'Relatório de Pessoas que fizeram check-in'
            }
        ],
        columns: [{
                data: "iduser",
                defaultContent: "",
                title: "Código"
            },
            {
                data: "nome",
                defaultContent: "",
                title: "Nome"
            },
            {
                data: "email",
                defaultContent: "",
                title: "Email"
            },
            {
                data: "empresa",
                defaultContent: "",
                title: "Empresa"
            },
            {
                data: "filiacao",
                defaultContent: "",
                title: "Filiação"
            },
            {
                data: "confirmar",
                defaultContent: "",
                title: "Confirmou",
                render: function(data, type, row, meta) {
                    return ((data == "1") ? "Sim" + ((row.confirmoumanual == "0") ? " APP" : "") : "Não");
                }
            },
            {
                data: "checkindatahora",
                defaultContent: "",
                title: "Horário",
                render: function(data, type, row, meta) {
                    return moment(data, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
                }
            }
        ],
        paging: false,
        ordering: false,
        language: {
            info: "Mostrando _TOTAL_ registros",
            infoEmpty: "Nenhum registro para exibir",
            emptyTable: "Ninguém fez check-in",
            infoFiltered: " de _MAX_ registros",
            search: "Filtrar: "
        }
    });

    tabelaCheckout = $('#tabelaCheckout').DataTable({
        dom: 'Bt',
        buttons: [{
                extend: 'pdf',
                title: 'Relatório de pessoas que fizeram check-out'
            },
            {
                extend: 'csv',
                title: 'Relatório de pessoas que fizeram check-out'
            },
            {
                extend: 'excel',
                title: 'Relatório de pessoas que fizeram check-out'
            }
        ],
        columns: [{
                data: "iduser",
                defaultContent: "",
                title: "Código"
            },
            {
                data: "nome",
                defaultContent: "",
                title: "Nome"
            },
            {
                data: "email",
                defaultContent: "",
                title: "Email"
            },
            {
                data: "empresa",
                defaultContent: "",
                title: "Empresa"
            },
            {
                data: "filiacao",
                defaultContent: "",
                title: "Filiação"
            },
            {
                data: "checkoutdatahora",
                defaultContent: "",
                title: "Horário",
                render: function(data, type, row, meta) {
                    return moment(data, "YYYY-MM-DD HH:mm:ss").format("DD/MM/YYYY HH:mm:ss");
                }
            }
        ],
        paging: false,
        ordering: false,
        language: {
            info: "Mostrando _TOTAL_ registros",
            infoEmpty: "Nenhum registro para exibir",
            emptyTable: "Ninguém fez check-out",
            infoFiltered: " de _MAX_ registros",
            search: "Filtrar: "
        }
    });

    buscarEventos();

}

function buscarEventos() {

    var myLoading1 = FLUIGC.loading(window);
    myLoading1.show();

    $.post(url + 'appfatec/listaEventos.php',
        "",
        function(retorno) {
            eventos = retorno;
            carregarDados();
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

function carregarDados() {

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
        atualizarEstatisticas();
    });

    autoCompleteEvento.on('fluig.autocomplete.itemRemoved', function(ev) {
        atualizarEstatisticas();
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

            if (proximoEvento) {
                evento = _.where(eventos, {
                    id: proximoEvento.id
                });
                if (evento.length == 1) {
                    autoCompleteEvento.add(evento[0]);
                } else {
                    autoCompleteEvento.add(eventos[eventos.length - 1]);
                }
            } else {
                autoCompleteEvento.add(eventos[eventos.length - 1]);
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

function atualizarEstatisticas() {

    if (typeof window.myPieLocal != "undefined") {
        window.myPieLocal.destroy();
        delete window.myPieLocal;
        $("#containerPieLocal").html('<canvas id="canvasPieLocal"></canvas>');
    }
    tabelaFiliadosCompareceram.rows().remove().draw();
    tabelaConvidadosCompareceram.rows().remove().draw();
    tabelaPatrocinadoresCompareceram.rows().remove().draw();
    tabelaNaoCompareceram.rows().remove().draw();
    tabelaCheckin.rows().remove().draw();
    tabelaCheckout.rows().remove().draw();

    var myLoading1 = FLUIGC.loading("#graficos");
    myLoading1.show();

    buscarDados();

}

function buscarDados() {

    eventoSelecionado = autoCompleteEvento.items();

    if (eventoSelecionado.length == 0) {
        return;
    }

    var obj = {
        idevento: eventoSelecionado[0].id
    }

    $.post(url + 'appfatec/estatisticasevento.php',
        JSON.stringify(obj),
        function(retorno) {
            renderizarGrafico(retorno);
        },
        "json"
    ).fail(function(retorno) {
        FLUIGC.toast({
            message: 'Erro ao enviar post!',
            type: 'danger'
        });
    }).always(function(retorno) {
        var myLoading1 = FLUIGC.loading("#graficos");
        myLoading1.hide();
    });

}

function renderizarGrafico(dados) {

    _.each(dados.lista, function(value, key, list) {
        var filiacao = "Convidado";
        if ((value.lide == "1") && (value.lidefuturo == "1")) {
            filiacao = "LIDE e LIDE Futuro";
        } else if (value.lide == "1") {
            filiacao = "LIDE";
        } else if (value.lidefuturo == "1") {
            filiacao = "LIDE Futuro";
        }
        if (value.patrocinador == "1") {
            filiacao += " Patrocinador";
        }
        list[key]["filiacao"] = filiacao;
    });

    dados.lista = _.sortBy(dados.lista, 'nome');

    var lista3 = _.where(dados.lista, {
        checkin: "1",
        lide: "1",
        lidefuturo: "1"
    });
    var lista1 = _.where(dados.lista, {
        checkin: "1",
        lide: "1",
        lidefuturo: "0"
    });
    var lista2 = _.where(dados.lista, {
        checkin: "1",
        lide: "0",
        lidefuturo: "1"
    });
    var listaFiliadosCompareceram = _.union(lista3, lista1, lista2);
    listaFiliadosCompareceram = _.sortBy(listaFiliadosCompareceram, 'nome');
    tabelaFiliadosCompareceram.rows.add(listaFiliadosCompareceram).draw();

    var listaConvidadosCompareceram = _.where(dados.lista, {
        checkin: "1",
        lide: "0",
        lidefuturo: "0",
        patrocinador: "0"
    });
    tabelaConvidadosCompareceram.rows.add(listaConvidadosCompareceram).draw();

    var listaPatrocinadoresCompareceram = _.where(dados.lista, {
        checkin: "1",
        lide: "0",
        lidefuturo: "0",
        patrocinador: "1"
    });
    tabelaPatrocinadoresCompareceram.rows.add(listaPatrocinadoresCompareceram).draw();

    var listaConfirmouPresenca = _.where(dados.lista, {
        confirmar: "1"
    });

    var listaNaoComparecera = _.where(dados.lista, {
        confirmar: "1",
        checkin: "0"
    });
    tabelaNaoCompareceram.rows.add(listaNaoComparecera).draw();

    var listaCheckin = _.where(dados.lista, {
        checkin: "1"
    });
    listaCheckin = _.sortBy(listaCheckin, 'checkindatahora');
    tabelaCheckin.rows.add(listaCheckin).draw();

    var listaCheckout = _.where(dados.lista, {
        checkout: "1"
    });
    listaCheckout = _.sortBy(listaCheckout, 'checkoutdatahora');
    tabelaCheckout.rows.add(listaCheckout).draw();

    var lista3 = _.where(dados.lista, {
        checkin: "1",
        lide: "1",
        lidefuturo: "1",
        confirmar: "1",
        confirmoumanual: "0"
    });
    var lista1 = _.where(dados.lista, {
        checkin: "1",
        lide: "1",
        lidefuturo: "0",
        confirmar: "1",
        confirmoumanual: "0"
    });
    var lista2 = _.where(dados.lista, {
        checkin: "1",
        lide: "0",
        lidefuturo: "1",
        confirmar: "1",
        confirmoumanual: "0"
    });
    var listaFiliadosCompareceramAPP = _.union(lista3, lista1, lista2);
    var listaCheckinAPP = _.where(dados.lista, {
        checkin: "1",
        checkinmanual: "0"
    });
    var listaCheckoutAPP = _.where(dados.lista, {
        checkout: "1",
        checkoutmanual: "0"
    });

    $("#divResumo").html("");
    $("#divResumo").append("<div>" + listaConfirmouPresenca.length + " Confirmaram presença.</div>");
    $("#divResumo").append("<div>" + listaFiliadosCompareceram.length + " Pessoas que compareceram ao evento.</div>");
    $("#divResumo").append("<div>" + listaConvidadosCompareceram.length + " Convidados de Pessoas que compareceram ao evento.</div>");
    $("#divResumo").append("<div>" + listaPatrocinadoresCompareceram.length + " Convidados de patrocinadores compareceram ao evento.</div>");
    $("#divResumo").append("<div>" + listaNaoComparecera.length + " Confirmaram presença e não compareceram.</div>");
    $("#divResumo").append("<div>" + listaCheckin.length + " Pessoas compareceram ao evento.</div>");
    // $("#divResumo").append("<div>" + listaFiliadosCompareceramAPP.length + " Pessoas que confirmaram presença via APP.</div>");
    // $("#divResumo").append("<div>" + listaCheckinAPP.length + " Pessoas que fizeram check-in usando APP.</div>");
    // $("#divResumo").append("<div>" + listaCheckoutAPP.length + " Pessoass fizeram check-out usando APP.</div>");

    var comparecera = listaNaoComparecera.length;
    var checkin = listaCheckin.length;
    var checkout = listaCheckout.length;
    var total = (comparecera + checkin + checkout);

    var compareceraPerc = (comparecera / total * 100).toFixed(2);
    var checkinPerc = (checkin / total * 100).toFixed(2);
    var checkoutPerc = (checkout / total * 100).toFixed(2);

    $("#labelTotal").html("Total (" + total + ")")

    var config = {
        type: 'pie',
        data: {
            datasets: [{
                data: [
                    compareceraPerc,
                    checkinPerc,
                    checkoutPerc
                ],
                borderColor: [
                    Color(window.chartColors.red).rgbString(),
                    Color(window.chartColors.blue).rgbString(),
                    Color(window.chartColors.grey).rgbString()
                ],
                backgroundColor: [
                    Color(window.chartColors.red).alpha(0.3).rgbString(),
                    Color(window.chartColors.blue).alpha(0.3).rgbString(),
                    Color(window.chartColors.grey).alpha(0.3).rgbString()
                ],
                label: 'Presenças'
            }],
            labels: [
                "Confirmaram (" + comparecera + ")",
                "Fez check-in (" + checkin + ")",
                "Fez check-out (" + checkout + ")"
            ]
        },
        options: {
            maintainAspectRatio: false,
            tooltips: {
                callbacks: {
                    label: function(tooltipItem, data) {
                        return data.labels[tooltipItem.index] + " " + data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index] + "%"
                    }
                }
            }

        }
    };

    var ctx = document.getElementById("canvasPieLocal").getContext("2d");
    window.myPieLocal = new Chart(ctx, config);

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