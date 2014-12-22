 
<?php

include ('../../dll/config.php');
include("class.phpmailer.php");
include("class.smtp.php");
extract($_POST);
if (strlen($us) > 0 & strlen($email) > 0) {
    if (!$mysqli = getConectionDb()) {
        $Error = "Error: no se ha podido conectar al servidor de base de datos. Compruebe su conexión a internet.";
        echo "<script>alert('$Error');</script>";
        echo "<script>location.href='../../index.php'</script>";
    } else {
        $clave = rand(100000, 999999);

        $consultaSql = "SELECT id_usuario, cedula, id_rol,concat(nombres,' ',apellidos) as nom,clave
        FROM usuarios u
        WHERE cedula = ?
        AND correo = ?
        AND bloqueado = 0";
        $stmt = $mysqli->prepare($consultaSql);
        if ($stmt) {
            $stmt->bind_param("ss", $us, $email);
            $stmt->execute();
            $result = $stmt->get_result();
            if ($result->num_rows > 0) {
                $myrow = $result->fetch_assoc();
                $usuario = $myrow["cedula"];
                $consultaSql = "UPDATE usuarios SET clave=? WHERE clave = ? AND cedula = ?";
                $stmt1 = $mysqli->prepare($consultaSql);
                $stmt1->bind_param("sss", $clave, $myrow['clave'], $usuario);
                $stmt1->execute();
                if ($stmt1) {
                    if ($stmt1->affected_rows > 0) {
                        $persona = $myrow['nom'];
                        $mensaje = '<font size=4>Saludos estimado(a), <b>' . $persona
                                . '</b> recibimos una solicitud para restablecer su contraseña,'
                                . ' temporalmente puede utilizar la siguiente:'
                                . '<br><br></font><font size=5><b>' . $clave . '</b></font><br><br>'
                                . '<font size=4>Si usted no realizo ninguna solicitud comuniquese '
                                . 'inmediatamente con el administrador  del sistema, le informamos se '
                                . 'intentó ingresar al sistema con su usuario</font><br>';
                        $mail = new PHPMailer();
                        $mail->IsSMTP();
                        $mail->SMTPAuth = true;
                        $mail->DeNombre = 'Soporte Tesis Escuela';
                        $mail->Subject = 'Restablecer clave';
                        $mail->MsgHTML($mensaje);
                        $mail->AddAddress($email, $persona);
                        $mail->IsHTML(true);
                        if (!$mail->Send()) {
                            echo "<script>alert('Clave no se pudo enviar, intente nuevamente');</script>";
                            echo "<script>location.href='../../restablecer.php'</script>";
                        } else {
                            echo "<script>alert('Clave fue enviada a su email, revise su buzon de entrada');</script>";
                            echo "<script type='text/javascript'>location.href='../../index.php'</script>";
                        }
                    } else {
                        $Error = utf8_decode("Problemas al insertar en la tabla,intente nuevamente.");
                        echo "<script>alert('$Error');</script>";
                        echo "<script>location.href='../../restablecer.php'</script>";
                    }
                } else {
                    $Error = utf8_decode("Problemas en la construcción de la consulta,intente nuevamente.");
                    echo "<script>alert('$Error');</script>";
                    echo "<script>location.href='../../restablecer.php'</script>";
                }
            } else {
                $Error = utf8_decode("Usuario o email incorrectos, intente nuevamente");
                echo "<script>alert('$Error');</script>";
                echo "<script>location.href='../../restablecer.php'</script>";
            }
        } else {
            $Error = utf8_decode("Problemas en el sistema, intente nuevamente si los problemas persisten informe al administrador.");
            echo "<script>alert('$Error');</script>";
            echo "<script>location.href='../../restablecer.php'</script>";
        }

        $stmt->close();
        $stmt1->close();
        $mysqli->close();
    }
} else {
    echo "<script>alert('Por favor debe ingresar el usuario y email registrados en su cuenta');</script>";
    echo "<script>location.href='../../restablecer.php'</script>";
}    