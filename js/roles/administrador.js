Ext.Loader.setConfig({
    enabled: true
});
Ext.Loader.setPath('Ext.ux', 'extjs-docs-5.0.0/extjs-build/build/examples/ux');
Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.util.*',
    'Ext.state.*',
    'Ext.form.*',
    'Ext.ux.form.MultiSelect',
    'Ext.ux.form.ItemSelector',
    'Ext.ux.ajax.JsonSimlet',
    'Ext.ux.ajax.SimManager',
    'Ext.ux.grid.FiltersFeature',
    'Ext.selection.CellModel',
    'Ext.ux.CheckColumn',
    'Ext.ux.Spotlight'
]);

var panelCentro;

var required = '<span style="color:red;font-weight:bold" data-qtip="Requerido">*</span>';

var filters = {
    ftype: 'filters',
    // encode and local configuration options defined previously for easier reuse
    encode: false, // json encode the filter query
    local: true, 
    filters: [{
            type: 'boolean',
            dataIndex: 'visible'
        }]
};

var idEqpMen;

var spot = Ext.create('Ext.ux.Spotlight', {
    easing: 'easeOut',
    duration: 500
});

Ext.onReady(function () {
    Ext.apply(Ext.form.field.VTypes, {
        daterange: function (val, field) {
            var date = field.parseDate(val);

            if (!date) {
                return false;
            }
            if (field.startDateField && (!this.dateRangeMax || (date.getTime() !== this.dateRangeMax.getTime()))) {
                var start = field.up('form').down('#' + field.startDateField);
                start.setMaxValue(date);
                start.validate();
                this.dateRangeMax = date;
            }
            else if (field.endDateField && (!this.dateRangeMin || (date.getTime() !== this.dateRangeMin.getTime()))) {
                var end = field.up('form').down('#' + field.endDateField);
                end.setMinValue(date);
                end.validate();
                this.dateRangeMin = date;
            }
            /*
             * Always return true since we're only using this vtype to set the
             * min/max allowed values (these are tested for after the vtype test)
             */
            return true;
        },
        daterangeText: 'La fecha de inicio debe ser menor a la fecha de fin ',
        password: function (val, field) {
            if (field.initialPassField) {
                var pwd = field.up('form').down('#' + field.initialPassField);
                return (val === pwd.getValue());
            }
            return true;
        },
        passwordText: 'Las Contraseñas no coinciden',
        cedulaValida: function (val, field) {
            if (val.length !== 10) {
                return false;
            }

            if (val.length === 10) {
                if (check_cedula(val)) {
                    return true;
                } else {
                    return false;
                }
            }
            return true;
        },
        cedulaValidaText: 'Numero de cedula inválida',
        camposMin: function (val, field) {
            if (!/^[0-9A-Za-zñ\s*]{3,10}$/.test(val)) {
                return  false;
            }
            return true;
        },
        camposMinText: 'Solo carateres alfa numéricos<br> Tamaño min de 3 y un máx de 10 carateres',
        campos: function (val, field) {
            if (!/^[0-9.A-Z.a-záéíóúñÑÁÉÍÓÚ\s*]{3,80}$/.test(val)) {
                return  false;
            }
            return true;
        },
        camposText: 'Solo carateres alfa numéricos<br> Tamaño min de 3 y un máx de 80 carateres',
        numeroTelefono: function (val, field) {
            var partes = val.split("");
            if (partes.length === 10) {
                if (!/^[0]{1}[9]{1}[0-9]{8}$/.test(val)) {
                    return  false;
                } else {
                    return  true;
                }
            } else {
                if (!/^[0]{1}[7]{1}[2]{1}[0-9]{6}$/.test(val)) {
                    return  false;
                } else {
                    return true;
                }
            }
        },
        alphanum1: function (val, field) {
            if (!/^[0-9.A-Z.a-záéíóúñ\s*]{3,45}$/.test(val)) {
                return  false;
            }
            return true;
        },
        num1: function (val, field) {
            if (!/^[0-9]{3,45}$/.test(val)) {
                return  false;
            }
            return true;
        },
        num1Text: 'Solo carateres numéricos',
        emailNuevo: function (val, field) {
            if (!/^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$/.test(val)) {
                return  false;
            }
            return true;
        },
        emailNuevoText: 'Dede ingresar segun el formato test@tesisescuela.edu.ec <br>sin caracteres especiales',
    });

    Ext.tip.QuickTipManager.init();
 
    var administracion = Ext.create('Ext.button.Button', {
        text: 'Administración',
        iconCls: 'icon-config',
        scope: this,
        menu: [
            {text: 'Materias', icon: 'img/icon_config.png', handler: showWinMaterias},
            {text: 'Usuarios', icon: 'img/user_add.gif', handler: showWinAdminUser},
            {text: 'Observaciones', icon: 'img/key.gif', handler: showWinObservaciones},
            {text: 'Mensajes', icon: 'img/key.gif', handler: showWinAdminUser}, '-',
            {text: 'Material didáctico', icon: 'img/icon_estadistica.png', handler: showWinMateriales}
        ]
    });


    var salir = Ext.create('Ext.button.Button', {
        text: 'Cerrar sesión',
        scope: this,
        icon: 'img/log_out.png',
        handler: function () {
            window.location = 'php/login/logout.php';
        }
    });

    var barraMenu = Ext.create('Ext.toolbar.Toolbar', {
        width: '100%',
        items: [{
                text: 'Menú de reportes',
                icon: 'img/page_attach.png',
                menu: [
                    {text: 'Reporte de calificaciones', icon: 'img/icon_reg_inst.png', handler: function () {
                            Ext.example.msg('Mensaje', 'Por favor espere...');
                        }
                    },
                    {text: 'Reporte de asistencias', icon: 'img/user.gif', handler: function () {
                             Ext.example.msg('Mensaje', 'Por favor espere...');
                        }
                    },
                    {text: 'Lista de estudiantes', icon: 'img/user.gif', handler: function () {
                            Ext.example.msg('Mensaje', 'Por favor espere...');
                        }
                    }, '-',
                    {text: 'Lista de materias', icon: 'img/user.gif', handler: function () {
                            Ext.example.msg('Mensaje', 'Por favor espere...');
                        }
                    },
                    {text: 'Lista de docentes', icon: 'img/user.gif', handler: function () {
                             Ext.example.msg('Mensaje', 'Por favor espere...');
                        }
                    }
                ]
            },
            administracion,
            '->', salir, {
                xtype: 'image',
                src: getNavigator(),
                width: 16,
                height: 16,
                margin: '0 5 0 0'
            }, {
                xtype: 'label',
                html: '<iframe src="http://free.timeanddate.com/clock/i3x5kb7x/n190/tlec4/fn12/fs18/tct/pct/ftb/bas0/bat0/th1" frameborder="0"   width= "100" height="15" allowTransparency="true"></iframe>'
            }
        ]
    });

    var panelMenu = Ext.create('Ext.form.Panel', {
        region: 'north',
        items: [{
                layout: 'hbox',
                bodyStyle: {
                    background: '#add2ed'
                },
                items: [{
                        xtype: 'label',
                        html: '<a href="" target="_blank"><img src="img/sga.png" width="64" height="64"></a>'
                    }, {
                        xtype: 'label',
                        padding: '15 0 0 0',
                        style: {
                            color: '#157fcc'
                        },
                        html: '<section id="panelNorte">' +
                                '<center><strong id="titulo">Sistema de Gestión Académica</strong></center>' +
                                '<strong id="subtitulo">Bienvenid@ al sistema: ' + PERSONAESCUELA + '</strong>' +
                                '</section>'
                    }]
            },
            barraMenu]
    });
    panelCentro = Ext.create('Ext.tab.Panel', {
        region: 'center',
        frame: true,
        deferreRender: false,
        activeTab: 0,
        items: [{
                title: 'Escuela',
                id: 'panelMapaTab',
                iconCls: 'icon-mapa',
                html: '<div STYLE="color:cyan"><center><img src="img/tesis.jpg" width="70%"></center></div>'
            }]
    });

    panelCentral = Ext.create('Ext.form.Panel', {
        region: 'center',
        layout: 'border',
        items: [
            panelCentro
        ]
    });

    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        items: [panelMenu, panelCentral]
    });

});
