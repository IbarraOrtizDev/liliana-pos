const { ipcRenderer } = require('electron'),
    mysql = require('mysql'),
    path = require('path'),
    datos = require(path.join(__dirname, '../json/init.json'))


var connect,
    arrayListAdd = [],
    usuario;

ipcRenderer.send('pedir-user')
ipcRenderer.on('recibir-user', function(dat,arg){
    usuario = arg
})
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
            $('#costo').value = datoTrd.costo;
            $('#cantidad').focus()
            $('#list-add').innerHTML = ''
        }
    })
}
function agregarList() {
    connect.query('SELECT * FROM productos WHERE codigo="' + $('#codigo').value + '"', (err, successful) => {
        if (err) {
            console.log(err)
        } else {
            console.log(
                successful[0]
            )
            arrayListAdd.push({
                codigo: $('#codigo').value,
                nombre: $('#nombre').value,
                cantidad: $('#cantidad').value,
                costo: $('#costo').value,
                id_producto:successful[0].id_productos
            })
            $('#codigo').value = ""
            $('#nombre').value = ""
            $('#cantidad').value = ""
            $('#costo').value = ""
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
        <td>${element.costo}</td>
        <td>${element.costo * element.cantidad}</td>
      </tr>`
    })
}
function anexar() {
    if ($('#mov').value !== "" && arrayListAdd.length > 0) {
        let fecha = Date.parse(new Date())
        connect.query(`INSERT INTO kardex(fecha, type_mov, user_id, comentario) VALUES(${fecha}, "${$('#mov').value}", ${usuario}, "${$('#comentario').value}")`, (err, successful)=>{
            if(err){
                console.log(err)
                alert('Lo sentimos, hubo un error al ingresar la información')
            }else{

                $('#comentario').value=""
                arrayListAdd.forEach((element, index) =>{
                    
                    connect.query(`INSERT INTO detalle_kardex(id_kardex, id_producto, cant, valor) VALUES(${successful.insertId}, ${element.id_producto}, ${element.cantidad}, ${element.costo})`, (error)=>{
                        if(error){
                            console.log(error)
                        }else{
                            if($('#mov').value.split('')[0] == "E"){
                                connect.query(`UPDATE productos SET cant=cant+${element.cantidad} WHERE id_productos=${element.id_producto}`, (malo)=>{
                                    if(malo){
                                        console.log(malo)
                                    }
                                })
                            }else{
                                connect.query(`UPDATE productos SET cant=cant-${element.cantidad} WHERE id_productos=${element.id_producto}`, (malo)=>{
                                    if(malo){
                                        console.log(malo)
                                    }
                                })
                            }
                            arrayListAdd.splice(index, 1)
                            listar()
                        }
                    })
                })
            }
        })
    } else {
        alert('Debes completar la información requerida')
    }
}
function eliminar(dat) {
    arrayListAdd.splice(dat, 1)
    listar()
}
function $(param) {
    return document.querySelector(param)
}
function conectar() {
    connect = mysql.createConnection(datos.creado)
    connect.connect((err) => {
        if (err) {
            console.log(err)
        }
    })
}
conectar()