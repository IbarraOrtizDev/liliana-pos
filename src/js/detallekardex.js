const mysql = require('mysql'),
    path = require('path'),
    datos = require(path.join(__dirname, '../json/init.json'));


var connect,
search = location.search.substring(1).split('='),
principal = {
    init:null,
    seg:null
}
function coneccion() {
    connect = mysql.createConnection(datos.creado);
    connect.connect((err) => {
        if (err) {
            console.log(err)
        } else {
            if(search[0] == "factura"){
                buscarFact()
            }else{
                buscarKardex()
            }
        }
    })
}
function buscarFact(){
    connect.query(`SELECT * FROM factura WHERE id_factura = ${search[1]}`, (err, successful)=>{
        if(err){
            console.log(err)
        }else{
            principal.init = successful[0]
            connect.query(`SELECT f.*, p.name FROM detalle_fact f INNER JOIN productos p ON p.id_productos = f.id_producto WHERE id_factura = ${search[1]}`, (error, bien)=>{
                if(error){
                    console.log(error)
                }else{
                    principal.seg = bien
                    organizar()
                }
            })
        }
    })
}
function buscarKardex(){
    connect.query(`SELECT * FROM kardex WHERE id_kardex = ${search[1]}`, (err, successful)=>{
        if(err){
            console.log(err)
        }else{
            principal.init = successful[0]
            connect.query(`SELECT f.*, p.name FROM detalle_kardex f INNER JOIN productos p ON p.id_productos = f.id_producto WHERE f.id_kardex = ${search[1]}`, (error, bien)=>{
                if(error){
                    console.log(error)
                }else{
                    principal.seg = bien
                    organizar()
                }
            })
        }
    })
}
function organizar(){
    var movimiento;
    switch (principal.init.type_mov){
        case "SPV":
            movimiento = "Salida por venta"
            break
        case "EPC":
            movimiento = "Entrada por compra"
            break
        case "EPA":
            movimiento = "Entrada por ajuste"
            break
        case "SPM":
            movimiento = "Salida por mal estado"
            break
        case "EO":
            movimiento = "Otra entrada"
            break
        default :
            movimiento = "Movimiento sin definir"
    }
    $('fecha').innerHTML = new Date(principal.init.fecha).toLocaleDateString()
    $('type_mov').innerHTML = movimiento
    $('mov').innerHTML=search[1]
    $('cuerpo-tabla').innerHTML=''
    principal.seg.forEach(element => {
        $('cuerpo-tabla').innerHTML+=`<tr>
        <td>${element.name}</td>
        <td>${principal.init.type_mov == "SPV" ? element.cantidad : element.cant}</td>
        <td>${element.valor}</td>
      </tr>`
    });
}

function $(param){
    return document.getElementById(param)
}
coneccion()