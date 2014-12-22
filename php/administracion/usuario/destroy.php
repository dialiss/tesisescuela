<?php
include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $requestBody = file_get_contents('php://input');
    $objJson = json_decode($requestBody, true);

    $destroySql = "delete from usuarios where id_usuario = ?";

    $stmt = $mysqli->prepare($destroySql);
    if ($stmt) {
        $stmt->bind_param("i", $objJson["id"]);
        $stmt->execute();

        if ($stmt->affected_rows > 0) {
            echo "{success:true, message:'Datos Eliminados Correctamente.',state: true}";
        } else {
            echo "{success:true, message: 'Problemas al Eliminar en la Tabla.',state: false}";
        }
        $stmt->close();
    } else {
        echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
    }
    $mysqli->close();
}