<?php
include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: no se ha podido conectar al servidor de base de datos. Compruebe su conexión a internet.'}";
} else {
    $consultaSql = "SELECT u.id_usuario,u.id_rol,u.cedula,u.clave,u.nombres,"
            . "u.apellidos,u.correo,u.celular,u.telf_conv,u.bloqueado,r.rol "
            . "from usuarios u, roles r where u.id_rol=r.id_rol;";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $objJson = "{usuarios: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                idUsuario:".$myrow["id_usuario"].",
                cedula:'" . $myrow["cedula"] . "',
                idRolUser:". $myrow["id_rol"].", 
                nombres:'" . utf8_encode($myrow["nombres"]) . "',
                apellidos:'" . utf8_encode($myrow["apellidos"]) . "',
                rol:'" . utf8_encode($myrow["rol"]) . "',
                correo:'" . utf8_encode($myrow["correo"]) . "',
                celular:'" . $myrow["celular"] . "',
                telf_conv:'" . $myrow["telf_conv"] . "',
                usuario:'" . utf8_encode($myrow["cedula"]) . "',
                clave:'" . utf8_encode($myrow["clave"]) . "',
                estado:" . $myrow["bloqueado"] . "
            },";
        }
        $objJson .= "]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
