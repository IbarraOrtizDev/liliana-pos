const mysql = require('mysql'),
    path = require('path'),
    datos = require(path.join(__dirname, '../json/init.json'));

var connect,
factura = location.search.split('=')[1];


function coneccion() {
    connect = mysql.createConnection(datos.creado);
    connect.connect((err) => {
        if (err) {
            console.log(err)
        } else {
            connect.query('SELECT * FROM company', (err, successful) => {
                if (err) {
                    console.log(err)
                } else {
                    sessionStorage.setItem('company', JSON.stringify(successful[0]))
                    document.querySelector('img').src = successful[0].pathLogo
                    buscarDetalle()
                    buscar()
                }
            })
        }
    })
}
function buscarDetalle(){
    connect.query(`SELECT f.*, p.name FROM detalle_fact f INNER JOIN productos p ON p.id_productos = f.id_producto WHERE id_factura=${factura}`, (err, successful)=>{
        if(err){
            console.log(err)
        }else{
            let a = $('cuerpo-tabla')
            a.innerHTML=''
            successful.forEach(element => {
                a.innerHTML+=`<tr>
                <td>${element.name}</td>
                <td>${element.cantidad}</td>
                <td>${element.valor}</td>
                <td>${element.valor*element.cantidad}</td>
              </tr>`
            });
        }
    })
}
function buscar(){
    connect.query(`SELECT * FROM factura WHERE id_factura=${factura}`, (err, successful)=>{
        if(err){
            console.log(err)
        }else{
            $('fecha').innerHTML=new Date(successful[0].fecha).toLocaleDateString()
            $('factura').innerHTML=successful[0].id_factura
            $('total').innerHTML=successful[0].total
            $('pago').innerHTML=successful[0].pago
            $('cambio').innerHTML=successful[0].pago-successful[0].total
            $('comentario').innerHTML=successful[0].comentario
        }
    })
}
function $(param){
    return document.getElementById(param)
}
coneccion()