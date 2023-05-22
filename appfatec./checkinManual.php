<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$_POST = json_decode(file_get_contents('php://input'), true);

$iduser = $_POST["iduser"];
$nomeUser = $_POST["nomeUser"];
$emailUser = $_POST["emailUser"];
$idevento = $_POST["idevento"];
$nomeEvento = $_POST["nomeEvento"];
$dataEvento = $_POST["dataEvento"];
$horaEvento = $_POST["horaEvento"];
$idimpressora = $_POST["idimpressora"];
$imprimir = $_POST["imprimir"];
$checkin = $_POST["checkin"];
$checkout = $_POST["checkout"];
$confirmar = $_POST["confirmar"];

include("conexao.php");


if (($idevento === null) || ($idevento === "")) {
    $retorno = array('success' => false, 'message' => 'Evento não foi definido.');
    echo json_encode($retorno);
    return;
}

if (($iduser === null) || ($iduser === "")) {
    $retorno = array('success' => false, 'message' => 'Usuário não foi definido.');
    echo json_encode($retorno);
    return;
}

if (($idimpressora === null) || ($idimpressora === "")) {
    $retorno = array('success' => false, 'message' => 'Impressora não foi definido.');
    echo json_encode($retorno);
    return;
}

if (($imprimir === null) || ($imprimir === "")) {
    $retorno = array('success' => false, 'message' => 'Impressão não foi definido.');
    echo json_encode($retorno);
    return;
}

if ((($checkin === null) || ($checkin === "")) && (($checkout === null) || ($checkout === "")) && (($confirmar === null) || ($confirmar === ""))) {
    $retorno = array('success' => false, 'message' => 'Nenhuma ação foi definida.');
    echo json_encode($retorno);
    return;
}

$dados = array();
if ($confirmar == "1") {
    $dados['confirmar'] = '1';
    $dados['confirmardatahora'] = 'NOW()';
    $dados['confirmoumanual'] = '1';

    $podeRegistrar = false;
    $confirmados = 0;
    $vagas = 0;

    $sqlConf = "SELECT COUNT(*) confirmados FROM checkin WHERE idevento = '$idevento' AND confirmar = 1";
    $consultaConf = mysqli_query($con, $sqlConf);
    if ($resultadoConf = mysqli_fetch_assoc($consultaConf)) {
        $confirmados = $resultadoConf["confirmados"];
    }

    $sqlVagas = "SELECT vagas FROM evento WHERE id = '$idevento'";
    $consultaVagas = mysqli_query($con, $sqlVagas);
    if ($resultadoVagas = mysqli_fetch_assoc($consultaVagas)) {
        $vagas = $resultadoVagas["vagas"];
    }

    if (!(($vagas == 0) || ($confirmar == 0) || ($confirmados < $vagas))) {
        $retorno = array('success' => false, 'message' => 'NÃO foi possivel confirmar a presença, VAGAS ESGOTADAS.');
        echo json_encode($retorno);
        return;
    }
}
if ($checkin == "1") {
    $dados['checkin'] = '1';
    $dados['checkindatahora'] = 'NOW()';
    $dados['checkinmanual'] = '1';
}
if ($checkout == "1") {
    $dados['checkout'] = '1';
    $dados['checkoutdatahora'] = 'NOW()';
    $dados['checkoutmanual'] = '1';
}

$lat = 0;
$long = 0;



$retorno = array('success' => false, 'message' => 'Erro não identificado.');

