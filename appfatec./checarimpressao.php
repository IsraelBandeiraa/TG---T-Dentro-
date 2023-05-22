<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$_POST = json_decode(file_get_contents('php://input'), true);

if(($_GET["e"] === null) || ($_GET["e"] === "")){
    $retorno = array('success' => false,'message'=>'Evento não foi definido.');
    echo json_encode($retorno);
    return;
}

if(($_GET["i"] === null) || ($_GET["e"] === "")){
    $retorno = array('success' => false,'message'=>'Impressora não foi definida.');
    echo json_encode($retorno);
    return;
}

$idevento = $_GET["e"];
$idimpressora = $_GET["i"];
$dados =  array();

include("conexao.php");

$sql = "SELECT i.id,p.id as idPessoa,p.nome,p.empresa,p.lide,p.lidefuturo, p.vip, p.staff, p.imprensa, NOT ISNULL(pe.id) primeiroevento
        FROM imprimir i 
        INNER JOIN pessoa p ON p.id = i.idpessoa
        LEFT JOIN primeiroevento pe ON pe.idpessoa = i.idpessoa AND pe.idevento = i.idevento
        WHERE i.idevento = $idevento 
        AND i.impressora = $idimpressora";
$consulta =  mysqli_query($con,$sql);
while($resultado = mysqli_fetch_assoc($consulta)){
    array_push($dados, array('id' => $resultado['id'], 
                            'nome' => $resultado['nome'], 
                            'empresa' => $resultado['empresa'],
                            'idPessoa' => $resultado['idPessoa'],
                            'primeiroevento' => $resultado['primeiroevento'],
                            'lide' => $resultado['lide'],
                            'lidefuturo' => $resultado['lidefuturo'],
                            'vip' => $resultado['vip'],
                            'staff' => $resultado['staff'],
                            'imprensa' => $resultado['imprensa']));
}

$retorno = array('success' => true,'dados' => $dados);
echo json_encode($retorno);

?>