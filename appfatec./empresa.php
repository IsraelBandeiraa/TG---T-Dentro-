<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
include("conexao.php");

mysqli_query($con, "SET NAMES 'utf8'"); 
mysqli_query($con, "SET CHARACTER SET 'utf8'"); 
$query = "select * from empresa where lide = 1 order by id desc";
$sql= mysqli_query($con, $query);
$data = array();

while ($result =  mysqli_fetch_array($sql, MYSQLI_ASSOC))
{
  $result['dados'] = $result['nome'].' '.$result['site'].' '.$result['segmento'].' '.$result['endereco'];
  array_push($data, $result);
}
echo json_encode($data);

mysqli_close($con);

?>
