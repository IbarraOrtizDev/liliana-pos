const  mysql = require('mysql'),
    path = require('path'),
    datos = require(path.join(__dirname, '../json/init.json'));


var connect;

function coneccion() {
    connect = mysql.createConnection(datos.creado);
    connect.connect((err) => {
        if (err) {
            console.log(err)
        } else {
            buscarLinea()
            getProduct()
        }
    }
    )
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
        }
    })
}

function getProduct(){
    connect.query(`SELECT * FROM productos WHERE id_productos=${location.search.split('=')[1]}`, (err, successful)=>{
        if(err){
            console.log(err)
        }else{
            let a = successful[0]
            nombre = $('#nombre').value = a.name;
            codigo = $('#codigo').value = a.codigo;
            costo = $('#costo').value = a.costo;
            medida = $('#medida').value = a.medida;
            linea = $('#linea').value = a.linea;
            max = $('#max').value = a.cant_max;
            min = $('#min').value = a.cant_min;
            valor = $('#valor').value = a.valor;

            M.AutoInit();
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, options);
        }
    })
}
function agregarProduct(){
    connect.query(`UPDATE productos SET codigo="${$('#codigo').value}", name="${$('#nombre').value}", medida="${$('#medida').value}", costo=${$('#costo').value}, valor=${$('#valor').value}, linea=${$('#linea').value}, cant_max=${$('#max').value}, cant_min=${$('#min').value} WHERE id_productos=${location.search.split('=')[1]}`, (err)=>{
        if(err){
            console.log(err)
        }else{
            window.history.back()
        }
    })
}
function $(param) {
    return document.querySelector(param)
}
coneccion()
M.AutoInit();
            var elems = document.querySelectorAll('select');
            var instances = M.FormSelect.init(elems, options);