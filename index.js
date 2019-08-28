const { session } = require('electron');
//const { webview } = require('electron');
const electron = require('electron');
const {ipcRenderer} = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const windowStateKeeper = require('electron-window-state');
const jsonfile = require('jsonfile');
const favicon = require('favicon-getter').default;
const path = require('path');
const uuid = require('uuid');
const TabGroup = require("electron-tabs");
const enav = new (require('electron-navigation'));
const dragula = require("dragula");

var ById = function (id) {
    return document.getElementById(id);
}
var bookmarks = path.join(__dirname, 'bookmarks.json');
//var tabs = [];
var tabsIndex;
//var views = [];
var viewsIndex;
var back = ById('back'),
forward = ById('forward'),
refresh = ById('refresh'),
omni = ById('url'),
dev = ById('console'),
fave = ById('fave'),
list = ById('list'),
popup = ById('fave-popup'),
//activeView = ById('activeView'),
closeExtras = ById('closeExtras'),
views = ById('views'),
close = ById('close'),
favorites = ById('favorites'),
settings = ById('settings'),
skyWrite = ById('skyWrite'),
settingsList = ById('settingsList'),
mainSettings = ById('mainSettings'),
leaveSettings = ById('leaveSettings'),
tabs = ById("tabs"),
activeView = ById("activeView");

console.log(process);



/*
let ses = view.getWebContents().session;
ses.cookies.get({ url: view.src}, function(error, cookies) {
    console.log(cookies);
    let cookieStr = ''
    for(var i = 0; i < cookies.length; i++){
        let info = cookies[i];
        cookieStr += `${info.name}=${info.value};`;
        console.log(info.value, info.name);
    }
    console.log(cookieStr);
}); */

//Standard buttons - for controlling the <webview> 
//refresh button

let tabGroup = new TabGroup({
   
    Tab:{
        title: 'New Tab',
        src: 'src/defaultHome.html',
        visible: true,
        webviewAttributes:{
            nodeintegration: true
        }
    }
})
    



    let defaultTab = tabGroup.addTab({
        title: "Our Code World",
        src: "https://ourcodeworld.com",
        visible: true
    });
    
    let webview = tabGroup.getActiveTab().webview;
    
        ipcRenderer.on('request', function(){
            ipcRenderer.sendToHost(getScripts());
        })
        
        ipcRenderer.on("change-text-element",function(event,data){
            // the document references to the document of the <webview>
            webview.innerHTML = data.text;
        });
        
        /** 
        @returns {String}
         **/
        function getScripts(){
            var items = [];
            
            for(var i = 0;i < document.scripts.length;i++){
                items.push(document.scripts[i].src);
            }
            
            return JSON.stringify(items);
        }

        webview.addEventListener("dom-ready", function() {
            // Show devTools if you want
            //webview.openDevTools();
            console.log("DOM-Ready, triggering events !");
            
            // Aler the scripts src of the website from the <webview>
            webview.send("request");
            
            // alert-something
            webview.send("alert-something", "Hey, i'm alerting this.");
            
            // change-text-element manipulating the DOM
            webview.send("change-text-element",{
                id: "activeView",
                text: "My text"
            });
        });
        
        // Process the data from the webview
        webview.addEventListener('ipc-message',function(event){
            console.log(event);
            console.info(event.channel);
        });
    
    function CreateTab(){
        
        let newTab = tabGroup.addTab({
            title: 'test',
            src: "https://www.Bing.com",
            visible: true,
            active: true,
        });
        var title = newTab.webview.getTitle();
        newTab.setTitle(title);
    }
    //tabGroup.getActiveTab()
        

function reloadView () {
    webview.reload();
}
//back button
function backView () {
    webview.goBack();
}
// forward button
function forwardView () {
    webview.goForward();
}
//validates user input when they enter a url or file location.
function updateURL (event) {

    if (event.keyCode === 13) {
        omni.blur();
        let val = omni.value;
        let https = val.slice(0, 8).toLowerCase();
        let http = val.slice(0, 7).toLowerCase();
        let c = val.slice(0,2).toLowerCase();
        let file = val.slice(0,8).toLowerCase();
        if (https === 'https://') {
            webview.loadURL(val);
        } else if (http === 'http://') {
            webview.loadURL(val);
        }else if (file === 'file:///'){
            webview.loadURL(val)
        } else if (c ===  'c:'){
            webview.loadURL('file:///' + val);
        } 
        else {
            webview.loadURL('http://'+ val);
        }
}}



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
    CloseExtras();
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
        popup.style.display = 'none';
        popup.setAttribute('data-state', 'closed');
    if (event.target.className === 'link') {
        event.preventDefault();
        webview.loadURL(event.target.href);
    } else if (event.target.className === 'favicon') {
        event.preventDefault();
        webview.loadURL(event.target.parentElement.href);
    }
}


//handles devtools for webview.
function handleDevtools () {
    CloseExtras();
    if (webview.isDevToolsOpened()) {
        webview.closeDevTools();
    } else {
        
        webview.openDevTools();
    }
}

function updateNav (event) {
    omni.value = webview.src;
}


function OpenExtras() {
    document.getElementById("ExtrasWindow").style.width = "calc(100vw)";
}

function CloseExtras() {
    document.getElementById("ExtrasWindow").style.width = "0%";
}


//This manages the tabs bar.

//var tabsBar = ById('tabs');
//var tab = document.getElementsByClassName('tab');
//var tab = ById("tab");
var NewTab = ById('newTab');

//var tabs = tabsBar.childNodes;
//var i = 0;
//var base = document.querySelector('#tabs');

    

// use tab[i] = view[i]
function focusTab(){
    
    
    console.log('focus tab complete')
    
}



(function() {
    function scrollHorizontally(e) {
        e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        tabs.scrollLeft -= (delta*80); // Multiplied by 40
        e.preventDefault();
    }
    
    
        tabs.addEventListener('mousewheel', scrollHorizontally, false);
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

//Creates the SkyWrite Window
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
              path: true,
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
favorites.addEventListener('click', openPopUp);
popup.addEventListener('click', handleUrl);
dev.addEventListener('click', handleDevtools);
webview.addEventListener('did-finish-load', updateNav);
closeExtras.addEventListener('click', CloseExtras);
NewTab.addEventListener('click', CreateTab);
settings.addEventListener('click', CreateSettingsView);
skyWrite.addEventListener('click', CreateSkyWriteView);

// When everything is ready, trigger the events without problems

