

var ById = function (id) {
    return document.getElementById(id);
}
var jsonfile = require('jsonfile');
var favicon = require('favicon-getter').default;
var path = require('path');
var uuid = require('uuid');
var bookmarks = path.join(__dirname, 'bookmarks.json');

var back = ById('back'),
    forward = ById('forward'),
    refresh = ById('refresh'),
    omni = ById('url'),
    dev = ById('console'),
    fave = ById('fave'),
    list = ById('list'),
    popup = ById('fave-popup'),
    view = ById('view'),
    close = ById('close'),
    settings = ById('settings'),
    skyWrite = ById('skyWrite'),
    settingsList = ById('settingsList'),
    mainSettings = ById('mainSettings'),
    leaveSettings = ById('leaveSettings');


    function openExtras() {
        document.getElementById("ExtrasWindow").style.width = "calc(100vw)";
    }
    
    function closeExtras() {
        document.getElementById("ExtrasWindow").style.width = "0%";
    }

    function settingsView () {
        
            omni.blur();
            window.open('settings.html', 'nodeIntegration=yes');
          /*  settingsList.style.display = "block";
            mainSettings.style.display = "block";
            view.style.display = "none";
            view.style.width = "80vw";
            view.src = ("About.html"); */
            closeExtras();
    }

    function LeaveSettings(){
        omni.blur();
        settingsList.style.display = "none";
        mainSettings.style.display = "none";
        view.style.display = "";
        view.style.width = "100vw";
    }
    
    function skyWriteView () {
        
        omni.blur();
        view.src = ('Extras/SkyWrite.html');
        closeExtras();
}

    settings.addEventListener('click', settingsView);
    leaveSettings.addEventListener('click', LeaveSettings);
    skyWrite.addEventListener('click', skyWriteView);

    