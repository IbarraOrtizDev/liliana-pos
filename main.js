'use strict'
const { app, ipcMain, BrowserWindow, Menu} = require('electron'),
    path = require('path'),
    mysql = require('mysql'),
    datos = require(path.join(__dirname, '/src/json/init.json')),
    createTable = require(path.join(__dirname, '/src/json/createTable.json')),
    url = require('url')

var ventana = null,
ventanaCreateCompany = null,
ventanaCreateUser = null,
ventanaEntryUser = null,
    connect,
    usuario;

if (process.env.NODE_ENV !== 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '../node_modules', '.bin', 'electron')
    })
}

function ventanaPrincipal() {
    ventana = new BrowserWindow({
        webPreferences: { nodeIntegration: true }
    });
    ventana.loadURL(url.format({
        pathname:path.join(__dirname, '/src/html/index.html'),
        protocol:'file',
        slashes:true
    }))
    ventana.on('close', ()=> app.quit())
}
function coneccion() {
    connect = mysql.createConnection(datos.creado);
    connect.connect((err) => {
        if (err && err.sqlState == 42000) {
            createDatabase()
        } else {
            connect.query('SELECT * FROM company', (error, successful) => {
                if (error) {
                    createTable.tables.forEach(element => {
                        connect.query(element, fallo => {
                            if (fallo) {
                                console.log(fallo)
                            }
                        })
                    });
                    crearCompany()
                } else {
                    if (successful.length > 0) {
                        entradaUser()
                    } else {
                        crearCompany()
                    }
                }
            })
        }
    })
}
function crearCompany(){
    ventanaCreateCompany = new BrowserWindow({
        width: 350,
        height: 570,
        resizable:false,
        title:'Crear empresa',
        webPreferences: { nodeIntegration: true }
    });
    ventanaCreateCompany.loadURL(url.format({
        pathname:path.join(__dirname, '/src/html/createCompany.html'),
        protocol:'file',
        slashes:true
    }))
    ventanaCreateCompany.setMenuBarVisibility(false)
}
function entradaUser(){
    ventanaEntryUser = new BrowserWindow({
        width: 350,
        height: 450,
        resizable:false,
        title:'Iniciar sección',
        webPreferences: { nodeIntegration: true }
    });
    ventanaEntryUser.loadURL(url.format({
        pathname:path.join(__dirname, '/src/html/entryUser.html'),
        protocol:'file',
        slashes:true
    }))
    ventanaEntryUser.setMenuBarVisibility(false)
}
function newUser(){
    ventanaCreateUser = new BrowserWindow({
        width: 350,
        height: 480,
        title:'Crear usuario',
        webPreferences: { nodeIntegration: true },
        resizable:false
    });
    ventanaCreateUser.loadURL(url.format({
        pathname:path.join(__dirname, '/src/html/createUser.html'),
        protocol:'file',
        slashes:true
    }))
    ventanaCreateUser.setMenuBarVisibility(false)
}
function segundario(pathName, content){
    let ventanaNew = new BrowserWindow(content);
    ventanaNew.loadURL(url.format({
        pathname:path.join(__dirname, pathName),
        protocol:'file',
        slashes:true
    }))   
    ventanaNew.setMenuBarVisibility(false)
}
function createDatabase() {
    let connect2 = mysql.createConnection(datos.pendiente);
    connect2.connect(err => {
        if (err) {
            console.log(err)
        } else {
            connect2.query('CREATE DATABASE nitvel_pos', error => {
                if (error) {
                    console.log(error)
                } else {
                    connect2.end()
                    coneccion()
                }
            })
        }
    })
}

ipcMain.on('crear-user-completed', function () {
    entradaUser()
    ventanaCreateUser.close()
})
ipcMain.on('crear-user', function () {
    newUser()
    if(ventanaCreateCompany !== null ){
        ventanaCreateCompany.close()
    }
    if(ventanaEntryUser !== null){
        ventanaEntryUser.close()
    }
})
ipcMain.on('page-principal', (user, arg)=>{
    usuario = arg;
    ventanaPrincipal()
    ventanaEntryUser.close()
})
ipcMain.on('agregar-product',()=> {
    segundario('/src/html/addProduct.html', {
        parent:ventana,
        width: 350,
        height: 480,
        resizable:false,
        title:'Agregar producto',
        webPreferences: { nodeIntegration: true }
    })
})
ipcMain.on('agrego-product', function(){
    ventana.webContents.send('product-agregado')
})
ipcMain.on('pedir-user', function(){
    console.log(usuario)
    ventana.webContents.send('recibir-user', usuario)
})
ipcMain.on('crear-user-empresa', ()=>{
    segundario('/src/html/createclientprov.html', {
        parent:ventana,
        width: 350,
        height: 600,
        title:'Crear cliente o proveedor',
        resizable:false,
        webPreferences: { nodeIntegration: true }
    })
 })
ipcMain.on('client-prov-create', ()=>{
    ventana.webContents.send('client-prov-successful')
})
app.on('ready', function(){
    coneccion();
    const mainMenu = Menu.buildFromTemplate(templateMenu)
    Menu.setApplicationMenu(mainMenu)
})
const templateMenu  = [
    {
        label:'File',
        submenu:[
            {
                label:'Facturas',
                accelerator:'Ctrl+F',
                click(){
                    segundario('/src/html/facturas.html', {
                        parent:ventana,
                        width: 800,
                        height: 600,
                        title:'Facturas',
                        webPreferences: { nodeIntegration: true }
                    })
                }
            },
            {
                label:'Nueva factura',
                accelerator:'Ctrl+N',
                click(){
                    segundario('/src/html/facturasCreate.html', {
                        parent:ventana,
                        width: 800,
                        height: 600,
                        title:'Nueva factura',
                        webPreferences: { nodeIntegration: true }
                    })
                }
            },
            {
                label:'Salir',
                accelerator: process.platform == 'darwin' ? 'command+Q' : 'Ctrl+Q',
                click(){
                    app.quit()
                }
            }
        ]
    },
    {
        label:'Reportes',
        submenu:[
            {
                label:'Reporte movimiento',
                accelerator:'Ctrl+M',
                click(){
                    segundario('/src/html/reportemov.html', {
                        parent:ventana,
                        title:'Reporte movimiento de inventario',
                        webPreferences: { nodeIntegration: true }
                    })
                }
            },
            {
                label:'Reporte ventas',
                accelerator: 'Ctrl+V',
                click(){
                    segundario('/src/html/reporteVentas.html', {
                        title:'Reporte de ventas',
                        parent:ventana,
                        webPreferences: { nodeIntegration: true }
                    })
                }
            }
        ]
    }
]
/*if(process.env.NODE_ENV !== "production"){
    templateMenu.push({
        label:'DevTools',
        submenu:[
            {
                label:'Toggle',
                click(item, focusedWindow){
                    focusedWindow.toggleDevTools()
                }
            }

        ]
    })
}*/