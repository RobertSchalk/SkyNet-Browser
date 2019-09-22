const {app, BrowserWindow, session} = require('electron');
const windowStateKeeper = require('electron-window-state');
const path = require('path');
const fs = require('fs');
const Store = require('./store.js');



//console.log('Checking ready: ' + app.isReady());
let mainWindow;

    const store = new Store({
        configName: 'SkyNet-Configs',
        defaults: {
            windowBounds: { width: 1000, Height: 800}
        }
    });


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

    let {width, height} = store.get('windowBounds');

    mainWindow = new BrowserWindow({
        width: width,
        height: height,
        minWidth: 800,
        minHeight: 317,
        x: winState.x,
        y: winState.y,
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

    //Uncomment this for release ----------------------------------------
    mainWindow.setMenuBarVisibility(false);

  /*let cookie = {url:'https://myappdomain.com', name: 'cookie1', value:'electron', expirationDate: 1613852855}
  ses.cookies.set(cookie, err => {
      console.log('cookie1 set')
  })
    mainWindow.webContents.on('did-finish-load', e =>{
        getCookies();
    })*/

    mainWindow.on('resize', () => {
        let{ width, height} = mainWindow.getBounds();
        store.set('windowBounds', {width, height});
    });

    
    mainWindow.loadFile(path.join(__dirname, 'src/index.html'));

    mainWindow.on('closed', ()=> {
        mainWindow = null
    })
   
}

app.on('before-quit', e => {
    console.app("Preventing app from quitting.")
    e.preventDefault()
    storeUserData()
    app.quit()
    
});



app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if(process.platform !== 'darwin') app.quit()
})

app.on('activate', () => {
    if (mainWindow === null) createWindow()
});