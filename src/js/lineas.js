const mysql = require('mysql'),
path = require('path'),
datos = require(path.join(__dirname, '../json/init.json'))

var connect;

function coneccion(){
    connect = mysql.createConnection(datos.creado);
    connect.connect((err)=>{
        if(err){
            console.log(err)
        }else{
            trearLineas()
        }
    })
}
function trearLineas(){
    connect.query('SELECT * FROM lineas', (err, successful)=>{
        if(err){
            console.log(err)
        }else{
            agregarDOM(successful)
        }
    })
}
function agregarDOM(lineas){
    let list = document.getElementById('list-line')
    list.innerHTML=''
    lineas.forEach(element => {
        list.innerHTML+=`<li class="collection-item">
        <span>${element.id_lineas} - </span> ${element.line}
        <!--<div class="secondary-content" onclick="editar(${element.id_lineas}, '${element.line}')">
            <i class="material-icons blue-text">edit</i>
        </div>-->
    </li>`
    });
}
function agregarLinea(){
    let linea = document.getElementById('linea');
    connect.query(`INSERT INTO lineas(line) VALUES("${linea.value}")`, err=>{
        if(err)
            console.log(err)
        else
            linea.value=""
            trearLineas()
    })
}
coneccion()
sessionStorage.setItem('foto', 'ruta')