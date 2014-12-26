
<!DOCTYPE html>
<html lang='es'>
    <head>
        <meta charset="utf-8">
        <title><?php echo $site_title ?></title>
        <link rel="shortcut icon" href="<?php echo $site_icon ?>" type="image/x-icon">
        <link href="bootstrap/bootstrap.css" rel="stylesheet">
        <link href="bootstrap/bootstrap-responsive.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="css/css_index.css">
        <script type="text/javascript" src="js/requerid/functions.js"></script>
    </head>
    <body>
        <nav>
            <ul class="breadcrumb">
                <li><a href="">Información</a> <span class="divider">/</span></li>
                <li><a href="index.php">Inicio</a> <span class="divider">/</span></li>
            </ul>
        </nav>
        <?php
        include("dll/config.php");
        $consultaSql = "select * from datos_web order by id_datos desc limit 1";
        $mysqli = getConectionDb();
        $result = $mysqli->query($consultaSql);
        $mysqli->close();
        $myrow = $result->fetch_assoc();
        echo utf8_encode($myrow["mision"]);
        echo "<br>" . utf8_encode($myrow["vision"]);
        echo "<br>" . utf8_encode($myrow["historia"]);
        echo "<br>" . utf8_encode($myrow["ubicacion"]);
        echo $myrow["imagen_ubicacion"];
        echo "<br>" . utf8_encode($myrow["correo"]);
        ?>


        <section>          
            <form class="form-horizontal" action = "php/login/login.php" method = "post">
                <div class="control-group">
                    <label class="control-label" for="inputEmail"><strong>Cédula</strong></label>
                    <div class="controls">
                        <input name = "us" type="text" placeholder="Cédula">
                    </div>
                </div>

                <div class="control-group">
                    <label class="control-label" for="inputPassword"><strong>Contraseña</strong></label>
                    <div class="controls">
                        <input name = "ps" type="password" id="inputPassword" placeholder="Contraseña">
                        <a href="restablecer.php"><font size="2" color="green"><br><br>¿Olvidaste tu contraseña?</font></a>
                    </div>
                </div>
                <div class="control-group">
                    <div class="controls">                  
                        <button class = "btn btn-primary" type="submit" class="btn">Ingresar</button>
                    </div>
                </div>
            </form>          
        </section>                

        <footer>            

        </footer>
    </body>
</html>