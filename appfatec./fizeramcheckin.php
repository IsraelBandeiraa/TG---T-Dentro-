<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$_POST = json_decode(file_get_contents('php://input'), true);

$idEvento = $_POST['idevento'];

if(($idEvento === null) || ($idEvento === "")){
    $retorno = array('erro'=>'Evento não informado.');
    echo json_encode($retorno);
    return;
}

include("conexao.php");
   
$data = array();

$lista = array();

$query = "SELECT p.nome,p.empresa,p.lide,p.lidefuturo,p.patrocinador,c.* FROM checkin c,pessoa p WHERE c.iduser = p.id AND (p.lide=1 OR p.lidefuturo=1) AND checkin = 1 AND checkout = 0 AND idevento = $idEvento order by checkindatahora asc";
$sql= mysqli_query($con, $query);
while ($result =  mysqli_fetch_array($sql, MYSQLI_ASSOC))
{
	array_push($lista, $result);;
}
$data["lista"] = $lista;

mysqli_close($con);

echo json_encode($data);

?>