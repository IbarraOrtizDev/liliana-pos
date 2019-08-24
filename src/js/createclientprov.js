const { ipcRenderer } = require('electron'),
    path = require('path'),
    mysql = require('mysql'),
    datos = require(path.join(__dirname, '../json/init.json'));

var connect = null
function buscarDatDom() {
    let nombre = $('#nombre').value,
        nit = $('#nit').value,
        dir = $('#dir').value,
        cliente = $('#cliente').checked,
        provedor = $('#provedor').checked,
        telefono = $('#telefono').value,
        tipoUser = null;
    if (cliente && provedor) {
        tipoUser = 3
        //ambos
    } else if (cliente) {
        tipoUser = 2
        //provedor
    } else {
        tipoUser = 1
        //cliente
    }
    connect.query(`INSERT INTO cliente_prov(type, name, doc, direccion, telefono) VALUES(${tipoUser}, "${nombre}", "${nit}", "${dir}", "${telefono}" )`, (err) => {
        if (err) {
            console.log(err)
        } else {
            ipcRenderer.send('client-prov-create')
            $('#nombre').value = ""
            $('#nit').value = ""
            $('#dir').value = ""
            $('#telefono').value = ""

        }
    })
}
function conectar() {
    connect = mysql.createConnection(datos.creado)
    connect.connect((err) => {
        if (err) {
            console.log(err)
        }
    })
}
function $(param) {
    return document.querySelector(param)
}
conectar()