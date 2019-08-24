const fs = require('fs'),
    mysql = require('mysql'),
    path = require('path'),
    datos = require(path.join(__dirname, '../json/init.json')),
    {ipcRenderer} = require('electron')


var rutaImagen,
tipoImagen,
newNameImage;

function logoOne(event){
    let image = event.target.files[0];
    rutaImagen = image.path;
    tipoImagen = image.type.split('/')[1];
    newNameImage = path.join(__dirname, '../../files/'+Date.parse(new Date())+'.'+tipoImagen)
}

function crear(event){
    let connec = mysql.createConnection(datos.creado)
    connec.connect((err)=>{
        if(err){
            console.log(err)
        }else{
            fs.copyFile(rutaImagen, newNameImage, (error)=>{
                if(error){
                    console.log(error)
                    console.log('no paso')
                }else{
                    let nit = $('#nit').value,
                    nombre = $('#nombre').value,
                    direccion = $('#dir').value,
                    telefono = $('#telefono').value;

                    connec.query(`INSERT INTO company VALUES(${nit}, "${nombre}", "${direccion}", "${telefono}", "${newNameImage}")`,(fallo, successful)=>{
                        if(fallo){
                            console.log(fallo)
                        }else{
                            ipcRenderer.send('crear-user')
                        }
                    })
                }
            })
        }
    })
}
function $(param){
    return document.querySelector(param)
}