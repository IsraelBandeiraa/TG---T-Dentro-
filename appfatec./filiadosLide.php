<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
include("imagem.php");
include("conexao.php");

$_POST = json_decode(file_get_contents('php://input'), true);
mysqli_query($con, "SET NAMES 'utf8'"); 
mysqli_query($con, "SET CHARACTER SET 'utf8'");
$id = $_POST["id"];
$query = "SELECT * 
  from pessoa 
  where id NOT in(select idcontato from contato where userid = $id) 
  and id not in ($id) 
  and id not in(select solicitante from contato where idcontato = $id) 
  and lide = 1
  and perfil = 'FILIADO'
  order by nome asc";
$sql= mysqli_query($con, $query);
$data = array();
while ($result =  mysqli_fetch_array($sql, MYSQLI_ASSOC))
{
  $foto = $result['imagem'];
  if (($foto != '') && (!(substr($foto, 0, 10) == "data:image"))) {
    $foto = $url . $foto;
  }
  array_push($data, array(
    'id' => $result['id'], 
    'nome' => $result['nome'], 
    'email' => $result['email'],
    'cpf' => $result['cpf'],
    'cargo' => $result['cargo'],
    'empresa' => $result['empresa'],
    'lide' => $result['lide'],
    'lidefuturo' => $result['lidefuturo'],
    'lidemulher' => $result['lidemulher'],
    'compTel' => $result['compTel'],
    'compTelSec' => $result['compTelSec'],
    'compEmail' => $result['compEmail'],
    'compEmailSec' => $result['compEmailSec'],
    'emailSec' => $result['emailSec'],
    'tel' => $result['tel'],
    'telSec' => $result['telSec'],
    'imagem' => $foto,
    'nascimento' => $result['nascimento'],
    'segmento' => $result['segmento'],
    'dados' => $result['nome'].' '.$result['email'].' '.$result['cpf'].' '.$result['cargo'].' '.$result['empresa'].' '.$result['lide'].' '.$result['lidefuturo'].' '.$result['lidemulher'].' '.$result['compTel'].' '.$result['compTelSec'].' '.$result['compEmail'].' '.$result['compEmailSec'].' '.$result['emailSec'].' '.$result['tel'].' '.$result['telSec'].' '.$result['nascimento'].' '.$result['segmento']
  ));
}

echo json_encode($data);
mysqli_close($con);

?>
