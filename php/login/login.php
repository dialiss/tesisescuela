<?php
include("../../dll/config.php");
extract($_POST);
?>
<!DOCTYPE html>
<html lang='es'>
    <head>
        <meta charset="utf-8">
        <title><?php echo $site_title ?></title>
        <link rel="shortcut icon" href="<?php echo $site_icon ?>" type="image/x-icon">
    </head>
    <body>
        <?php
        if (!$mysqli = getConectionDb()) {
            $Error = "Error: no se ha podido conectar al servidor de base de datos. Compruebe su conexión a internet.";
            echo "<script>alert('$Error');</script>";
            echo "<script>location.href='../../index.php'</script>";
        } else {
            $consultaSql = "select * from usuarios where cedula=? and clave=? and bloqueado=0";

            /* crear una sentencia preparada */
            $stmt = $mysqli->prepare($consultaSql);
            if ($stmt) {
                /* ligar parámetros para marcadores */
                $stmt->bind_param("ss", $us, $ps);
                /* ejecutar la consulta */
                $stmt->execute();

                $result = $stmt->get_result();

                if ($result->num_rows > 0) {
                    $myrow = $result->fetch_assoc();

                    // Deteccion de la ip y del proxy
                    if (isset($HTTP_SERVER_VARS["HTTP_X_FORWARDED_FOR"])) {
                        $ip = $HTTP_SERVER_VARS["HTTP_X_FORWARDED_FOR"];
                        $array = split(",", $ip);
                        $host = @gethostbyaddr($ip_proxy);
                        $ip_proxy = $HTTP_SERVER_VARS["REMOTE_ADDR"];
                    } else {
                        $ip = $_SERVER['REMOTE_ADDR'];
                        $host = @gethostbyaddr($ip);
                    }

                    $idUsuario = $myrow["id_usuario"];
                    session_start();
                    $_SESSION["INICIAESCUELA"] = 'http://localhost/tesisescuela/';
                    $_SESSION["IDUSUARIOESCUELA"] = $myrow["id_usuario"];
                    $_SESSION["USUARIOESCUELA"] = utf8_encode($myrow["cedula"]);
                    $_SESSION["IDROLESCUELA"] = $myrow["id_rol"];
                    $_SESSION["EMAIL"] = utf8_encode($myrow["correo"]);
                    $_SESSION["CELULAR"] = $myrow["celular"];
                    $_SESSION["PERSONAESCUELA"] = utf8_encode($myrow["apellidos"] . " " . $myrow["nombres"]);
                    $_SESSION["SESIONESCUELA"] = true;
                    switch ($myrow["id_rol"]) {
                        case 1:
                            $_SESSION["NOMBREDESESIONESCUELA"] = "index_administrador.php";
                            echo "<script type='text/javascript'>location.href='../../index_administrador.php'</script>";
                            break;
                        case 2:
                            $_SESSION["NOMBREDESESIONESCUELA"] = "index_docente.php";
                            echo "<script type='text/javascript'>location.href='../../index_docente.php'</script>";
                            break;
                        case 3:
                            $_SESSION["NOMBREDESESIONESCUELA"] = "index_estudiante.php";
                            echo "<script type='text/javascript'>location.href='../../index_estudiante.php'</script>";
                            break;
                        case 4:
                            $_SESSION["NOMBREDESESIONESCUELA"] = "index_representante.php";
                            echo "<script type='text/javascript'>location.href='../../index_representante.php'</script>";
                            break;
                        case 6:
                            $_SESSION["NOMBREDESESIONESCUELA"] = "index_usuarios.php";
                            echo "<script type='text/javascript'>location.href='../../index_usuarios.php'</script>";
                            break;
                    }
                } else {
                    $Error = utf8_decode("Usuario o clave incorrectas o el usuario se encuentra inhabilitado");
                    echo "<script>alert('$Error');</script>";
                    echo "<script>location.href='../../index.php'</script>";
                }
            } else {
                $Error = utf8_decode("Problemas en conexión a su servidor de base de datos, contcate con el administrador.");
                echo "<script>alert('$Error');</script>";
                echo "<script>location.href='../../index.php'</script>";
            }

            $stmt->close();
            $mysqli->close();
        }
        ?>
    </body>
</html>