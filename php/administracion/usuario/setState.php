<?php
include ('../../../dll/config.php');

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: no se ha podido conectar al servidor de base de datos. Compruebe su conexión a internet.'}";
} else {

    $idusuario = $_REQUEST['id'];
    $usuario = $_REQUEST['usuario'];
    $val = $_REQUEST['val'];

    if ($val == 1) {

        $updateSql = "UPDATE usuarios
            SET bloqueado = ?
            WHERE id_usuario = ? and cedula= ?"
        ;
        $stmt = $mysqli->prepare($updateSql);

        if ($stmt) {
            $stmt->bind_param("iis", $val, $idusuario, $usuario);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                echo "{success:true, message:'Usuario habilitado correctamente.',state: true}";
            } else {
                echo "{success:false, message: 'Problemas al habilitar el usuario.',state: false}";
            }
            $stmt->close();
        } else {
            echo "{success:true, message: 'Problemas en la construcción de la consulta.',state: false}";
        }
        $mysqli->close();
    } else {
        $updateSql = "UPDATE usuarios
            SET bloqueado = ?
            WHERE id_usuario = ? and cedula= ?"
        ;
        $stmt = $mysqli->prepare($updateSql);

        if ($stmt) {
            $stmt->bind_param("iis", $val, $idusuario, $usuario);
            $stmt->execute();
            if ($stmt->affected_rows > 0) {
                echo "{success:true, message:'Usuario deshabilitado correctamente.',state: true}";
            } else {
                echo "{success:false, message: 'Problemas al deshabilitar el usuario',state: false}";
            }
            $stmt->close();
        } else {
            echo "{success:true, message: 'Problemas en el sistema, intente nuevamente si los problemas persisten informe al administrador.',state: false}";
        }
        $mysqli->close();
    }
}        