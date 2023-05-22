<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
include("conexao.php");
   
mysqli_query($con, "SET NAMES 'utf8'"); 
mysqli_query($con, "SET CHARACTER SET 'utf8'"); 
$query = "select id, imagem from evento where status = 1 order by data asc";
$sql= mysqli_query($con, $query);
$data = array();
while ($result =  mysqli_fetch_array($sql, MYSQLI_ASSOC))
{
array_push($data, array('id' => $result['id'], 	
	'imagem' => $result['imagem']
	 ));

}
echo json_encode($data);


mysqli_close($con);

?>