var winAdminMaterias;
var formAdminMateria;
var gridAdminMateria;
Ext.onReady(function () {
    Ext.define('DataMateria', {
        extend: 'Ext.data.Model',
        fields: [
            {name: 'id', mapping: 'id_materia', type: 'int'},
            {name: 'materia', type: 'string'},
            {name: 'descripcion', type: 'string'}

        ]



    });

    var gridStore = Ext.create('Ext.data.Store', {
        autoLoad: true,
        autoSync: true,
        model: 'DataMateria',
        proxy: {
            type: 'ajax',
            api: {
                read: 'php/administracion/materia/read.php',
                create: 'php/administracion/materia/create.php',
                update: 'php/administracion/materia/update.php',
                destroy: 'php/administracion/materia/destroy.php'
            },
            reader: {
                type: 'json',
                successProperty: 'success',
                root: 'materias',
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
                        formAdminMateria.getForm().reset();
                    }
                }
            }
        }
    });


    gridAdminMateria = Ext.create('Ext.grid.Panel', {
        store: gridStore,
        columns: [
            Ext.create('Ext.grid.RowNumberer', {text: 'Nº', width: 30, align: 'center'}),
            {header: "Materia", width: 200, sortable: true, dataIndex: 'materia', filter: {type: 'string'}},
            {header: "Descripción", width: 300, sortable: true, dataIndex: 'descripcion', filter: {type: 'string'}}
        ],
        stripeRows: true,
        width: '50%',
        margins: '0 2 0 0',
        region: 'west',
        title: 'Registros',
        features: [filters],
        listeners: {
            selectionchange: function (thisObject, selected, eOpts) {
                setActiveRecordMateria(selected[0] || null);

            }
        }
    });

    formAdminMateria = Ext.create('Ext.form.Panel', {
        region: 'center',
        title: 'Ingresar datos de la materia',
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
                fieldLabel: 'Materia',
                afterLabelTextTpl: required,
                name: 'materia',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Nombre de la materia...'

            }, {
                fieldLabel: 'Descripcion',
                afterLabelTextTpl: required,
                name: 'descripcion',
                allowBlank: false,
                blankText: 'Este campo es obligatorio',
                emptyText: 'Descripción de la materia...'

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
                        handler: onUpdateMateria
                    }, {
                        iconCls: 'icon-add',
                        text: 'Crear',
                        itemId: 'create',
                        tooltip: 'Crear usuario',
                        handler: onCreateMateria
                    }, {
                        icon: 'img/clean.png',
                        tooltip: 'Limpiar',
                        text: 'Limpiar campos',
                        handler: onResetMateria
                    }, {
                        iconCls: 'icon-cancelar',
                        tooltip: 'Cancelar',
                        handler: function () {
                            winAdminMaterias.hide();
                        }
                    }]
            }]
    });
});

function showWinMaterias() {
    if (!winAdminMaterias) {
        winAdminMaterias = Ext.create('Ext.window.Window', {
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
                        gridAdminMateria,
                        formAdminMateria
                    ]
                }]
        });
    }
    onResetMateria();
    winAdminMaterias.show();

}

function setActiveRecordMateria(record) {
    formAdminMateria.activeRecord = record;
    if (record) {
        formAdminMateria.down('#update').enable();

        formAdminMateria.down('#create').disable();
        formAdminMateria.getForm().loadRecord(record);

    } else {
        formAdminMateria.down('#update').disable();

        formAdminMateria.getForm().reset();
    }
}

function onUpdateMateria() {
    var active = formAdminMateria.activeRecord,
            form = formAdminMateria.getForm();
//    formAdminUser.down('#create').enable();

    if (!active) {
        return;
    }
    if (form.isValid()) {
        var bandera = true;


        if (bandera === true) {
            form.updateRecord(active);
            onResetMateria();
        } else {
            Ext.example.msg('Mensaje', 'Ingrese los datos correctamente');
        }
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente');

    }
}

function onCreateMateria() {
    var form = formAdminMateria.getForm();

    if (form.isValid()) {
        bandera = true;



        if (bandera === true) {
            formAdminMateria.fireEvent('create', formAdminMateria, form.getValues());
            formAdminMateria.down('#update').disable();
            form.reset();
        } else {
            Ext.example.msg('Mensaje', 'Ingrese los datos correctamente');
        }
    } else {
        Ext.example.msg("Alerta", 'Llenar los campos marcados en rojo, correctamente');

    }
}

function onResetMateria() {
    formAdminMateria.getForm().reset();
    gridAdminMateria.getView().deselect(gridAdminMateria.getSelection());
    formAdminMateria.down('#create').enable();
}

function onDeleteMateria() {
    Ext.MessageBox.confirm('Atención!', 'Desea eliminar la materia', function (choice) {
        if (choice === 'yes') {
            estado = 1;
            var selection = gridAdminMateria.getView().getSelectionModel().getSelection()[0];
            if (selection) {
                gridAdminMateria.store.remove(selection);
                formAdminMateria.down('#update').disable();

                formAdminMateria.down('#create').enable();
            }
        }
    });
}