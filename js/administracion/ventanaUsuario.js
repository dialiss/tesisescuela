var winAdminUser;
var formAdminUser;
var gridAdminUser;
var estado = 0;
Ext.onReady(function () {
    Ext.define('DataUser', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'idUsuario', type: 'int'},
            {name: 'cedula', type: 'string'},
            {name: 'idRolUser', type: 'int'},
            {name: 'nombres', type: 'string'},
            {name: 'apellidos', type: 'string'},
            {name: 'rol', type: 'string'},
            {name: 'correo', type: 'string'},
            {name: 'celular', type: 'string'},
            {name: 'telf_conv', type: 'string'},
            {name: 'usuario', type: 'string'},
            {name: 'estado', type: 'int'},
            {name: 'clave', type: 'string'}

        ]



    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataUser',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/usuario/read.php',
                create: 'php/administracion/usuario/create.php',
                update: 'php/administracion/usuario/update.php',
                destroy: 'php/administracion/usuario/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'usuarios',
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
                        formAdminUser.getForm().reset();
                        estado = 0;
                    }
                }
            }
        }
    });


    gridAdminUser = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        tbar: [{
                text: '<b>Habilitar</b>',
                iconCls: 'icon-lock',
                itemId: 'habilitar',
                handler: function () {
                    var sm = gridAdminUser.getSelectionModel();
                    iduser = sm.getSelection()[0].get('id');
                    usuario = sm.getSelection()[0].get('cedula');
                    Ext.Ajax.request({
                        url: 'php/administracion/usuario/setState.php',
                        params: {
                            val: 0,
                            id: iduser,
                            usuario: usuario
                        },
                        method: 'POST',
                        failure: function (form, action) {
                            Ext.MessageBox.show({
                                title: 'Error...',
                                msg: 'No fue posible Actualizar Estado',
                                buttons: Ext.MessageBox.ERROR,
                                icon: Ext.MessageBox.ERROR
                            });
                        },
                        success: function (form, action) {
                            Ext.example.msg("Mensaje", 'Estado Modificado Correctamente...');
                            gridStore.reload();
                            setActiveRecordUser(sm.getSelection()[0] || null);
                            gridAdminUser.down('#deshabilitar').enable();
                            gridAdminUser.down('#habilitar').disable();

                        }
                    });
                }
            }, {
                itemId: 'deshabilitar',
                text: '<b>Deshabilitar</b>',
                iconCls: 'icon-unlock',
                handler: function () {
                    var sm = gridAdminUser.getSelectionModel();
                    iduser = sm.getSelection()[0].get('id');
                    usuario = sm.getSelection()[0].get('cedula');
                    Ext.Ajax.request({
                        url: 'php/administracion/usuario/setState.php',
                        params: {
                            val: 1,
                            id: iduser,
                            usuario: usuario
                        },
                        method: 'POST',
                        failure: function (form, action) {
                            Ext.MessageBox.show({
                                title: 'Error...',
                                msg: 'No fue posible Actualizar Estado',
                                buttons: Ext.MessageBox.ERROR,
                                icon: Ext.MessageBox.ERROR
                            });
                        },
                        success: function (form, action) {
                            Ext.example.msg("Mensaje", "Usuario deshabilitado correctamente.");
                            gridStore.reload();
                            setActiveRecordUser(null);
                            gridAdminUser.down('#deshabilitar').disable();
                            gridAdminUser.down('#habilitar').enable();

                        }
                    });

                }

            }],
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {header: "Cedula", width: 100, sortable: true, dataIndex: 'cedula', filter: {type: 'string'}},
            {header: "Nombres", width: 10, sortable: true, dataIndex: 'nombres', filter: {type: 'string'}},
            {header: "Apellidos", width: 100, sortable: true, dataIndex: 'apellidos', filter: {type: 'string'}},
            {header: "Usuario", width: 125, sortable: true, dataIndex: 'usuario', filter: {type: 'string'}},
            {header: "Rol de Usuario", width: 150, sortable: true, dataIndex: 'rol', filter: {type: 'list', store: storeRolUserList}, align: 'center'},
            {header: "Bloqueado", width: 100, sortable: true, dataIndex: 'estado', renderer: formatActiveUser, filter: {type: 'list', store: storeActiveUserList}, align: 'center'}
        ],
        stripeRows: true,
        width: '50%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
        features: [filters],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                if (estado === 1) {
                    setActiveRecordUser(selected[0] || null);

                } else {
                    if (selected[0].get('estado') === 0) {
                        setActiveRecordUser(selected[0] || null);
                        gridAdminUser.down('#deshabilitar').enable();
                        gridAdminUser.down('#habilitar').disable();


                    } else {
                        setActiveRecordUser(null);
                        gridAdminUser.down('#habilitar').enable();
                        gridAdminUser.down('#deshabilitar').disable();


                    }
                }
            }
        }
    });

    formAdminUser = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar Datos del Usuario',
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
                xtype: 'combobox',
                fieldLabel: 'Rol de usuario',
                afterLabelTextTpl: required,
                name: 'rol',
                store: storeRoles,
                valueField: 'id',
                displayField: 'nombre',
                queryMode: 'local',
                allowBlank: false,
                editable: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Seleccionar rol...'
            }, {
                fieldLabel: 'Cédula',
                afterLabelTextTpl: required,
                name: 'usuario',
                allowBlank: false,
                vtype: 'cedulaValida',
                blankText: 'Este campo es obligatorio',
                emptyText: '0702223334...'

            }, {
                fieldLabel: 'Nombres',
                afterLabelTextTpl: required,
                name: 'nombres',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Ingrese sus nombres...'

            }, {
                fieldLabel: 'Apellidos',
                afterLabelTextTpl: required,
                name: 'apellidos',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Ingrese sus apellidos...'

            }, {
                fieldLabel: 'Correo',
                afterLabelTextTpl: required,
                name: 'correo',
                vtype: 'emailNuevo',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'test@tesisescuela.edu.ec...'

            }, {
                fieldLabel: 'Cédula',
                afterLabelTextTpl: required,
                name: 'cedula',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: '0703234567...'

            }, {
                fieldLabel: 'Celular',
                afterLabelTextTpl: required,
                name: 'celular',
                vtype: 'numeroTelefono',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: '0978342512...'

            }, {
                fieldLabel: 'Teléfono',
                afterLabelTextTpl: required,
                name: 'telf_conv',
                blankText: 'Este campo es obligatorio',
                emptyText: '0978342512...'

            }, {
                fieldLabel: 'Contraseña',
                afterLabelTextTpl: required,
                name: 'clave',
                itemId: 'pass',
                allowBlank: false,
                blankText: 'Contraseña es obligatoria',
                inputType: 'password',
                emptyText: 'Ingrese contraseña...',
                handler:function () {
                    
                    console.log("test");
                }
            }, {
                fieldLabel: 'Confirme contraseña',
                afterLabelTextTpl: required,
                name: 'passwordUser',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                inputType: 'password',
                emptyText: 'Ingrese contraseña cuevamente...',
                vtype: 'password',
                initialPassField: 'pass'
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
                        tooltip: 'Actualizar usuario',
                        handler: onUpdateUser
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear usuario',
                        handler: onCreateUser
                    }, {
                        icon: 'img/clean.png',
                        tooltip: 'Limpiar',
                        text: 'Limpiar campos',
                        handler: onResetUser
                    }, {
                        iconCls: 'icon-cancelar',
                        tooltip: 'Cancelar',
                        handler: function () {
                            winAdminUser.hide();
                        }
                    }]
            }]
    });
});

