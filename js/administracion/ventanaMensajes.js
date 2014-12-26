var winAdminMensajes;
var formAdminMensaje;
var gridAdminMensaje;
Ext.onReady(function () {
    Ext.define('DataMensaje', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'id_mensaje', type: 'int'},
            {name: 'id_envia', type: 'int'},
            {name: 'envia', type: 'string'},
            {name: 'id_recibe', type: 'int'},
            {name: 'recibe', type: 'string'},
            {name: 'mensaje', type: 'string'},
            {name: 'fecha_hora_envio', type: 'string'}

        ]



    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataMensaje',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/mensaje/read.php',
                create: 'php/administracion/mensaje/create.php',
                update: 'php/administracion/mensaje/update.php',
                destroy: 'php/administracion/mensaje/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'mensajes',
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
                        formAdminMensaje.getForm().reset();
                    }
                }
            }
        }
    });


    gridAdminMensaje = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {header: "Envía", width: 200, sortable: true, dataIndex: 'envia', filter: {type: 'string'}}, {header: "Recibe", width: 200, sortable: true, dataIndex: 'recibe', filter: {type: 'string'}},
            {header: "Mensaje", width: 200, sortable: true, dataIndex: 'mensaje', filter: {type: 'string'}},
            {header: "Fecha y hora", width: 90, sortable: true, dataIndex: 'fecha_hora_envio', filter: {type: 'string'}}
        ],
        stripeRows: true,
        width: '50%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
        features: [filters],
        listeners: {selectionchange: function (thisObject, selected, eOpts) {
                setActiveRecordMensaje(selected[0] || null);

            }
        }
    });

    formAdminMensaje = Ext.create('Ext.form.Panel', {region: 'center',
        title: 'Ingresar datos del mensaje',
        activeRecord: null,
        bodyPadding: '10 10 10 10',
        margins: '0 0 0 3',
        defaultType: 'textfield',
        layout: 'anchor',
        fieldDefaults: {msgTarget: 'side'
        },
        defaults: {anchor: '100%'
        },
        items: [{
                fieldLabel: 'Envia',
                afterLabelTextTpl: required,
                name: 'envia',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Quien envía...'

            }, {
                fieldLabel: 'Recibe',
                afterLabelTextTpl: required,
                name: 'recibe',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Quien recibe...'
            }, {
                fieldLabel: 'Mensaje',
                afterLabelTextTpl: required,
                name: 'mensaje',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Mensaje...'
            }, {
                fieldLabel: 'Fecha y hora',
                afterLabelTextTpl: required,
                name: 'fecha_hora_envio',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Fecha y hora...'
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
                        handler: onUpdateMensaje}, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear',
                        handler: onCreateMensaje
                    }, {
                        icon: 'img/clean.png',
                        tooltip: 'Limpiar',
                        text: 'Limpiar campos',
                        handler: onResetMensaje
                    }, {
                        iconCls: 'icon-cancelar',
                        tooltip: 'Cancelar',
                        handler: function () {
                            winAdminMensajes.hide();
                        }}]
            }]
    });
});

function showWinMensajes() {
    if (!winAdminMensajes) {
        winAdminMensajes = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de mensajes',
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
                        gridAdminMensaje,
                        formAdminMensaje
                    ]}]
        });
    }
    onResetMensaje();
    winAdminMensajes.show();

}

function setActiveRecordMensaje(record) {
    formAdminMensaje.activeRecord = record;
    if (record) {
        formAdminMensaje.down('#update').enable();

        formAdminMensaje.down('#create').disable();
        formAdminMensaje.getForm().loadRecord(record);

    } else {
        formAdminMensaje.down('#update').disable();

        formAdminMensaje.getForm().reset();
    }
}

function onUpdateMensaje() {
    var active = formAdminMensaje.activeRecord,
            form = formAdminMensaje.getForm();
    //    formAdminUser.down('#create').enable();

    if (!active) {
        return;
    }
    if (form.isValid()) {
        var bandera = true;


        if (bandera === true) {
            form.updateRecord(active);
            onResetMensaje();
        } else {
            Ext.example.msg('Mensaje', 'Ingrese los datos correctamente');
        }
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente');

    }
}

function onCreateMensaje() {
    var form = formAdminMensaje.getForm();

    if (form.isValid()) {
        bandera = true;



        if (bandera === true) {
            formAdminMensaje.fireEvent('create', formAdminMensaje, form.getValues());
            formAdminMensaje.down('#update').disable();
            form.reset();
        } else {
            Ext.example.msg('Mensaje', 'Ingrese los datos correctamente');
        }
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente');

    }
}

function onResetMensaje() {
    formAdminMensaje.getForm().reset();
    gridAdminMensaje.getView().deselect(gridAdminMensaje.getSelection());
    formAdminMensaje.down('#create').enable();
}

function onDeleteMensaje() {
    Ext.MessageBox.confirm('Atención!', 'Desea eliminar la observación', function (choice) {
        if (choice === 'yes') {
            var selection = gridAdminMensaje.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminMensaje.store.remove(selection);
                formAdminMensaje.down('#update').disable();
                formAdminMensaje.down('#create').enable();
            }
        }
    });
}