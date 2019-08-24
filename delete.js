'use strict'
const { app, ipcMain,  BrowserWindow } = require('electron'),
    path = require('path')

var ventana = null;
if (process.env.NODE_ENV != 'production') {
    require('electron-reload')(__dirname, {
        electron: path.join(__dirname, '/node_modules', '.bin', 'electron')
    })
}

function init() {
    ventana = new BrowserWindow({
        webPreferences: { nodeIntegration: true }
    })
    ventana.loadURL(url.format({
        pathname: path.join(__dirname, '/src/html/index.html'),
        protocol: 'file',
        slashes: true
    }))
    ventana.on('close', function () {
        app.quit()
    })

}
/*class Manejo extends electron{
    constructor() {
        //super()
        if (process.env.NODE_ENV != 'production') {
            require('electron-reload')(__dirname, {
                electron: path.join(__dirname, '/node_modules', '.bin', 'electron')
            })
        }
    }
    static initVentanaPrincipal() {
        this.ventana = new BrowserWindow({
            width: this.width,
            height: this.height,
            webPreferences: { nodeIntegration: true }
        })
        this.ventana.loadURL(url.format({
            pathname: path.join(__dirname, '/src/html/index.html'),
            protocol: 'file',
            slashes: true
        }))
        this.ventana.on('close', function () {
            app.quit()
        })
        console.log(this)
    }
    editProduct() {
        this.ventanaProducto = new BrowserWindow({
            top: this.ventana,
            width: 300,
            height: 400,
            webPreferences: { nodeIntegration: true }
        })
        //this.ventanaProducto.loadFile(url.format({
        //    pathname:path.join(__dirname, '/src/html/editProduct.html'),
        //    protocol:'file',
        //    slashes:true
        //}))
        this.ventanaProducto.loadURL('https://github.com')
    }

}*/
app.on('ready', init())