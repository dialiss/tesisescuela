<?php
include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: no se ha podido conectar al servidor de base de datos. Compruebe su conexión a internet.'}";
} else {
    $consultaSql = "select o.id_docente,concat(d.nombres,' ',d.apellidos) as docente,"
            . "o.id_estudiante,concat(e.nombres,' ',e.apellidos) as estudiante,o.observacion, "
            . "o.fecha from observaciones o, usuarios e, usuarios d "
            . "where o.id_docente=d.id_usuario and o.id_estudiante = e.id_usuario;";
$c=1;
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $objJson = "{observaciones: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                id_observacion:".$c.",
                id_docente:".$myrow["id_docente"].",
                docente:'" . utf8_encode($myrow["docente"]) . "',
                id_estudiante:".$myrow["id_estudiante"].",
                estudiante:'" . utf8_encode($myrow["estudiante"]) . "',
                observacion:'" . utf8_encode($myrow["observacion"]) . "',
                fecha:'". utf8_encode($myrow["fecha"])."'
            },";
            $c++;
        }
        $objJson .= "]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
