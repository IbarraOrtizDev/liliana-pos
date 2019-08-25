const { ipcRenderer } = require('electron'),
    mysql = require('mysql'),
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
        }else{
            connect.query(`SELECT * FROM kardex`, (err, successful)=>{
                if(err){
                    console.log(err)
                }else{
                    dat = successful
                    buscarFact()
                }
            })
        }
    })
}
function buscarFact(){
    connect.query(`SELECT * FROM factura`, (err, successful)=>{
        if(err){
            console.log(err)
        }else{
            dat2 = dat.concat(successful)
            ordenar()
        }
    })
}
function ordenar(){
    listar(dat2.sort((element1, element2)=>{
        return element1.fecha - element2.fecha
    }))
}
function listar(dat){
    let a = document.getElementById('cuerpo-tabla')
    a.innerHTML=''
    dat.forEach(element => {
        let numero = element.type_mov == "SPV" ? element.id_factura : element.id_kardex
        a.innerHTML+=`<tr>
        <td>${numero}</td>
        <td>${new Date(element.fecha).toLocaleDateString()}</td>
        <td>${element.type_mov}</td>
        <td>${element.user_id}</td>
        <td><a class="btn-small" href="./detallekardex.html?${element.type_mov == "SPV" ? "factura" : "movimiento"}=${numero}"><i class="material-icons" >remove_red_eye</i></a></td>
    </tr>`
    });
}
function ver(type, numero){
    if(type == "SPV"){
        window.location.href=path.join(__dirname, '../html/datallekardex.html')
    }else{
        window.location.href='../html/datallekardex.html'
    }
}
conectar()