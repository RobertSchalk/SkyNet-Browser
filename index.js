const electron = require('electron')
const BrowserWindow = electron.remote.BrowserWindow;
const windowStateKeeper = require('electron-window-state');
const jsonfile = require('jsonfile');
const favicon = require('favicon-getter').default;
const path = require('path');
const uuid = require('uuid');


console.log(process);
var ById = function (id) {
    return document.getElementById(id);
}
var bookmarks = path.join(__dirname, 'bookmarks.json');
var tabs = [];
var tabsIndex;
var views = [];
var viewsIndex;

var back = ById('back'),
    forward = ById('forward'),
    refresh = ById('refresh'),
    omni = ById('url'),
    dev = ById('console'),
    fave = ById('fave'),
    list = ById('list'),
    popup = ById('fave-popup'),
    view = ById('view'),
    closeExtras = ById('closeExtras'),
    views = ById('views');
    close = ById('close'),
    settings = ById('settings'),
    skyWrite = ById('skyWrite'),
    settingsList = ById('settingsList'),
    mainSettings = ById('mainSettings'),
    leaveSettings = ById('leaveSettings');

function reloadView () {
    view.reload();
}

function backView () {
    view.goBack();
}

function forwardView () {
    view.goForward();
}

function updateURL (event) {
    if (event.keyCode === 13) {
        omni.blur();
        let val = omni.value;
        let https = val.slice(0, 8).toLowerCase();
        let http = val.slice(0, 7).toLowerCase();
        if (https === 'https://') {
            view.loadURL(val);
        } else if (http === 'http://') {
            view.loadURL(val);
        } else {
        view.loadURL('http://'+ val);
        }
    }
}

//handles cookies


//handles bookmarks
var Bookmark = function (id, url, faviconUrl, title) {
    this.id = id;
    this.url = url;
    this.icon = faviconUrl;
    this.title = title;
}

Bookmark.prototype.ELEMENT = function () {
    var a_tag = document.createElement('a');
    a_tag.href = this.url;
    a_tag.className = 'link';
    a_tag.textContent = this.title;
    var favimage = document.createElement('img');
    favimage.src = this.icon;
    favimage.className = 'favicon';
    a_tag.insertBefore(favimage, a_tag.childNodes[0]);
    return a_tag;
}
function addBookmark () {
    let url = view.src;
    let title = view.getTitle();
    favicon(url).then(function(fav) {
        let book = new Bookmark(uuid.v1(), url, fav, title);
        jsonfile.readFile(bookmarks, function(err, curr) {
            curr.push(book);
            jsonfile.writeFile(bookmarks, curr, function (err) {
            })
        })
    })
}
function openPopUp (event) {
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
                popup.style.display = 'block';
                popup.setAttribute('data-state', 'open');
        });
    } else {
        popup.style.display = 'none';
        popup.setAttribute('data-state', 'closed');
    }
}

function handleUrl (event) {
    if (event.target.className === 'link') {
        event.preventDefault();
        view.loadURL(event.target.href);
    } else if (event.target.className === 'favicon') {
        event.preventDefault();
        view.loadURL(event.target.parentElement.href);
    }
}

function handleDevtools () {
    if (view.isDevToolsOpened()) {
        view.closeDevTools();
    } else {
        view.openDevTools();
    }
}

function updateNav (event) {
    omni.value = view.src;
}


function OpenExtras() {
    document.getElementById("ExtrasWindow").style.width = "calc(100vw)";
}

function CloseExtras() {
    document.getElementById("ExtrasWindow").style.width = "0%";
}


//This manages the tabs bar.

var tabsBar = ById('tabs');
var tab = document.getElementsByClassName('tab');
//var tab = ById("tab");
var newTab = ById('newTab');
var tabs = tabsBar.childNodes;
var i = 0;
var base = document.querySelector('#tabs');

function CreateTab(){
    var createTab = document.createElement("div");
    createTab.classList.add("tab");
    tabsBar.appendChild(createTab);
    var createView = document.createElement("webview");
    createView.classList.add("page");
    views.appendChild(createView);

    
}
// use tab[i] = view[i]
function focusTab(){
    
    
    console.log('focus tab complete')
    
}






for (i = 0; i < tab.length; i++){
    tab[i].addEventListener('click', focusTab, false)
}

(function() {
    function scrollHorizontally(e) {
        e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        tabsBar.scrollLeft -= (delta*80); // Multiplied by 40
        e.preventDefault();
    }
    
    
        tabsBar.addEventListener('mousewheel', scrollHorizontally, false);
})();



//Creates the setting window when called on.
function CreateSettingsView () {
        
    omni.blur();
    
    let winState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800

    })
    //let settingsSession = session.fromPartition('settingsWindow')
   // const settingsPath = path.join('file://', _dirname, '../settings/settings.html')
    let settingsWindow = new BrowserWindow({
        width: winState.width, 
        height: winState.Height,
        minWidth: 700,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
             webviewTag: true,
              electron: true},
        })
        //let session = settingsWindow.webContents.session;
        winState.manage(settingsWindow);
    settingsWindow.on('close', function(){settingsWindow = null})
    settingsWindow.loadFile('settings/Settings.html')
    settingsWindow.show();
  /*  settingsList.style.display = "block";
    mainSettings.style.display = "block";
    view.style.display = "none";
    view.style.width = "80vw";
    view.src = ("About.html"); */

    CloseExtras();
}

//Creates the SkyWriteWindow
function CreateSkyWriteView () {

    omni.blur();
    
    let winState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800

    })

   // let skyWriteSession = session.fromPartition('skyWriteWindow')
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
               },
        
        })
      //  let session = settingsWindow.webContents.session;
        winState.manage(skyWriteWindow);
     skyWriteWindow.on('close', function(){skyWriteWindow = null})
     skyWriteWindow.loadFile('Extras/SkyWrite.html');

     skyWriteWindow.show();
   /*  settingsList.style.display = "block";
     mainSettings.style.display = "block";
     view.style.display = "none";
     view.style.width = "80vw";
     view.src = ("About.html"); */
     CloseExtras();
}





//event listeners
refresh.addEventListener('click', reloadView);
back.addEventListener('click', backView);
forward.addEventListener('click', forwardView);
omni.addEventListener('keydown', updateURL);
fave.addEventListener('click', addBookmark);
list.addEventListener('click', OpenExtras);
//popup.addEventListener('click', handleUrl);
dev.addEventListener('click', handleDevtools);
view.addEventListener('did-finish-load', updateNav);
closeExtras.addEventListener('click', CloseExtras);
newTab.addEventListener('click', CreateTab);
settings.addEventListener('click', CreateSettingsView);
skyWrite.addEventListener('click', CreateSkyWriteView);
