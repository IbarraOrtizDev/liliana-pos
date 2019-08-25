const mysql = require('mysql'),
    path = require('path'),
    datos = require(path.join(__dirname, '../json/init.json'));

var connect,
    dat,
    dat2;
function conectar() {
    connect = mysql.createConnection(datos.creado)
    connect.connect((err) => {
        if (err) {
            console.log(err)
        }
    })
}
function buscar() {
    let init = Date.parse(new Date($('init').value.split('-').join('/'))),
        end = Date.parse(new Date($('end').value.split('-').join('/'))) + 86399000
    console.log(init, end)
    connect.query(`SELECT d.cant, k.fecha, k.type_mov, p.name FROM detalle_kardex d INNER JOIN kardex k ON k.id_kardex = d.id_kardex INNER JOIN productos p ON p.id_productos = d.id_producto WHERE k.fecha>= ${init} AND k.fecha <= ${end}`, (err, successful) => {
        if (err) {
            console.log(err)
        } else {
            dat = successful
            buscarFact()
        }
    })
}
function buscarFact() {
    let init = Date.parse(new Date($('init').value.split('-').join('/'))),
        end = Date.parse(new Date($('end').value.split('-').join('/'))) + 86399000
    connect.query(`SELECT d.cantidad as cant, k.fecha, k.type_mov, p.name FROM detalle_fact d INNER JOIN factura k ON k.id_factura = d.id_factura INNER JOIN productos p ON p.id_productos = d.id_producto WHERE k.fecha>= ${init} AND k.fecha <= ${end}`, (err, successful) => {
        if (err) {
            console.log(err)
        } else {
            dat2 = dat.concat(successful)
            listar(dat2)
        }
    })
}
function listar(param) {
    $('cuerpo-tabla').innerHTML = ''
    param.forEach(item => {
        var movimiento;
        switch (item.type_mov) {
            case "SPV":
                movimiento = "Salida por venta"
                break
            case "EPC":
                movimiento = "Entrada por compra"
                break
            case "EPA":
                movimiento = "Entrada por ajuste"
                break
            case "SPM":
                movimiento = "Salida por mal estado"
                break
            case "EO":
                movimiento = "Otra entrada"
                break
            default:
                movimiento = "Movimiento sin definir"
        }
        $('cuerpo-tabla').innerHTML += `<tr>
        <td>${new Date(item.fecha).toLocaleString()}</td>
        <td>${movimiento}</td>
        <td>${item.name}</td>
        <td>${item.cant}</td>
    </tr>`
    })
}
function $(param) {
    return document.getElementById(param)
}
conectar()