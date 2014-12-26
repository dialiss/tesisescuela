<?php

include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: no se ha podido conectar al servidor de base de datos. Compruebe su conexión a internet.'}";
} else {
    $consultaSql = "SELECT m.id_envia,concat(e.nombres,' ',e.apellidos) as envia, " .
            "m.id_recibe,concat(r.nombres,' ',r.apellidos) as recibe,m.mensaje,m.fecha_hora_envio "
            . "FROM mensajes m, usuarios e, usuarios r " .
            "where m.id_envia=e.id_usuario and m.id_recibe=r.id_usuario";
    $c = 1;
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $objJson = "{mensajes: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                id_mensaje:" . $c . ",
                id_envia:" . $myrow["id_envia"] . ",
                envia:'" . utf8_encode($myrow["envia"]) . "',
                id_recibe:" . $myrow["id_recibe"] . ",
                recibe:'" . utf8_encode($myrow["recibe"]) . "',
                mensaje:'" . utf8_encode($myrow["mensaje"]) . "',
                fecha_hora_envio:'" . $myrow["fecha_hora_envio"] . "'
            },";
            $c++;
        }
        $objJson .= "]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
