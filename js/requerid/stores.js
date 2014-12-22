var storeRoles = Ext.create('Ext.data.JsonStore', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'rest',
        url: 'http://localhost:8080/tesisescuelarest/webresources/modelo.roles/listar',
        reader: {
            type: 'json',
            root: 'data'
        }
    },
    fields: [{name: 'id', type: 'int'}, {name: 'nombre', type: 'string'}]
});
var storeRolUserList = Ext.create('Ext.data.Store', {
    autoDestroy: true,
    autoLoad: true,
    proxy: {
        type: 'ajax',
        url: 'php/listFilters/listRolUser.php',
        reader: {
            type: 'array'
        }
    },
    fields: ['id', 'text']
});
var storeActiveUserList = Ext.create('Ext.data.Store', {
    data: [
        {id: 1, text: 'SI'},
        {id: 0, text: 'NO'}
    ],
    fields: [
        {name: 'id', type: 'int'},
        {name: 'text', type: 'string'}
    ]
});