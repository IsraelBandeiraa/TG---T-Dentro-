<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
include("conexao.php");

$_POST = json_decode(file_get_contents('php://input'), true);

$iduser = $_POST["iduser"];

if(($iduser === null) || ($iduser === "")){
    $retorno = array('success' => false,'message'=>'Filiado não foi definido.');
    echo json_encode($retorno);
    return;
}

$sql = "SELECT p.* FROM pessoa p WHERE p.id = $iduser";
$consulta =  mysqli_query($con,$sql);
$resultado = mysqli_fetch_assoc($consulta);

mysqli_close($con);

$retorno = array('success' => true,'dados'=>$resultado);
echo json_encode($retorno);

?>