const {electron, remote, ipcRenderer, BrowserWindow} = require('electron');
const windowStateKeeper = require('electron-window-state'); //Helps save the previous window state of the browser. 
const jsonfile = require('jsonfile'); // To allow the communication between the .json files.
const favicon = require('favicon-getter').default; // Helps retrieve favicons from other websites.
const path = require('path'); // Used for book marks. Joins a path and file location
const urlRegex = require('url-regex'); // checks a url and tells the browser what to do with it. It's a bit better than my original method.
const contextMenu = require('electron-context-menu'); // This is needed for the right-click menus.
const dragula = require("dragula"); // This helps drag tabs around. (Not implemented yet).
const uuid= require("uuid"); // Helps create ids for bookmarks.
//const Navigation = require("./Navigation.js/index.js");
const Bookmark = require("./bookmarks.js");
const Theme = require("../themes.js")
var $ = require('jquery'); //allows jquery to be used
var Color = require('color.js'); // Currently helps color the tab icons



var globalCloseablskyOverride;
//this is so I don't have to write "getElementById" so many times.
var ById = function (id) {
    return document.getElementById(id);
}
var bookmarks = path.join(__dirname, '../data/bookmarks.json'); // setting bookmarks to the file pathway.
//var themes = path.join(__dirname, 'themes.json');// setting bookmarks to the file pathway.
var history = path.join(__dirname, '../data/history.json');

//declaring all of my elements that I need the most here.
var omni = ById('url'),
devConsole = ById('console'),
fave = ById('fave'),
list = ById('list'),
popup = ById('sky-popup'),
closeExtras = ById('closeExtras'),
favorites = ById('favorites'),
settings = ById('settings'),
skyWrite = ById('skyWrite'),
print = ById('print'),
newWindow = ById('newWindow'),
zoom = ById('zoom'),
currentTheme = ById('Theme'),
menu = document.getElementsByClassName('menu'),
newWindow = ById('newWindow');

//Gets the active theme for the browser.
// function GetTheme(){
//     var head = ById('head')
//     var _head = document.getElementsByTagName('head');
//     jsonfile.readFile(themes, function(err, obj){
    
//     for(var i = 0; i < obj.length; i++){
//         let id = obj[i].id;
//         let title = obj[i].title;
//         let active = obj[i].active;
//         let css = obj[i].css
//         theme = new Theme(id, title, active, css);
//         if(active === 'true'){
//             let el = theme.Apply();
//             if(currentTheme){
//             currentTheme.remove();
//             _head[0].appendChild(el);
//             } else{
//                 _head[0].appendChild(el);
//             }
//         }
//     }
//     console.log("Theme function ran.");
// });
// }

// GetTheme();

//magnifies the current webview.
function Zoom(){
    let  webview = $('.sky-view.active')[0];
    
    if(webview.getZoomFactor() == "null"){
        webview.setZoomFactor(1)
    }

    if(webview.getZoomFactor() == 1){
        webview.setZoomFactor(2)
    } else if (webview.getZoomFactor() == 2){
        webview.setZoomFactor(3)
    } else {
        webview.setZoomFactor(1)
    }
}

      
//////////////////////////////////////////////////////////////////////////////////////////////

//handles bookmarks

//This adds the bookmark information to Bookmarks.json
function addBookmark () {
    let  url = $('.sky-view.active')[0].getURL(); //Retrieves the active view's url
    let title = webview.getTitle();
    favicon(url).then(function(fav) {
    let book = new Bookmark(uuid.v1(), url, fav, title);
        jsonfile.readFile(bookmarks, function(err, curr) {
            curr.push(book);
            jsonfile.writeFile(bookmarks, curr, function (err) {
            },2);
            let url = curr[curr.length-1].url;
            let icon = curr[curr.length-1].icon;
            let id = curr[curr.length-1].id;
            let title = curr[curr.length-1].title;
            let bookmark = new Bookmark(id, url, icon, title);
            let el = bookmark.ELEMENT();
            popup.appendChild(el);
        });
        
    });
}
//This controls the opening and closing of the Bookmarks screen.
//Favorites will slide up and down from the navigation bar.
function openPopUp (event) {
    //console.log('OpenPopUp');
    let state = popup.getAttribute('data-state');
    if (state === 'closed') {
        popup.innerHTML = '';
        jsonfile.readFile(bookmarks, function(err, obj) {
            if(obj.length !== 0) {
                for (var i = 0; i < obj.length; i++) {
                    let url = obj[i].url;
                    let icon = obj[i].icon;
                    let id = obj[i].id;
                    let title = obj[i].title;
                    let bookmark = new Bookmark(id, url, icon, title);
                    let el = bookmark.ELEMENT();
                    popup.appendChild(el);
                }
            }
                popup.style.height = 'calc(100vh - 58px)';
                popup.setAttribute('data-state', 'open');
        });
    } else {
        popup.style.height = '0px';
        popup.setAttribute('data-state', 'closed');
    }
    
    
}
//This handles the url transation from the bookmarks to omni.
//This is a very important function. Without it, the whole app will change.
function handleUrl (event) {
        popup.style.height = '0px';
        popup.setAttribute('data-state', 'closed');
    if (event.target.className === 'link') {
        event.preventDefault();
        webview.loadURL(event.target.href);
    } else if (event.target.className === 'favicon') {
        event.preventDefault();
        webview.loadURL(event.target.parentElement.href);
    }
}

