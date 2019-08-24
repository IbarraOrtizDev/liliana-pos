const {ipcRenderer} = require('electron'),
mysql = require('mysql'),
path = require('path'),
datos = require(path.join(__dirname, '../json/init.json'))

function crearUser(){
    ipcRenderer.send('crear-user')
}
function ingresar(){
    let connect = mysql.createConnection(datos.creado)
    connect.connect((err)=>{
        if(err){
            console.log(err)
        }else{
            let cedula = document.querySelector('#cedula').value,
            password = document.querySelector('#password').value;
            connect.query(`SELECT user_id FROM usuario WHERE cedula=${cedula} AND password="${password}"`, (error, successful)=>{
                if(error){
                    console.log(err)
                }else{
                    if(successful.length > 0){
                        ipcRenderer.send('page-principal', successful[0].user_id)
                    }
                }
            })
        }
    })
}