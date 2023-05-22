<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$_POST = json_decode(file_get_contents('php://input'), true);

$iduser = $_POST["iduser"];
$idevento = $_POST["idevento"];
$idimpressora = $_POST["idimpressora"];
$imprimir = $_POST["imprimir"];

if(($idevento === null) || ($idevento === "")){
    $retorno = array('success' => false,'message'=>'Evento não foi definido.');
    echo json_encode($retorno);
    return;
}

if(($iduser === null) || ($iduser === "")){
    $retorno = array('success' => false,'message'=>'Usuário não foi definido.');
    echo json_encode($retorno);
    return;
}

if(($idimpressora === null) || ($idimpressora === "")){
    $retorno = array('success' => false,'message'=>'Impressora não foi definido.');
    echo json_encode($retorno);
    return;
}

if(($imprimir === null) || ($imprimir === "")){
    $retorno = array('success' => false,'message'=>'Impressão não foi definido.');
    echo json_encode($retorno);
    return;
}

$lat = 0;
$long = 0;

include("conexao.php");

$retorno = array('success' => false,'message'=>'Erro não identificado.');

$sql = "SELECT id,checkin,checkout FROM checkin WHERE idevento = $idevento AND iduser = $iduser";
$consulta =  mysqli_query($con,$sql);
if($resultado = mysqli_fetch_assoc($consulta)){
    $idcheck = $resultado["id"];

        $sql = "UPDATE checkin SET confirmar = 1 WHERE id = $idcheck";
        $consulta = mysqli_query($con, $sql);
        if($consulta){
            $retorno = array('success' => true,'message'=>'Confirmação realizado com sucesso.');
        }else{
            $retorno = array('success' => false,'message'=>'Erro ao realizar confirmação. #1');
        }    

}else{
    $sql = "INSERT INTO checkin(idevento, iduser, latitude, longitude, confirmar, checkin, checkout) values($idevento, $iduser, $lat, $long, 1,0,0)";
    $consulta = mysqli_query($con, $sql);
    if($consulta){
        $retorno = array('success' => true,'message'=>'Confirmação realizado com sucesso.');
    }else{
        $retorno = array('success' => false,'message'=>'Erro ao realizar confirmação. #3');
    }
}

mysqli_close($con);

echo json_encode($retorno);


?>