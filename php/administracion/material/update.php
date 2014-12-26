<?php
include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:true, message: 'Error: No se ha podido conectar a la Base de Datos.<br>Compruebe su conexión a Internet.',state: false}";
} else {
    $requestBody = file_get_contents('php://input');
    $objJson = json_decode($requestBody, true);
    
    $setIdCompany = $setIdRolUser = $setIdPerson = $setUser = $setPass = "";

    if (isset($objJson["idEmpresa"])) {
        $setIdCompany = "id_empresa=" . $objJson["idEmpresa"] . ",";
    }
    if (isset($objJson["idRolUser"])) {
        $setIdRolUser = "id_rol_usuario=" . $objJson["idRolUser"] . ",";
    }
    if (isset($objJson["idPerson"])) {
        $setIdPerson = "id_persona=" . $objJson["idPerson"] . ",";
    }
    if (isset($objJson["usuario"])) {
        $setUser = "usuario='" . utf8_decode($objJson["usuario"]) . "',";
    }
    if (isset($objJson["clave"])) {
        $dataPass = explode(",", utf8_decode($objJson["clave"]));
        $passEncryption = getEncryption($dataPass[0]);

        $consultaPassSql = "select id_usuario from usuarios where clave = '" . $passEncryption . "' and id_usuario = ". $objJson["id"];
        $resultPass = $mysqli->query($consultaPassSql);
        if ($resultPass->num_rows > 0) {
            $setPass = "";
        } else {
            $setPass = "clave='" . $passEncryption . "',";
        }
    }

    $setId = "id_usuario = " . $objJson["id"];

    if ($setUser != "") {
        $existeSql = "select usuario from usuarios where usuario='" . $objJson["usuario"] . "'";

        $result = $mysqli->query($existeSql);

        if ($result->num_rows > 0) {
            echo "{success:true, message:'El Usuario ya se encuentra en uso por otra persona.',state: false}";
        } else {
            $updateSql = "update usuarios "
                    . "set $setIdCompany$setIdRolUser$setIdPerson$setUser$setPass$setId "
                    . "where id_usuario = ?";

            $stmt = $mysqli->prepare($updateSql);
            if ($stmt) {
                $stmt->bind_param("i", $objJson["id"]);
                $stmt->execute();

                if ($stmt->affected_rows > 0) {
                    echo "{success:true, message:'Datos actualizados correctamente.',state: true}";
                } else {
                    echo "{success:true, message: 'Problemas al actualizar en la tabla.',state: false}";
                }
                $stmt->close();
            } else {
                echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
            }
        }
    } else {
        $updateSql = "update usuarios "
                . "set $setIdCompany$setIdRolUser$setIdPerson$setUser$setPass$setId "
                . "where id_usuario = ?";

        $stmt = $mysqli->prepare($updateSql);
        if ($stmt) {
            $stmt->bind_param("i", $objJson["id"]);
            $stmt->execute();

            if ($stmt->affected_rows > 0) {
                echo "{success:true, message:'Datos actualizados correctamente.',state: false}";
            } else {
                echo "{success:true, message: 'Problemas al actualizar en la tabla.',state: false}";
            }
            $stmt->close();
        } else {
            echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
        }
    }
    $mysqli->close();
}