
const {app, BrowserWindow} = require('electron')
const {colors} = require('colors')
const path = require('path');
const url = require('url');


console.log('Checking ready: ' + app.isReady());
let mainWindow, textEditor;

function createWindow (){
    mainWindow = new BrowserWindow({
        width: 1000,
        height: 800,
        minWidth: 500,
        minHeight: 400,
        //frame: false,
       // titleBarStyle: 'hidden',
      //  autoHideMenuBar: true,
        webPreferences: {nodeIntegration: true, webviewTag: true},
        
        //show: false
    })

  /*  
*/
/*
    mainWindow.loadURL(url.format({
        pathname: path.join('index.html'),
        protocal: 'file:',
        slashes: true
    }))*//*
secondaryWindow = new BrowserWindow({
        width: mainWindow.width,
        height: 700,
        webPreferences: {nodeIntegration: true},
        parent: mainWindow,
        modal: false,
        show: true,
        resizable: wi,
        movable: false,
        frame: false,
        skipTaskbar: true,
        closable: false,
        bottom: 0
        
    })*/
    mainWindow.loadFile('index.html');
    //secondaryWindow.loadFile('secondary.html')

    //mainWindow.webContents.openDevTools();


  // mainWindow.once('ready-to-show', mainWindow.show )



    mainWindow.on('closed', ()=> {
        mainWindow = null
    })
   /* secondaryWindow.on('closed', ()=> {
        secondarywindow = null
    })*/
}

app.on('before-quit', e => {
    console.app("Preventing app from quitting.")
    e.preventDefault()
    storeUserData()
    app.quit()
    
})

//lets you know if user is actively looking at another window.
//for testing.------------------------
/*
app.on('browser-window-blur', e =>{
    console.log('App unfocus')
    setTimeout(app.quit, 3000)
    })
//Lets you know if user is actively looking at window.
app.on('browser-window-focus', e =>{
    console.log('App focused')
})*/

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) createWindow()
})


console.log('Checking ready: ' + app.isReady())