//Space for favorites bar functions


//Controls the History.Json file.
function AddToHistory(){
    let  url = $('.sky-view.active')[0].getURL(); //Retrieves the active view's url
    let title = webview.getTitle();
    favicon(url).then(function(fav) {
    let book = new Bookmark(uuid.v1(), url, fav, title);
        jsonfile.readFile(history, function(err, curr) {
            curr.push(book);
            jsonfile.writeFile(bookmarks, curr, function (err) {
            },2);
            let url = curr[curr.length-1].url;
            let icon = curr[curr.length-1].icon;
            let id = curr[curr.length-1].id;
            let title = curr[curr.length-1].title;
            let bookmark = new Bookmark(id, url, icon, title);
            let el = bookmark.ELEMENT();
            popup.appendChild(el);
        });
        
    });
}



///////////////////////////////---   --- Extras ---   ---//////////////////////////////////////////////////////

//handles devtools for webview.
function handleDevtools () {
    ExtrasWindow();
    navigation.openDevTools();
}

//This controls the Extras overlay.
function ExtrasWindow() {
    var extrasWindow = ById("ExtrasWindow");

    if(extrasWindow.style.width == "calc(100vw)"){
        document.getElementById("ExtrasWindow").style.width = "0%";
    } else {
        document.getElementById("ExtrasWindow").style.width = "calc(100vw)";
    }

}

////////////////////////////////---   --- Extras ---   ---///////////////////////////////////////////////

//Creates the setting window when called on. Settings is currently handled in a different window.
function CreateSettingsView () {
        
    omni.blur();
   
navigation.newTab(path.join(__dirname, 'settings/Settings.html'), {
        
        
        node: true,
        webviewAttributes: {
            nodeIntegration: true,
            icon: 'clean',
            electron: true,
            devtools: false,
            openDevTools: false
        },
        readonlyUrl: false
});
    ExtrasWindow();
}

//Creates the SkyWrite Window. All extras will be opened in a new window for now.
//They will eventually be integrated into the browser window itself.
function CreateSkyWriteView () {

    omni.blur();
    
    let winState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800

    })

    //let skyWriteSession = session.fromPartition('skyWriteWindow')
    // const settingsPath = path.join('file://', _dirname, '../settings/settings.html')
     let skyWriteWindow = new BrowserWindow({
         width: winState.width,
          height: winState.height,
        minWidth: 700,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
             webviewTag: true,
              electron: true,
              path: true,
               }
               

        })

        skyWriteWindow.on('ready', function(){
            devtools = new BrowserWindow()
            window = new BrowserWindow({ x: 0, y: 0, width:800, height:600})
            window.loadURL(path.join('file://', __dirname, 'static/index.html'))
            window.setTitle('Texty')
            Menu.setApplicationMenu(Menu.buildFromTemplate([
                {
                    label: app.getName(),
                    submenu: [
                        {
                            label: `Hello`,
                            click: () => console.log("Hello world")
                        }
                    ]
                }
            ]))
        
        })


      //  let session = settingsWindow.webContents.session;
        winState.manage(skyWriteWindow);
     skyWriteWindow.on('close', function(){skyWriteWindow = null})
     skyWriteWindow.loadFile('src/SkyWrite.html');

     skyWriteWindow.show();
   
     ExtrasWindow();
}

function CreateNewWindow(){
    let winState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800

    })

    //let skyWriteSession = session.fromPartition('skyWriteWindow')
    // const settingsPath = path.join('file://', _dirname, '../settings/settings.html')
     let browserWindow = new BrowserWindow({
         width: winState.width,
          height: winState.height,
        minWidth: 700,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
             webviewTag: true,
              electron: true,
              path: true,
               }
        })
      //  let session = settingsWindow.webContents.session;
        winState.manage(browserWindow);
        browserWindow.on('close', function(){browserWindow = null})
        browserWindow.loadFile('src/Index.html');

        browserWindow.show();
   
     ExtrasWindow(); //Closes menu
}

function Print(){
    ExtrasWindow();
    navigation.printTab();
}


//event listeners
fave.addEventListener('click', addBookmark);
list.addEventListener('click', ExtrasWindow);
closeExtras.addEventListener('click', ExtrasWindow);
favorites.addEventListener('click', openPopUp);
popup.addEventListener('click', handleUrl);
devConsole.addEventListener('click', handleDevtools);
print.addEventListener('click', Print)
settings.addEventListener('click', CreateSettingsView);
skyWrite.addEventListener('click', CreateSkyWriteView);
zoom.addEventListener('click', Zoom);
newWindow.addEventListener('click', CreateNewWindow);
// window.addEventListener('resize', resizeButton)

// minimize.addEventListener('click', () =>{
//     remote.getCurrentWindow().minimize();
// });
// resize.addEventListener('click', () =>{
//     const currentWindow = remote.getCurrentWindow()
//     if(currentWindow.isMaximized()){
//         currentWindow.unmaximize();
//     }else{
//         currentWindow.maximize()
//     }
// })
// close.addEventListener('click',() =>{
//     remote.app.quit();
// });