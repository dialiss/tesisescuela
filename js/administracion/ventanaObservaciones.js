var winAdminObservaciones;
var formAdminObservacion;
var gridAdminObservacion;
Ext.onReady(function () {
    Ext.define('DataObservaciòn', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'id_observacion', type: 'int'},
            {name: 'id_docente', type: 'int'},
            {name: 'docente', type: 'string'},
            {name: 'id_estudiante', type: 'int'},
            {name: 'estudiante', type: 'string'},
            {name: 'observacion', type: 'string'},
            {name: 'fecha', type: 'string'}

        ]



    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataObservaciòn',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/observacion/read.php',
                create: 'php/administracion/observacion/create.php',
                update: 'php/administracion/observacion/update.php',
                destroy: 'php/administracion/observacion/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'observaciones',
                messageProperty: 'message'
            },
            writer: {
                type: 'json',
                writeAllFields: false
            },
            listeners: {
                exception: function (proxy, response, operation) {
                    Ext.MessageBox.show({
                        title: 'ERROR',
                        msg: operation.getError(),
                        icon: Ext.MessageBox.ERROR,
                        buttons: Ext.Msg.OK
                    });
                }
            }
        },
        listeners: {
            write: function (store, operation, eOpts) {
                if (operation.success) {
                    Ext.example.msg("Mensaje", operation._resultSet.message);
                    //gridStore.reload();
                    if (operation.state) {
                        gridStore.reload();
                        formAdminObservacion.getForm().reset();
                    }
                }
            }
        }
    });


    gridAdminObservacion = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {header: "Observacion", width: 200, sortable: true, dataIndex: 'observacion', filter: {type: 'string'}},
            {header: "Docente", width: 200, sortable: true, dataIndex: 'docente', filter: {type: 'string'}},
            {header: "Estudiante", width: 200, sortable: true, dataIndex: 'estudiante', filter: {type: 'string'}},
            {header: "Fecha", width: 90, sortable: true, dataIndex: 'fecha', filter: {type: 'string'}}
        ],
        stripeRows: true,
        width: '50%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
        features: [filters],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                setActiveRecordObservacion(selected[0] || null);

            }
        }
    });

    formAdminObservacion = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar datos de la observacion',
        activeRecord: null,
        bodyPadding: '10 10 10 10',
        margins: '0 0 0 3',
        defaultType: 'textfield',
        layout: 'anchor',
        fieldDefaults: {
            msgTarget: 'side'
        },
        defaults: {
            anchor: '100%'
        },
        items: [{
                fieldLabel: 'Docente',
                afterLabelTextTpl: required,
                name: 'docente',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Nombre del docente...'

            }, {
                fieldLabel: 'Estudiante',
                afterLabelTextTpl: required,
                name: 'estudiante',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Nombre del estdiante...'
            }],
        listeners: {
            create: function (form, data) {
                gridStore.insert(0, data);
                gridStore.reload();
            }
        },
        dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'footer',
                items: ['->', {
                        iconCls: 'icon-update',
                        itemId: 'update',
                        text: 'Actualizar',
                        disabled: true,
                        tooltip: 'Actualizar',
                        handler: onUpdateObservacion
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateObservacion
                    }, {
                        icon: 'img/clean.png',
                        tooltip: 'Limpiar',
                        text: 'Limpiar campos',
                        handler: onResetObservacion
                    }, {
                        iconCls: 'icon-cancelar',
                        tooltip: 'Cancelar',
                        handler: function () {
                            winAdminObservaciones.hide();
                        }
                    }]
            }]
    });
});

function showWinObservaciones() {
    if (!winAdminObservaciones) {
        winAdminObservaciones = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de observaciones',
            iconCls: 'icon-user',
            resizable: false,
            width: 1000,
            height: 250,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminObservacion,
                        formAdminObservacion
                    ]
                }]
        });
    }
    onResetObservacion();
    winAdminObservaciones.show();

}

function setActiveRecordObservacion(record) {
    formAdminObservacion.activeRecord = record;
    if (record) {
        formAdminObservacion.down('#update').enable();

        formAdminObservacion.down('#create').disable();
        formAdminObservacion.getForm().loadRecord(record);

    } else {
        formAdminObservacion.down('#update').disable();

        formAdminObservacion.getForm().reset();
    }
}

function onUpdateObservacion() {
    var active = formAdminObservacion.activeRecord,
            form = formAdminObservacion.getForm();
//    formAdminUser.down('#create').enable();

    if (!active) {
        return;
    }
    if (form.isValid()) {
        var bandera = true;


        if (bandera === true) {
            form.updateRecord(active);
            onResetObservacion();
        } else {
            Ext.example.msg('Mensaje', 'Ingrese los datos correctamente');
        }
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente');

    }
}

function onCreateObservacion() {
    var form = formAdminObservacion.getForm();

    if (form.isValid()) {
        bandera = true;



        if (bandera === true) {
            formAdminObservacion.fireEvent('create', formAdminObservacion, form.getValues());
            formAdminObservacion.down('#update').disable();
            form.reset();
        } else {
            Ext.example.msg('Mensaje', 'Ingrese los datos correctamente');
        }
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente');

    }
}

function onResetObservacion() {
    formAdminObservacion.getForm().reset();
    gridAdminObservacion.getView().deselect(gridAdminObservacion.getSelection());
    formAdminObservacion.down('#create').enable();
}

function onDeleteObservacion() {
    Ext.MessageBox.confirm('Atención!', 'Desea eliminar la observación', function (choice) {
        if (choice === 'yes') {
            var selection = gridAdminObservacion.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminObservacion.store.remove(selection);
                formAdminObservacion.down('#update').disable();
                formAdminObservacion.down('#create').enable();
            }
        }
    });
}