function showWinAdminUser() {
    if (!winAdminUser) {
        winAdminUser = Ext.create('Ext.window.Window', {
            layout: 'fit',
            title: 'Administración de usuarios',
            iconCls: 'icon-user',
            resizable: false,
            width: 1000,
            height: 450,
            closeAction: 'hide',
            plain: false,
            items: [{
                    layout: 'border',
                    bodyPadding: 5,
                    items: [
                        gridAdminUser,
                        formAdminUser
                    ]
                }]
        });
    }
    onResetUser();
    winAdminUser.show();
    gridAdminUser.down('#habilitar').disable();
    gridAdminUser.down('#deshabilitar').disable();

}

function setActiveRecordUser(record) {
    formAdminUser.activeRecord = record;
    if (record) {
        formAdminUser.down('#update').enable();

        formAdminUser.down('#create').disable();
        formAdminUser.getForm().loadRecord(record);

    } else {
        formAdminUser.down('#update').disable();

        formAdminUser.getForm().reset();
    }
}

function onUpdateUser() {
    var active = formAdminUser.activeRecord,
            form = formAdminUser.getForm();
//    formAdminUser.down('#create').enable();

    if (!active) {
        return;
    }
    if (form.isValid()) {
        var bandera = true;
               

        if (bandera === true) {
            form.updateRecord(active);
            onResetUser();
        } else {
            Ext.example.msg('Mensaje', 'Ingrese los datos correctamente');
        }
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente');

    }
}

function onCreateUser() {
    var form = formAdminUser.getForm();

    if (form.isValid()) {
       bandera = true;
       
        

        if (bandera === true) {
            formAdminUser.fireEvent('create', formAdminUser, form.getValues());
            formAdminUser.down('#update').disable();
            form.reset();
        } else {
            Ext.example.msg('Mensaje', 'Ingrese los datos correctamente');
        }
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente');

    }
}

function onResetUser() {
    formAdminUser.getForm().reset();
    gridAdminUser.getView().deselect(gridAdminUser.getSelection());
    formAdminUser.down('#create').enable();
}

function onDeleteUser() {
    Ext.MessageBox.confirm('Atención!', 'Desea eliminar el usuario', function (choice) {
        if (choice === 'yes') {
            estado = 1;
            var selection = gridAdminUser.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminUser.store.remove(selection);
                formAdminUser.down('#update').disable();

                formAdminUser.down('#create').enable();
            }
        }
    });
}