<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$_POST = json_decode(file_get_contents('php://input'), true);
include("conexao.php");
   
    $titulo = $_POST["titulo"];
    $texto = $_POST["texto"];
    $aprovado = $_POST["aprovado"];
    $iduser = $_POST["iduser"];
    $imagem = $_POST["imagem"];      
    $id = $_POST["id"];

    $compara = "select count(id) as contar from post where id = '$id'";
    $contar = mysqli_query($con, $compara);
    $sim = mysqli_fetch_assoc($contar);

    if($sim["contar"] > 0){
    
    $sql = "update post set titulo ='$titulo', imagem = '$imagem', texto = '$texto' where id='$id'";   
     
    mysqli_query($con, $sql);
    }

     mysqli_close($con);

?>