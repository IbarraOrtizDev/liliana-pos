const { ipcRenderer } = require('electron'),
    mysql = require('mysql'),
    path = require('path'),
    datos = require(path.join(__dirname, '../json/init.json'));

var productos;
ipcRenderer.send('pedir-user')
ipcRenderer.on('recibir-user', function (dat, arg) {
    usuario = arg
    sessionStorage.setItem('user', arg)
})

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
            productos = successful
            listarProduct(successful)
        }
    })
}
function agregar() {
    ipcRenderer.send('agregar-product')
}
function listarProduct(product) {
    let cuerpoTabla = document.getElementById('cuerpo-tabla');
    cuerpoTabla.innerHTML = ''
    product.forEach(element => {
        cuerpoTabla.innerHTML += `<tr>
        <td>${element.codigo}</td>
        <td>${element.name}</td>
        <td>${element.cant}</td>
        <td>${element.medida}</td>
        <td>${ element.linea}</td>
        <td>${element.valor}</td>
        <td>
          <a href="./editProduct.html?edit=${element.id_productos}" class="btn-small">
            <i class="material-icons">border_color</i>
          </a>
        </td>
    </tr>`
    });
}
function reducir(event){
    if(event.target.value.length > 3){
        let a = productos.filter((item)=>{
            return item.name.toUpperCase().search(event.target.value.toUpperCase()) !== -1
        })
        listarProduct(a)
    }else{
        listarProduct(productos)
    }
}
ipcRenderer.on('product-agregado', buscar)
coneccion()