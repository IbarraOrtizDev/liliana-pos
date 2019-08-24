const { ipcRenderer} = require('electron'),
path = require('path'),
mysql = require('mysql'),
datos = require(path.join(__dirname, '../json/init.json'));

var connect = null;

function activeCreateUser(){
    ipcRenderer.send('crear-user-empresa')
}
function buscar(){
    connect.query('SELECT * FROM cliente_prov', (err, successful)=>{
        if(err){
            console.log(err)
        }else{
            listar(successful)
        }
    })
}
function conectar() {
    connect = mysql.createConnection(datos.creado)
    connect.connect((err) => {
        if (err) {
            console.log(err)
        }else{
            buscar()
        }
    })
}
function listar(successful){
    let cuerpo = document.querySelector('#cuerpo-tabla');

    cuerpo.innerHTML = '';
    
    successful.forEach(element=>{
        cuerpo.innerHTML+=`<tr>
        <td>${element.doc}</td>
        <td>${element.name}</td>
        <td>${element.telefono}</td>
        <td>${element.direccion}</td>
        <td>${element.type == 1 ? "Cliente" : element.type == 2 ? "Proveedor" : "Cliente y proveedor"}</td>
    </tr>`
    })
}

ipcRenderer.on('client-prov-successful', function(){
    buscar()
})
conectar()