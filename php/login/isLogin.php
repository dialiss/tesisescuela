<?php

//Comprobar si la sesión ya fue iniciada
if (!isset($_SESSION)) {
    session_start();
} else {
    $rutaPrincipal = "index.php";

    //Comprobar si esta logeado
    if (!isset($_SESSION["USUARIOESCUELA"]) ||
            !isset($_SESSION["EMAIL"]) ||
            !isset($_SESSION["SESIONESCUELA"])) {
        header("Location: $rutaPrincipal");
        exit();
    }
}

