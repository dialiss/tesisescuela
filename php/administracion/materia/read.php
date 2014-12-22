<?php
include ('../../../dll/config.php');

extract($_GET);

if (!$mysqli = getConectionDb()) {
    echo "{success:false, message: 'Error: no se ha podido conectar al servidor de base de datos. Compruebe su conexión a internet.'}";
} else {
    $consultaSql = "SELECT * FROM materias";

    $result = $mysqli->query($consultaSql);
    $mysqli->close();
    if ($result->num_rows > 0) {
        $objJson = "{materias: [";
        while ($myrow = $result->fetch_assoc()) {
            $objJson .= "{
                id_materia:".$myrow["id_materia"].",
                materia:'" . utf8_encode($myrow["materia"]) . "',
                descripcion:'". utf8_encode($myrow["descripcion"])."'
            },";
        }
        $objJson .= "]}";
        echo $objJson;
    } else {
        echo "{failure:true, message:'No hay datos que obtener'}";
    }
}
