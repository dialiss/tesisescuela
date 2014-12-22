<?php
include("dll/config.php");
include("php/login/isLogin.php");
if (isset($_SESSION["IDROLESCUELA"])) {
    $rutaPrincipal = $_SESSION["NOMBREDESESIONESCUELA"];
    header("Location: $rutaPrincipal");
    exit();
}
?>
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
                <li><a href="#">Acerca de</a> <span class="divider">/</span></li>
                <li class="active"><a href="index.php">Inicio</a> <span class="divider">/</span></li></li>
            </ul>           
        </nav>

        <header>            
            <img src="img/sga.png" alt="Kradac">
        </header>    

        <section>            
            <form class="form-horizontal" action = "php/login/restablecer.php" method = "post">
                <div class="control-group">
                    <label class="control-label" for="inputEmail"><strong>Usuario:</strong></label>
                    <div class="controls">
                        <input name = "us" type="text" placeholder="Usuario">
                    </div>
                </div>

                <div class="control-group">
                    <label class="control-label" for="inputPassword"><strong>Correo:</strong></label>
                    <div class="controls">
                        <input name = "email" type="email" id="email" placeholder="Email">
                        <font size="2" color="green"><br>
                        </font>
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