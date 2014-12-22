<?php
include("dll/config.php");
include("php/login/isLogin.php");
if (!isset($_SESSION["IDROLESCUELA"])) {
    header("Location: index.php");
} else {
    if ($_SESSION["IDROLESCUELA"] == 1) {
        header("Location: index_administrador.php");
    } else if ($_SESSION["IDROLESCUELA"] == 2) {
        header("Location: index_docente.php");
    } else if ($_SESSION["IDROLESCUELA"] == 3) {
        header("Location: index_estudiante.php");
    }
}
?>
<!DOCTYPE html>
<html lang='es'>    
    <head>
        <meta charset="utf-8">
        <title><?php echo $site_title ?></title>
        <link rel="shortcut icon" href="<?php echo $site_icon ?>" type="image/x-icon">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/shared/example.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/GridFilters.css">
        <link rel="stylesheet" type="text/css" href="extjs-docs-5.0.0/extjs-build/build/examples/ux/grid/css/RangeMenu.css">
        <link rel="stylesheet" type="text/css" href="css/principal.css">
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/include-ext.js"></script>
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/examples/shared/examples.js"></script>
        <script type="text/javascript" src="extjs-docs-5.0.0/extjs-build/build/packages/ext-charts/build/ext-charts.js"></script>
        <script type="text/javascript">
<?php
echo "var USUARIOESCUELA = '" . $_SESSION["USUARIOESCUELA"] . "';" .
 "var IDROLESCUELA = " . $_SESSION["IDROLESCUELA"] . ";" .
 "var email = '" . $_SESSION["EMAIL"] . "';" .
 "var PERSONAESCUELA = '" . $_SESSION["PERSONAESCUELA"] . "';";
?></script>
        <script type="text/javascript" src="js/requerid/functions.js"></script>
        <script type="text/javascript" src="js/requerid/stores.js"></script>
        <script type="text/javascript" src="js/roles/representante.js"></script>
        <script type="text/javascript" src="js/administracion/ventanaUsuario.js"></script>
        <script type="text/javascript" src="js/extra/ventanaCreditos.js"></script>     
    </head>
    <body oncontextmenu = "return false">  
    </body>
</html>