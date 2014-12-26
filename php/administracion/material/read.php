<?php

include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: no se ha podido conectar al servidor de base de datos. Compruebe su conexión a internet.'}";
} else {
    $consultaSql = "select m.id_material_didactico,ma.materia, " .
            "m.id_docente,concat(d.nombres,' ',d.apellidos) as docente,m.material,m.id_materia, " .
            "m.archivo_material from material_didacticos m, materias ma, usuarios d " .
            "where d.id_usuario=m.id_docente and m.id_materia = ma.id_materia";
    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $objJson = "{material: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                id_material:" . $myrow["id_material_didactico"] . ",
                id_materia:" . $myrow["id_materia"] . ",
                materia:'" . utf8_encode($myrow["materia"]) . "',
                id_docente:" . $myrow["id_docente"] . ",
                docente:'" . utf8_encode($myrow["docente"]) . "',
                material:'" . utf8_encode($myrow["material"]) . "',
                archivo:'" . utf8_encode($myrow["archivo_material"]) . "'
            },";
        }
        $objJson .= "]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
