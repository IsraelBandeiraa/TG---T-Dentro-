<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$_POST = json_decode(file_get_contents('php://input'), true);
include("conexao.php");
$iduser =$_POST["iduser"];
$idevento = $_POST["idevento"];
$idcheckin = $_POST["idcheckin"];      
    mysqli_query($con, "SET CHARACTER SET 'utf8'"); 
    $caraio = "select count(id) as contar from checkin where  iduser = $iduser and idevento = $idevento and confirmar =1 and checkin=0 and checkout = 0";
    $consulta =  mysqli_query($con,$caraio);
    $resultado = mysqli_fetch_assoc($consulta);
    
     if($resultado["contar"] > 0) {
        $sql =  "update checkin set checkin = 1 where id = '$idcheckin'";
        mysqli_query($con, $sql);
        $resposta = '{"success" : true}';
     }
     else{
        $resposta = '{"success" : false}';
     }
     echo $resposta;

     mysqli_close($con);

?>
