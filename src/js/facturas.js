const { ipcRenderer } = require('electron'),
    mysql = require('mysql'),
    path = require('path'),
    datos = require(path.join(__dirname, '../json/init.json'));

function coneccion() {
    connect = mysql.createConnection(datos.creado);
    connect.connect((err) => {
        if (err) {
            console.log(err)
        } else {
            getFatc()
        }
    })
}
function getFatc(){
    connect.query('SELECT f.*, c.name FROM factura f INNER JOIN cliente_prov c ON c.id = f.cliente', (err, successful) => {
        if (err) {
            console.log(err)
        } else {
           listar(successful)
        }
    })
}

function listar(dat){
    let b = document.getElementById('cuerpo-tabla')
    b.innerHTML='';
    dat.forEach(a => {
        b.innerHTML+=`<tr class="${a.estado == "anulado" ? 'red' : ''}">
        <td>${a.id_factura}</td>
        <td>${new Date(a.fecha).toLocaleDateString()}</td>
        <td>${a.name}</td>
        <td>${a.estado}</td>
        <td>${a.form_pago}</td>
        <td>${a.total}</td>
        <td>
            <select  onchange="anular(event)" id="${a.id_factura}">
            <option value="" disabled selected >Anular</option>
                <option value="anulado" >Completar</option>
                <option value="pagado" >Cancelar</option>            
            </select>
        </td>
        <td><a href="../html/facturasDetalle.html?factura=${a.id_factura}" class="btn-small"><i class="material-icons">remove_red_eye</i></a></td>
    </tr>`
    });
    
}
function anular(event){
    connect.query(`UPDATE factura SET estado="${event.target.value}" where id_factura=${event.target.id}`, (err, successful)=>{
        if(err){
            console.log(err)
        }else{
            if(event.target.value == "anulado"){
                alert('Factura anulada')
            }else{
                alert('Anulación cancelada')
            }
            getFatc()
        }
    })
}
coneccion()