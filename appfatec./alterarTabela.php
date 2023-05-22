<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

$_POST = json_decode(file_get_contents('php://input'), true);

$idcampo = $_POST["idcampo"];
$tipo = $_POST["tipo"];
$tabela = $_POST["tabela"];
$notificar = $_POST["notificar"];
$dados = $_POST["dados"];
$relacoes = $_POST["relacoes"];

if (($relacoes === null) || ($relacoes === "")) {
    $relacoes = [];
}

if (($idcampo === null) || ($idcampo === "")) {
    $retorno = array('success' => false, 'message' => 'ID não foi definido.');
    echo json_encode($retorno);
    return;
}

if (($tipo === null) || ($tipo === "")) {
    $retorno = array('success' => false, 'message' => 'Tipo operação não foi definido.');
    echo json_encode($retorno);
    return;
}

if (($tabela === null) || ($tabela === "")) {
    $retorno = array('success' => false, 'message' => 'Tabela não foi definido.');
    echo json_encode($retorno);
    return;
}

if (($notificar === null) || ($notificar === "")) {
    $notificar = true;
}

include "imagem.php";
include "notificacao.php";
include "conexao.php";

$url = full_url($_SERVER);

if ($tipo == "INSERT") {

    $strImagem = "";
    $campoImagem = "";
    $sqlCampos = "";
    $sqlValores = "";
    foreach ($dados as $key => $valor) {
        //Verifica se o campos é uma imagem em base64
        if (substr($valor, 0, 10) == "data:image") {
            $strImagem = $valor;
            $campoImagem = $key;
            continue;
        } else {
            $valor = str_replace($url, "", $valor);
        }
        if ($sqlValores != "") {
            $sqlCampos = "$sqlCampos,$key";
            $sqlValores = "$sqlValores,'" . mysqli_real_escape_string($con, $valor) . "'";
        } else {
            $sqlCampos = "$key";
            $sqlValores = "'" . mysqli_real_escape_string($con, $valor) . "'";
        }
    }

    $sql = "INSERT INTO $tabela($sqlCampos) values($sqlValores)";
    $consulta = mysqli_query($con, $sql);
    if ($consulta) {
        $sql1 = "SELECT * FROM $tabela WHERE id = LAST_INSERT_ID()";
        $consulta = mysqli_query($con, $sql1);
        $resultado = mysqli_fetch_assoc($consulta);

        //Atualiza a imagem
        if ($strImagem != "") {
            $idcampo = $resultado["id"];

            $strImagem = salvarImagemDisco($strImagem, $idcampo, $tabela);

            $sql = "UPDATE $tabela SET $campoImagem='$strImagem' WHERE id = $idcampo";
            $consulta = mysqli_query($con, $sql);
            if ($consulta) {

                if (count($relacoes) > 0) {
                    foreach ($relacoes as $relacao) {
                        $valores = $relacao["valores"];
                        $sqlValores = "";
                        foreach ($valores as $valor) {
                            if ($sqlValores != "") {
                                $sqlValores = "$sqlValores,($idcampo,$valor)";
                            } else {
                                $sqlValores = "($idcampo,$valor)";
                            }
                        }
                        $tabelarelacionada = $relacao["tabelarelacionada"];
                        $campotabela = $relacao["campotabela"];
                        $camporelacao = $relacao["camporelacao"];

                        if (count($valores) > 0) {
                            $sql = "INSERT INTO $tabelarelacionada($campotabela,$camporelacao) values $sqlValores";
                            $consulta = mysqli_query($con, $sql);
                            if ($consulta) {
                                $retorno = array('success' => true, 'message' => 'Registro cadastrado com sucesso.', 'registro' => $resultado);
                            } else {
                                $retorno = array('success' => false, 'message' => "Erro ao alterar Registro. #4. Erro:" . mysqli_error($con));
                                break;
                            }
                        } else {
                            $retorno = array('success' => true, 'message' => 'Registro cadastrado com sucesso.', 'registro' => $resultado);
                        }
                    }
                } else {
                    $retorno = array('success' => true, 'message' => 'Registro cadastrado com sucesso.', 'registro' => $resultado);
                }
            } else {
                $retorno = array('success' => false, 'message' => "Erro ao salvar Registro. #2. Erro:" . mysqli_error($con));
            }
        } else {
            $retorno = array('success' => true, 'message' => 'Registro cadastrado com sucesso.', 'registro' => $resultado);
        }
    } else {
        $retorno = array('success' => false, 'message' => "Erro ao cadastrar registro. #1. Erro:" . mysqli_error($con));
    }

    if ($retorno['success']) {
        if ($notificar) {
            //Enviar Notificações
            if ($tabela == "evento") {
                enviarNotificacao($con, "NOVOEVENTO", "", $resultado['id'], null);
            } else if ($tabela == "promocao") {
                enviarNotificacao($con, "NOVOBENEFICIO", "", "", $resultado);
            }
        }
    }
} else if ($tipo == "UPDATE") {

    $sqlValores = "";
    foreach ($dados as $key => $valor) {
        //Verifica se o campos é uma imagem em base64
        if (substr($valor, 0, 10) == "data:image") {
            $valor = salvarImagemDisco($valor, $idcampo, $tabela);
        } else {
            $valor = str_replace($url, "", $valor);
        }
        if ($sqlValores != "") {
            $sqlValores = "$sqlValores,$key='" . mysqli_real_escape_string($con, $valor) . "'";
        } else {
            $sqlValores = "$key='" . mysqli_real_escape_string($con, $valor) . "'";
        }
    }

    $sql = "UPDATE $tabela SET $sqlValores WHERE id = $idcampo";
    $consulta = mysqli_query($con, $sql);
    if ($consulta) {

        if (count($relacoes) > 0) {
            foreach ($relacoes as $relacao) {
                $valores = $relacao["valores"];
                $sqlValores = "";
                foreach ($valores as $valor) {
                    if ($sqlValores != "") {
                        $sqlValores = "$sqlValores,($idcampo,$valor)";
                    } else {
                        $sqlValores = "($idcampo,$valor)";
                    }
                }
                $tabelarelacionada = $relacao["tabelarelacionada"];
                $campotabela = $relacao["campotabela"];
                $camporelacao = $relacao["camporelacao"];

                $sql = "DELETE FROM $tabelarelacionada WHERE $campotabela = $idcampo";
                $consulta = mysqli_query($con, $sql);
                if ($consulta) {
                    $retorno = array('success' => true, 'message' => 'Registro alterado com sucesso.');
                } else {
                    $retorno = array('success' => false, 'message' => "Erro ao alterar Registro. #3. Erro:" . mysqli_error($con));
                    break;
                }

                if (count($valores) > 0) {
                    $sql = "INSERT INTO $tabelarelacionada($campotabela,$camporelacao) values $sqlValores";
                    $consulta = mysqli_query($con, $sql);
                    if ($consulta) {
                        $retorno = array('success' => true, 'message' => 'Registro alterado com sucesso.');
                    } else {
                        $retorno = array('success' => false, 'message' => "Erro ao alterar Registro. #4. Erro:" . mysqli_error($con));
                        break;
                    }
                } else {
                    $retorno = array('success' => true, 'message' => 'Registro alterado com sucesso.');
                }
            }
        } else {
            $retorno = array('success' => true, 'message' => 'Registro alterado com sucesso.');
        }
    } else {
        $retorno = array('success' => false, 'message' => "Erro ao alterar Registro. #2. Erro:" . mysqli_error($con));
    }

    if ($retorno['success']) {
        if ($notificar) {
            //Enviar Notificações
            if ($tabela == "evento") {
                enviarNotificacao($con, "ALTERACAOEVENTO", "", $idcampo, null);
            }
        }
    }
} else if ($tipo == "DELETE") {

    $sql = "DELETE FROM $tabela WHERE id = $idcampo";
    $consulta = mysqli_query($con, $sql);
    if ($consulta) {

        if (count($relacoes) > 0) {
            foreach ($relacoes as $relacao) {
                $tabelarelacionada = $relacao["tabelarelacionada"];
                $campotabela = $relacao["campotabela"];

                $sql = "DELETE FROM $tabelarelacionada WHERE $campotabela = $idcampo";
                $consulta = mysqli_query($con, $sql);
                if ($consulta) {
                    $retorno = array('success' => true, 'message' => 'Registro deletado com sucesso.');
                } else {
                    $retorno = array('success' => false, 'message' => "Erro ao deletar Registro. #3. Erro:" . mysqli_error($con));
                    break;
                }
            }
        } else {
            $retorno = array('success' => true, 'message' => 'Registro deletado com sucesso.');
        }
    } else {
        $retorno = array('success' => false, 'message' => "Erro ao deletar registro. #3 Erro:" . mysqli_error($con));
    }
} else {
    $retorno = array('success' => false, 'message' => 'Tipo operação informado não é permitida. #4');
}

mysqli_close($con);

echo json_encode($retorno);
