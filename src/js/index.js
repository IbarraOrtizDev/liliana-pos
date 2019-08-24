const { ipcRenderer } = require('electron'),
    mysql = require('mysql'),
    path = require('path'),
    datos = require(path.join(__dirname, '../json/init.json'));


var connect;
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
                    document.getElementById('imagen-logo').src = successful[0].pathLogo
                    buscar()
                }
            })
        }
    })
}
function buscar() {
    connect.query('SELECT * FROM productos', (err, successful) => {
        if (err) {
            console.log(err)
        } else {
            listarProduct(successful)
        }
    })
}
function agregar() {
    ipcRenderer.send('agregar-product')
}
function listarProduct(product) {
    let cuerpoTabla = document.getElementById('cuerpo-tabla');
    console.log(cuerpoTabla)
    cuerpoTabla.innerHTML = ''
    product.forEach(element => {
        cuerpoTabla.innerHTML += `<tr>
        <td>${element.codigo}</td>
        <td>${element.name}</td>
        <td>${element.cant}</td>
        <td>${element.medida}</td>
        <td>${ element.linea }</td>
        <td>${element.valor}</td>
        <td>
          <div class="btn-small">
            <i class="material-icons">border_color</i>
          </div>
        </td>
    </tr>`
    });
}
ipcRenderer.on('product-agregado', buscar)
coneccion()