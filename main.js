const {app, BrowserWindow, session} = require('electron')
const windowStateKeeper = require('electron-window-state');
const {colors} = require('colors');
const path = require('path');
const url = require('url');


console.log('Checking ready: ' + app.isReady());
let mainWindow, textEditor;

function createWindow (){
    
    let winState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800

    })

    let ses = session.defaultSession;
    let getCookies = () => {
    ses.cookies.get({}, (err, cookies) =>{

    })
}

    mainWindow = new BrowserWindow({
        width: winState.width,
        height: winState.height,
        x: winState.x,
        y: winState.y,
        minWidth: 500,
        minHeight: 400,
        //frame: false,
       // titleBarStyle: 'hidden',
      //  autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
             webviewTag: true,
            partition: 'SkyNet',},
        
        //show: false
    })
    
    //let session = mainWindow.webContents.session;
    winState.manage(mainWindow);
    mainWindow.loadFile('src/index.html');
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


console.log('Checking ready: ' + app.isReady());


