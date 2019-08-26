const electron = require('electron')
const BrowserWindow = electron.remote.BrowserWindow;
var jsonfile = require('jsonfile');
var favicon = require('favicon-getter').default;
var path = require('path');
var uuid = require('uuid');
const version = electron.remote.app.getVersion();



var ById = function (id) {
    return document.getElementById(id);
}

var browserVersion = ById('browserVersion'),
    electronVersion = ById('electronVersion');


var about = ById('about'),
    appearance = ById('appearance'),
    privacy = ById('privacy'),
    aboutView = ById('aboutView'),
    appearanceView = ById('appearanceView'),
    privacyView = ById('privacyView');

    
       
    
    function AboutView () {
        
        aboutView.style.display = "block";
        appearanceView.style.display = "none";
        privacyView.style.display = "none";
    }
    function AppearanceView () {
        
        aboutView.style.display = "none";
        appearanceView.style.display = "block";
        privacyView.style.display = "none";
    }
    
    function PrivacyView () {
        
        aboutView.style.display = "none";
        appearanceView.style.display = "none";
        privacyView.style.display = "block";
    }

    

    
    appearance.addEventListener('click', AppearanceView);
    privacy.addEventListener('click', PrivacyView);
    about.addEventListener('click', AboutView);

