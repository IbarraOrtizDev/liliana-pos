const mysql = require('mysql'),
    path = require('path'),
    datos = require(path.join(__dirname, '../json/init.json'));

var connect;
function conectar() {
    connect = mysql.createConnection(datos.creado)
    connect.connect((err) => {
        if (err) {
            console.log(err)
        }
    })
}
function buscarFact() {
    let init = Date.parse(new Date($('init').value.split('-').join('/'))),
        end = Date.parse(new Date($('end').value.split('-').join('/'))) + 86399000
    connect.query(`SELECT d.*, k.fecha, k.type_mov, p.name FROM detalle_fact d INNER JOIN factura k ON k.id_factura = d.id_factura INNER JOIN productos p ON p.id_productos = d.id_producto WHERE k.fecha>= ${init} AND k.fecha <= ${end}`, (err, successful) => {
        if (err) {
            console.log(err)
        } else {
            listar(successful)
        }
    })
}
function listar(param) {
    $('cuerpo-tabla').innerHTML = ''
    param.forEach(item => {
        $('cuerpo-tabla').innerHTML += `<tr>
        <td>${new Date(item.fecha).toLocaleString()}</td>
        <td>${item.name}</td>
        <td>${item.cantidad}</td>
        <td>${item.valor}</td>
        <td>${item.valor*item.cantidad}</td>
    </tr>`
    })
}
function $(param) {
    return document.getElementById(param)
}
conectar()