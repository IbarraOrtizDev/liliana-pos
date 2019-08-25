const fse = require('fs-extra'),
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
    newNameImage = path.win32.join(__dirname, '../../../../files/'+Date.parse(new Date())+'.'+tipoImagen)
}

function crear(event){
    let connec = mysql.createConnection(datos.creado),
    imagen =newNameImage.split(path.sep).join('/')
    connec.connect((err)=>{
        if(err){
            console.log(err)
        }else{
            fse.copy(rutaImagen, newNameImage, (error)=>{
                if(error){
                    document.getElementById('prueba').innerHTML=error
                }else{
                    let nit = $('#nit').value,
                    nombre = $('#nombre').value,
                    direccion = $('#dir').value,
                    telefono = $('#telefono').value;

                    connec.query(`INSERT INTO company VALUES(${nit}, "${nombre}", "${direccion}", "${telefono}", "${imagen}")`,(fallo, successful)=>{
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