$sql = "SELECT id,checkin,checkout FROM checkin WHERE idevento = $idevento AND iduser = $iduser";
$consulta =  mysqli_query($con, $sql);
if ($resultado = mysqli_fetch_assoc($consulta)) {

    $sqlValores = "";
    foreach ($dados as $key => $valor) {
        if ($sqlValores != "") {
            $sqlValores = "$sqlValores,$key=$valor";
        } else {
            $sqlValores = "$key='$valor'";
        }
    }

    $idcheck = $resultado["id"];

    $sql = "UPDATE checkin SET $sqlValores WHERE id = $idcheck";
    $consulta = mysqli_query($con, $sql);
    if ($consulta) {
        $retorno = array('success' => true, 'message' => 'Ação realizada com sucesso.');

        if ($imprimir == "1") {
            $sql = "INSERT INTO imprimir(idevento, idpessoa, impressora) values($idevento, $iduser, $idimpressora)";
            $consulta = mysqli_query($con, $sql);

            $name = "zlog_impressao_e_" . $idevento . "_i_" . $idimpressora . ".txt";
            $text = "$iduser\n";
            $file = fopen($name, 'a');
            fwrite($file, $text);
            fclose($file);
        }
    } else {
        $retorno = array('success' => false, 'message' => 'Erro ao realizar ação. #1. Erro:' . mysqli_error($con));
    }
} else {
    $dados['idevento'] = $idevento;
    $dados['iduser'] = $iduser;
    $dados['latitude'] = $lat;
    $dados['longitude'] = $long;
    if ($confirmar == "0") {
        $dados['confirmar'] = '0';
    }
    if ($checkin == "0") {
        $dados['checkin'] = '0';
    }
    if ($checkout == "0") {
        $dados['checkout'] = '0';
    }

    $sqlCampos = "";
    $sqlValores = "";
    foreach ($dados as $key => $valor) {
        if ($sqlValores != "") {
            $sqlCampos = "$sqlCampos,$key";
            $sqlValores = "$sqlValores,$valor";
        } else {
            $sqlCampos = "$key";
            $sqlValores = "'$valor'";
        }
    }

    $sql = "INSERT INTO checkin($sqlCampos) values($sqlValores)";
    $consulta = mysqli_query($con, $sql);
    if ($consulta) {
        $retorno = array('success' => true, 'message' => 'Ação realizada com sucesso.');

        if ($imprimir == "1") {
            $sql = "INSERT INTO imprimir(idevento, idpessoa, impressora) values($idevento, $iduser, $idimpressora)";
            $consulta = mysqli_query($con, $sql);

            $name = "zlog_impressao_e_" . $idevento . "_i_" . $idimpressora . ".txt";
            $text = "$iduser\n";
            $file = fopen($name, 'a');
            fwrite($file, $text);
            fclose($file);
        }
    } else {
        $retorno = array('success' => false, 'message' => "Erro ao realizar check-in. #2. $sql Erro:" . mysqli_error($con));
    }
}

/*enviar email com qrcode
$imgQrCode = "QR_code" . $iduser . ".png";
include("notificacao.php");
include("geraQrCode.php");

$mensagem = " <html>
    
        <head>
            <meta charset='utf-8'>
            <title>Tô Dentro!</title>
        </head>
        
        <body lang='PT-BR' link='#0563C1' vlink='#954F72'>
            <div class='WordSection1'>
                <p class='MsoNormal'>
                    <img src=''>
                </p>
                <p class='MsoNormal'>
                    <o:p>&nbsp;</o:p>
                </p>
                <h2 style='mso-margin-top-alt:15.0pt;margin-right:0cm;margin-bottom:7.5pt;margin-left:0cm'>
                    <span style='font-size:22.5pt;font-family:&quot;Calibri&quot;,sans-serif;color:#333333;font-weight:normal'>
                        Olá, 
                    </span>
                </h2>
                <p style='mso-margin-top-alt:0cm;margin-right:0cm;margin-bottom:7.5pt;margin-left:0cm;box-sizing: border-box'>
                    <span style='font-size:12.5pt;font-family:&quot;Calibri&quot;,sans-serif;color:#333333'>
                    Seu cadastro foi efetuado com sucesso para participação do evento $nomeEvento. Caso necessário, apresente o QR Code abaixo para fazer check-in. 
                    </span>
                </p>
                <p style='mso-margin-top-alt:0cm;margin-right:0cm;margin-bottom:7.5pt;margin-left:0cm;box-sizing: border-box'>
                    <span style='font-size:12.5pt;font-family:&quot;Calibri&quot;,sans-serif;color:#333333'>
                        <br />
                        <img src='https://www.clientestotvssm.com.br/appfatec/qrcodes/$imgQrCode'/>
                    </span>
                </p>
                <p style='mso-margin-top-alt:0cm;margin-right:0cm;margin-bottom:7.5pt;margin-left:0cm;box-sizing: border-box'>
                    <span style='font-size:12.5pt;font-family:&quot;Calibri&quot;,sans-serif;color:#333333'>
                        Data: $dataEvento
                    </span>
                </p>
                <p style='mso-margin-top-alt:0cm;margin-right:0cm;margin-bottom:7.5pt;margin-left:0cm;box-sizing: border-box'>
                    <span style='font-size:12.5pt;font-family:&quot;Calibri&quot;,sans-serif;color:#333333'>
                        Hora: $horaEvento
                    </span>
                </p>
                <p style='mso-margin-top-alt:0cm;margin-right:0cm;margin-bottom:7.5pt;margin-left:0cm;box-sizing: border-box'>
                    <span style='font-size:8.5pt;font-family:&quot;Calibri&quot;,sans-serif;color:#333333'>
                            Esta é uma mensagem automática.
                            <br />Por favor, não responda.
                      </span>
                </p>
            </div>
        </body>
        
        </html> ";

$remetente = array('nome' => "Equipe Tô Dentro!");
$destinatarios = array();
array_push($destinatarios, array('email' => $emailUser, 'nome' => $nomeUser));
$assunto = "Confirmação de Evento - QR CODE";
$ishtml = true;

enviarEmail($remetente, $destinatarios, $assunto, $mensagem, $ishtml);*/


mysqli_close($con);

echo json_encode($retorno);
