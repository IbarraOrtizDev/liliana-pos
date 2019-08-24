const {ipcRenderer} = require('electron'),
mysql = require('mysql'),
path = require('path'),
datos = require(path.join(__dirname, '../json/init.json'))

function crear(){
    let connect = mysql.createConnection(datos.creado)
    connect.connect(err=>{
        if(err){
            console.log(err)
        }else{
            let nombre = $('#name').value,
            cedula = $('#cedula').value,
            contrasena = $('#password').value;
            connect.query(`INSERT INTO usuario(cedula, nombre, password) VALUES(${cedula}, "${nombre}", "${contrasena}")`, (error, successful)=>{
                if(error){
                    console.log(error)
                }else{
                    ipcRenderer.send('crear-user-completed')
                }
            })
        }
    })
}
function $(param){
    return document.querySelector(param)
}
