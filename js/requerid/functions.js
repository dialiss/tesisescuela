/*Funciones para guardar Geolocalizacion de Usuario*/
var cadena;
var data = [];

function test(){
    alert("Test");
}
/*
 Funciones para realizar Geolocalización
 */
function getLocation() {
    if (navigator.geolocation) {
        var position = navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        //x.innerHTML="Geolocation is not supported by this browser.";
        Ext.example.msg('Error', 'Geolocalizacion no es soportada por este navegador.');
    }
}

function showPosition(position) {
    //x.innerHTML="Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude; 
    localizarDireccion(position.coords.longitude, position.coords.latitude, 17);
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            //x.innerHTML="User denied the request for Geolocation."
            Ext.example.msg('Error', 'User denied the request for Geolocation.');
            break;
        case error.POSITION_UNAVAILABLE:
            //x.innerHTML="Location information is unavailable."
            Ext.example.msg('Error', 'Location information is unavailable.');
            break;
        case error.TIMEOUT:
            //x.innerHTML="The request to get user location timed out."
            Ext.example.msg('Error', 'The request to get user location timed out.');
            break;
        case error.UNKNOWN_ERROR:
            //x.innerHTML="An unknown error occurred."
            Ext.example.msg('Error', 'An unknown error occurred.');
            break;
    }
}

/*
 Funciones para recargar la region Este del sistema de forma Automatica
 */

function formatoFecha(date) {
    var año = date.getFullYear();
    var mes = date.getMonth() + 1;
    if (mes < 10) {
        mes = "0" + mes;
    }
    var dia = date.getDate();
    if (dia < 10) {
        dia = "0" + dia;
    }
    return año + '-' + mes + '-' + dia;
}

function formatoHora(time) {
    var hora = time.getHours();
    if (hora < 10) {
        hora = "0" + hora;
    }
    var minuto = time.getMinutes();
    if (minuto < 10) {
        minuto = "0" + minuto;
    }
    var segundo = time.getSeconds();
    if (segundo < 10) {
        segundo = "0" + segundo;
    }
    return hora + ':' + minuto + ':' + segundo;
}

function check_cedula(cedula) {
    var h = cedula.split("");
    var tamanoCedula = h.length;
    if (tamanoCedula === 10) {
        var digitoProvincia = cedula.substring(0, 2);
        var digitoTres = cedula.substring(2, 3);
        if ((digitoProvincia > 0 && digitoProvincia < 25) && digitoTres < 6) {
            var f = 0;
            var a = (h[9] * 1);
            for (i = 0; i < (tamanoCedula - 1); i++) {
                var g = 0;
                if ((i % 2) !== 0) {
                    f = f + (h[i] * 1);
                } else {
                    g = h[i] * 2;
                    if (g > 9) {
                        f = f + (g - 9);
                    } else {
                        f = f + g;
                    }
                }
            }
            var e = f / 10;
            e = Math.floor(e);
            e = (e + 1) * 10;
            var d = (e - f);
            if ((d === 10 && a === 0) || (d === a)) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    } else {
        return false;
    }
}

function getNavigator() {
    if (navigator.appName === "Microsoft Internet Explorer") {
        return 'img/explorer.png';
        //return '<img src="img/explorer.png" width="16" height="16">';
    } else {
        if (navigator.userAgent.indexOf('Chrome') !== -1) {
            return 'img/chrome.png';
            //return '<img src="img/chrome.png" width="16" height="16">';
        } else if (navigator.userAgent.indexOf('Firefox') !== -1) {
            return 'img/firefox.png';
            //return '<img src="img/firefox.png" width="16" height="16">';
        } else if (navigator.userAgent.indexOf('Apple') !== -1) {
            return 'img/safari.png';
            //return '<img src="img/safari.png" width="16" height="16">';
        } else {
            return 'Desconocido';
        }
    }
}

function checkRolSesion(IDROLESCUELA) {
    Ext.Ajax.request({
        url: 'php/login/checkLogin.php',
        params: {
            IDROLESCUELA: IDROLESCUELA
        },
        success: function (response) {
            if (parseInt(response.responseText) === 1) {
                window.location = 'index.php';
            }
        }
    });

    setTimeout(function () {
        checkRolSesion(IDROLESCUELA);
    }
    , 3 * 1000);
}

function reloadStore(store, cant) {
    setTimeout(function () {
        reloadStore(store, cant);
        store.reload();
    }
    , cant * 1000);
}
function formatActiveUser(val) {
    if (val === 0) {
        return '<span style="color:green;">NO</span>';
    } else {
        return '<span style="color:red;">SI</span>';
    }
}