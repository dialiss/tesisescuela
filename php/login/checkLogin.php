<?php

include('../login/isLogin.php');

if (isset($_SESSION["IDROLESCUELA"])) {
        echo "0";
} else {
    echo "1";
}

