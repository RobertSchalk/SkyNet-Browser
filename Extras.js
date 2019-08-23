const {app, BrowserWindow} = require('electron');
const {colors} = require('colors');




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
    skyWrite = ById('textEditor');


    function openSettings() {
        document.getElementById("SettingsWindow").style.width = "calc(100vw)";
    }
    
    function closeSettings() {
        document.getElementById("SettingsWindow").style.width = "0%";
    }

    function settingsView () {
        
            omni.blur();
            view.src = ('Settings.html');
            closeSettings();
    }
    
    function skyWriteView () {
        
        omni.blur();
        view.src = ('textEditor.html');
        closeSettings();
}

    settings.addEventListener('click', settingsView);
    skyWrite.addEventListener('click', skyWriteView);

    