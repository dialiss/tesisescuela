<?php

include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {

    $requestBody = file_get_contents('php://input');
    $objJson = json_decode($requestBody, true);

    $existeSql = "select usuario from usuarios where usuario='" . $objJson["usuario"] . "'";

    $result = $mysqli->query($existeSql);

    if ($result) {
        if ($result->num_rows > 0) {
            echo "{success:true, message:'El Usuario ya se encuentra en uso por otra persona.',state: false}";
        } else {

            $insertSql = "insert into usuarios (id_empresa, id_rol_usuario, id_persona, usuario, clave)"
                    . "values(?, ?, ?, ?, ?)";

            $stmt = $mysqli->prepare($insertSql);
            if ($stmt) {
                $dataPass = explode(",", utf8_decode($objJson["clave"]));
                $stmt->bind_param("iiiss", $objJson["idEmpresa"], $objJson["idRolUser"], $objJson["idPerson"], utf8_decode($objJson["usuario"]), getEncryption($dataPass[0]));
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "{success:true, message:'Datos Insertados Correctamente.',state: true}";
                } else {
                    echo "{success:true, message: 'Problemas al Insertar en la Tabla.'}";
                }
                $stmt->close();
            } else {
                echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
            }
        }
        $mysqli->close();
    } else {
        echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
    }
}