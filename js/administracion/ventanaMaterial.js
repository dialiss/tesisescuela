var winAdminMaterial;
var formAdminMaterial;
var gridAdminMaterial;
Ext.onReady(function () {
    Ext.define('DataMaterial', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'id_material', type: 'int'},
            {name: 'id_materia', type: 'int'},
            {name: 'materia', type: 'string'},
            {name: 'id_docente', type: 'int'},            
            {name: 'docente', type: 'string'},
            {name: 'material', type: 'string'},
            {name: 'archivo', type: 'string'}

        ]



    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataMaterial',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/material/read.php',
                create: 'php/administracion/material/create.php',
                update: 'php/administracion/material/update.php',
                destroy: 'php/administracion/material/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'material',
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
                        formAdminMaterial.getForm().reset();
                    }
                }
            }
        }
    });


    gridAdminMaterial = Ext.create('Ext.grid.Panel', {
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

    formAdminMaterial = Ext.create('Ext.form.Panel', {
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
                        handler: onUpdateMaterial
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateMaterial
                    }, {
                        icon: 'img/clean.png',
                        tooltip: 'Limpiar',
                        text: 'Limpiar campos',
                        handler: onResetMaterial
                    }, {
                        iconCls: 'icon-cancelar',
                        tooltip: 'Cancelar',
                        handler: function () {
                            winAdminMaterial.hide();
                        }
                    }]
            }]
    });
});

function showWinObservaciones() {
    if (!winAdminMaterial) {
        winAdminMaterial = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de materias',
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
                        gridAdminMaterial,
                        formAdminMaterial
                    ]
                }]
        });
    }
    onResetMaterial();
    winAdminMaterial.show();

}

function setActiveRecordObservacion(record) {
    formAdminMaterial.activeRecord = record;
    if (record) {
        formAdminMaterial.down('#update').enable();

        formAdminMaterial.down('#create').disable();
        formAdminMaterial.getForm().loadRecord(record);

    } else {
        formAdminMaterial.down('#update').disable();

        formAdminMaterial.getForm().reset();
    }
}

function onUpdateMaterial() {
    var active = formAdminMaterial.activeRecord,
            form = formAdminMaterial.getForm();
//    formAdminUser.down('#create').enable();

    if (!active) {
        return;
    }
    if (form.isValid()) {
        var bandera = true;


        if (bandera === true) {
            form.updateRecord(active);
            onResetMaterial();
        } else {
            Ext.example.msg('Mensaje', 'Ingrese los datos correctamente');
        }
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente');

    }
}

function onCreateMaterial() {
    var form = formAdminMaterial.getForm();

    if (form.isValid()) {
        bandera = true;



        if (bandera === true) {
            formAdminMaterial.fireEvent('create', formAdminMaterial, form.getValues());
            formAdminMaterial.down('#update').disable();
            form.reset();
        } else {
            Ext.example.msg('Mensaje', 'Ingrese los datos correctamente');
        }
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente');

    }
}

function onResetMaterial() {
    formAdminMaterial.getForm().reset();
    gridAdminMaterial.getView().deselect(gridAdminMaterial.getSelection());
    formAdminMaterial.down('#create').enable();
}

function onDeleteMaterial() {
    Ext.MessageBox.confirm('Atención!', 'Desea eliminar el material', function (choice) {
        if (choice === 'yes') {
            var selection = gridAdminMaterial.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminMaterial.store.remove(selection);
                formAdminMaterial.down('#update').disable();
                formAdminMaterial.down('#create').enable();
            }
        }
    });
}