const { ipcRenderer } = require('electron'),
    mysql = require('mysql'),
    path = require('path'),
    datos = require(path.join(__dirname, '../json/init.json'));

var connect;
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
                    listar(successful)
                }
            })
        }
    })
}
function listar(dat){
    let a = document.getElementById('cuerpo-tabla')
    a.innerHTML=''
    dat.forEach(element => {
        a.innerHTML+=`<tr>
        <td>${element.id_kardex}</td>
        <td>${new Date(element.fecha).toLocaleDateString()}</td>
        <td>${element.type_mov}</td>
        <td>${element.user_id}</td>
        <td><div class="btn-small"><i class="material-icons">remove_red_eye</i></div></td>
    </tr>`
    });
}
conectar()