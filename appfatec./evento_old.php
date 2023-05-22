<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
include "conexao.php";

$query = "SELECT * FROM evento WHERE status = 1 AND data >= CURRENT_DATE ORDER BY data ASC";
$sql = mysqli_query($con, $query);
$data = array();
while ($result = mysqli_fetch_array($sql, MYSQLI_ASSOC)) {
    array_push($data, array('id' => $result['id'],
        'nome' => $result['nome'],
        'imagem' => $result['imagem'],
        'endereco' => $result['endereco'],
        'status' => $result['status'],
        'data' => $result['data'],
        'lat' => $result['latitude'],
        'long' => $result['longitude'],
        'lide' => $result['lide'],
        'lidefuturo' => $result['lidefuturo'],
        'descricao' => ''));

}
echo json_encode($data);

mysqli_close($con);

?>