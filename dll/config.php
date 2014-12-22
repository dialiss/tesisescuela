<?php

/* DATOS DE MI APLICACION */
$site_title = "SGA ESCUELA";
$site_icon = "img/sga.png";

function getConectionDb() {
    /* DATOS DE MI SERVIDOR */
    $db_name = "tesisescueladb";
    $db_host = "localhost";
    $db_user = "root";
    $db_password = "";
    $mysqli = new mysqli($db_host, $db_user, $db_password, $db_name,4444);
    return ($mysqli->connect_errno) ? false : $mysqli;
}

function allRows($result) {
    $vector = null;
    $pos = 0;
    while ($myrow = $result->fetch_row()) {
        $fila = "";
        for ($i = 0; $i < count($myrow); $i++) {
            $infoCampo = $result->fetch_field_direct($i);
            $fila[$infoCampo->name] = $myrow[$i];
        }
        $vector[$pos] = $fila;
        $pos++;
    }
    return $vector;
}

function getEncryption($text) {
    $salt = "ESCUEL@";
    $encriptClave = md5(md5(md5($text) . md5($salt)));
    return $encriptClave;
}
