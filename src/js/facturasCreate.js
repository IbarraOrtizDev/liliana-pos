const mysql = require('mysql'),
    path = require('path'),
    datos = require(path.join(__dirname, '../json/init.json'));

var connect,
    arrayListAdd = [];

function coneccion() {
    connect = mysql.createConnection(datos.creado);
    connect.connect((err) => {
        if (err) {
            console.log(err)
        } else {
            connect.query('SELECT * FROM cliente_prov WHERE type=1 OR type=3', (error, successful) => {
                if (error) {
                    console.log(error)
                } else {
                    console.log(successful)
                    successful.forEach(element => {
                        $('#cliente').innerHTML += `<option value="${element.id}">${element.name}</option>`
                    })
                    M.AutoInit()
                    document.addEventListener('DOMContentLoaded', function () {
                        var elems = document.querySelectorAll('select');
                        var instances = M.FormSelect.init(elems, options);
                    });
                }
            })
        }
    })
}
function presionoTecla(event) {
    let valor = event.target.value
    if (valor.length >= 2) {
        if (event.target.id == "codigo") {
            connect.query('SELECT name, codigo FROM productos WHERE codigo like "' + valor + '%"', (err, successful) => {
                if (err) {
                    console.log(err)
                } else {
                    agregar(successful)
                }
            })
        } else {
            connect.query('SELECT name, codigo FROM productos WHERE name like "' + valor + '%"', (err, successful) => {
                if (err) {
                    console.log(err)
                } else {
                    agregar(successful)
                }
            })
        }
    }
}
function agregar(dat) {
    $('#list-add').innerHTML = ''
    dat.forEach(element => {
        $('#list-add').innerHTML += `<div class="collection-item" title="${element.codigo}" onclick="seleccionado(event)">${element.name}</div>`
    })
}

function seleccionado(event) {
    connect.query('SELECT * FROM productos WHERE codigo="' + event.target.title + '"', (err, successful) => {
        if (err) {
            console.log(err)
        } else {
            let datoTrd = successful[0]
            $('#codigo').value = datoTrd.codigo;
            $('#nombre').value = datoTrd.name;
            $('#valor').value = datoTrd.costo;
            $('#cantidad').focus()
            $('#list-add').innerHTML = ''
        }
    })
}
function $(param) {
    return document.querySelector(param)
}

function agregarList() {
    connect.query('SELECT * FROM productos WHERE codigo="' + $('#codigo').value + '"', (err, successful) => {
        if (err) {
            console.log(err)
        } else {
            arrayListAdd.push({
                codigo: $('#codigo').value,
                nombre: $('#nombre').value,
                cantidad: $('#cantidad').value,
                valor: $('#valor').value,
                id_producto: successful[0].id_productos
            })
            $('#codigo').value = ""
            $('#nombre').value = ""
            $('#cantidad').value = ""
            $('#valor').value = ""
            $('#codigo').focus()
            listar()
        }
    })
}
function listar() {
    $('#cuerpo-tabla').innerHTML = ''
    arrayListAdd.forEach((element, index) => {
        $('#cuerpo-tabla').innerHTML += `<tr>
        <td><div class="btn-small" onclick="eliminar(${index})"><i class="material-icons">close</i></div></td>
        <td>${element.codigo}</td>
        <td>${element.nombre}</td>
        <td>${element.cantidad}</td>
        <td>${element.valor}</td>
        <td>${element.valor * element.cantidad}</td>
      </tr>`
    })
}
function eliminar(dat) {
    arrayListAdd.splice(dat, 1)
    listar()
}
function crearFact(){
    if(arrayListAdd.length > 0 && $('#cliente').value !== ""){
        /*let factPrinc = {
            cliente:$('#cliente').value,
            fecha:Date.parse(new Date()),
            estado:'pago',
            form_pago:'efectivo',
            commentario:$('#textarea1').value
        }*/
        $('#completar').classList.remove('oculto')
    }else{
        alert('Debes completar la información requerida')
    }
}
coneccion()