const electron = require('electron');
const app = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
var jsonfile = require('jsonfile');
var favicon = require('favicon-getter').default;
var path = require('path');
var uuid = require('uuid');
const Theme = require("./themes.js")
const version = electron.remote.app.getVersion();
const fs = require('fs');

var themes = path.join(__dirname, 'themes.json');


var ById = function (id) {
    return document.getElementById(id);
}

var browserVersion = ById('browserVersion'),
    electronVersion = ById('electronVersion'),
    themeSelector = ById('themeSelector');


var about = ById('about'),
    personalize = ById('personalize'),
    privacy = ById('privacy'),
    aboutView = ById('aboutView'),
    bookmark = ById('bookmark'),
    appearanceView = ById('appearanceView'),
    privacyView = ById('privacyView'),
    bookmarksView = ById('bookmarksView');

    
       AboutView();
       
    
    function AboutView () {
        
        aboutView.style.display = "block";
        personalizeView.style.display = "none";
        privacyView.style.display = "none";
        bookmarksView.style.display = "none";
    }
    function PersonalizeView () {
        
        aboutView.style.display = "none";
        personalizeView.style.display = "block";
        privacyView.style.display = "none";
        bookmarksView.style.display = "none";
        CreateThemes();
    }
    
    function PrivacyView () {
        
        aboutView.style.display = "none";
        personalizeView.style.display = "none";
        privacyView.style.display = "block";
        bookmarksView.style.display = "none";
    }
    function BookmarksView () {
        
        aboutView.style.display = "none";
        personalizeView.style.display = "none";
        privacyView.style.display = "none";
        bookmarksView.style.display = "block";
    }

    

/// Personalize:

//Display Themes list.

function CreateThemes(){
    let state = themeSelector.getAttribute('data-state');
    if(state === 'closed'){
        themeSelector.innerHTML = '';
        jsonfile.readFile(themes, function(err, obj){
            if(obj.length !== 0){
                for (var i =0; i < obj.length; i++){
                    let id = obj[i].id;
                    let title = obj[i].title;
                    let active = obj[i].active;
                    let css = obj[i].css;
                    let theme = new Theme(id, title, active, css);
                    let el = theme.ELEMENT();
                    themeSelector.appendChild(el);
                }
            }
            themeSelector.setAttribute('data-state', 'open');
        })
    } else{
        themeSelector.setAttribute('data-state', 'open');
    }
}




//sets the theme for the browser.
//The index.js will write the configs to index.js.

function ChangeTheme(event){
    
    
        console.log('target id = ' + event.target.id);
    /*
if(targetElement !== 'open' && targetElement !== 'close'){
    jsonfile.readFile(themes, function(err, obj){
    
        for(var i = 0; i < obj.length; i++){
            let id = obj[i].id;
            let title = obj[i].title;
            let active = obj[i].active;
            let css = obj[i].css
            theme = new Theme(id, title, active, css);
            /*
                jsonfile.writeFile(themes, obj, function (err){
                    id = targetId;
                    active = 'true'
                }, 2);*//*
                console.log('target id = ' + targetId);
                }
            });
}*/
}


    
    personalize.addEventListener('click', PersonalizeView);
    privacy.addEventListener('click', PrivacyView);
    about.addEventListener('click', AboutView);
    bookmark.addEventListener('click', BookmarksView);
    themeSelector.addEventListener('click', ChangeTheme)

