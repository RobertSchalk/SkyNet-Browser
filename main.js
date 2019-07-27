const { app, BrowserWindow } = require('electron')
const colors = require('colors')
const bcrypt = require('bcrypt')
bcrypt.hash('myPlaintextPassword', 10, function(err, hash) {
   console.log(colors.red(hash))
})



function createWindow () {

    console.log(colors.green('Creating Window!'))

    let mainWindow = new BrowserWindow({
    width: 1000,
    height: 800,
    webPreferences:{
        nodeIntegration: true
    }
})

mainWindow.loadFile('index.html')

mainWindow.webContents.openDevTools()

mainWindow.on('closed', () => {
    mainWindow = null

})

}

app.on('ready', () => {
    console.log('App is ready.')
    createWindow()
})

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin'){
        app.quit()
    }
})

app.on('activate', () => {
   if(MainWindow === null) {
        createWindow()
    }
})