const {app, BrowserWindow, session} = require('electron')
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const fs = require('fs');



//console.log('Checking ready: ' + app.isReady());
let mainWindow, textEditor;

function createWindow (){
    
    let winState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800

    })

    let ses = session.defaultSession;
   /* let getCookies = () => {
    ses.cookies.get({}, (err, cookies) =>{
        console.log(cookies);
    })
}*/

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
            partition: 'SkyNet'},
        
        
        //show: false
    })
    
    //let session = mainWindow.webContents.session;
    //Saves last state of window.
    winState.manage(mainWindow);
    mainWindow.loadFile('src/index.html');
    //mainWindow.setMenuBarVisibility(false);

  /*let cookie = {url:'https://myappdomain.com', name: 'cookie1', value:'electron', expirationDate: 1613852855}
  ses.cookies.set(cookie, err => {
      console.log('cookie1 set')
  })
    mainWindow.webContents.on('did-finish-load', e =>{
        getCookies();
    })*/

    

    mainWindow.on('closed', ()=> {
        mainWindow = null
    })
   
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



