<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
include("conexao.php");

$_POST = json_decode(file_get_contents('php://input'), true);
mysqli_query($con, "SET NAMES 'utf8'"); 
mysqli_query($con, "SET CHARACTER SET 'utf8'");
$id = $_POST["id"];
$query = "SELECT count(id) as contar from pessoa where id NOT in(select idcontato from contato where userid = $id) 
and id not in ($id) and id not in(select solicitante from contato where idcontato = $id) and lide = 1 ";
$sql= mysqli_query($con, $query);
$data = mysqli_fetch_assoc($sql);
echo json_encode($data);
mysqli_close($con);

?>