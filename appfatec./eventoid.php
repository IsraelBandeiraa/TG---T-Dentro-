<?php
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

include "imagem.php";

include "conexao.php";

$_POST = json_decode(file_get_contents('php://input'), true);
$id = $_POST["id"];

$sql = "select data, descricao, endereco, funcao, hora, id, imagem, latitude, longitude, lide, lidefuturo,
    link, local, nome, organizador, palestrante as palestrante, status
    from evento where id = '$id'";
mysqli_query($con, "SET CHARACTER SET 'utf8'");
$consulta = mysqli_query($con, $sql);

$data = array();
if ($result = mysqli_fetch_array($consulta, MYSQLI_ASSOC)) {

    $sql2 = "SELECT * FROM posevento WHERE eventoid = $id ORDER BY ordem";
    $consulta2 = mysqli_query($con, $sql2);
    $datapos = array();
    while ($result2 = mysqli_fetch_array($consulta2, MYSQLI_ASSOC)) {
        $imagem = $result2['imagem'];
        if (($imagem != '') && (!(substr($imagem, 0, 10) == "data:image"))) {
            $imagem = $url . $imagem;
        }
        $poster = $result2['poster'];
        if (($poster != '') && (!(substr($poster, 0, 10) == "data:image"))) {
            $poster = $url . $poster;
        }

        $video = $result2['video'];
        if ($video != "") {
            $video = $url . $result2['video'];
        }

        array_push($datapos, array(
            'ordem' => $result2['ordem'],
            'id' => $result2['id'],
            'video' => $video,
            'type' => $result2['type'], 
            'poster' => $poster, 
            'imagem' => $imagem, 
            'texto' => $result2['texto'], 
            'youtube' => $result2['youtube']
        ));
    }

    $data = array(
        'data' => $result['data'],
        'descricao' => preg_replace("/<\s*style.+?<\s*\/\s*style.*?>/s", "", $result['descricao']),
        'endereco' => $result['endereco'],
        'funcao' => $result['funcao'],
        'hora' => $result['hora'],
        'id' => $result['id'],
        'imagem' => $result['imagem'],
        'latitude' => $result['latitude'],
        'longitude' => $result['longitude'],
        'lide' => $result['lide'],
        'lidefuturo' => $result['lidefuturo'],
        'link' => $result['link'],
        'local' => $result['local'],
        'nome' => $result['nome'],
        'organizador' => $result['organizador'],
        'paleestrante' => $result['palestrante'],
        'status' => $result['status'],
        'posevento' => $datapos,

    );
}

echo json_encode($data);

mysqli_close($con);
