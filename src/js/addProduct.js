const { ipcRenderer } = require('electron'),
    mysql = require('mysql'),
    path = require('path'),
    datos = require(path.join(__dirname, '../json/init.json'));


var connect;

function coneccion() {
    connect = mysql.createConnection(datos.creado);
    connect.connect((err) => {
        if (err) {
            console.log(err)
        } else {
            connect.query('SELECT * FROM company', (err) => {
                if (err) {
                    console.log(err)
                } else {
                    buscarLinea()
                }
            })
        }
    })
}
function buscarLinea() {
    connect.query('SELECT * FROM lineas', (err, successful) => {
        if (err) {
            console.log(err)
        } else {
            let seleccion = document.getElementById('linea')
            for (let h of successful) {
                seleccion.innerHTML += `<option value="${h.id_lineas}">${h.line}</option>`
            }
            M.AutoInit();
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, options);
        }
    })
}
function agregarProduct() {
    let nombre = $('#nombre').value,
        codigo = $('#codigo').value,
        costo = $('#costo').value,
        medida = $('#medida').value,
        linea = $('#linea').value,
        max = $('#max').value,
        min = $('#min').value,
        valor = $('#valor').value
    connect.query(`INSERT INTO productos(codigo, name,medida,costo,valor, linea,cant, cant_max, cant_min) VALUES("${codigo}", "${nombre}", "${medida}", ${costo}, ${valor},${linea}, 0 ,${max}, ${min})`, function (err, successful) {
        if (err) {
            alert('Ya existe un producto con el codigo '+codigo)
        } else {
            console.log(successful)
            nombre = $('#nombre').value="";
            codigo = $('#codigo').value="";
            costo = $('#costo').value="";
            medida = $('#medida').value="";
            linea = $('#linea').value="";
            max = $('#max').value="";
            min = $('#min').value="";
            valor = $('#valor').value="";
            ipcRenderer.send('agrego-product')
        }
    })
}
function $(param) {
    return document.querySelector(param)
}
coneccion()