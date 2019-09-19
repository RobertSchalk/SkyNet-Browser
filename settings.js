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
const Bookmark = require("./bookmarks.js");

var themes = path.join(__dirname, 'themes.json');
var bookmarks = path.join(__dirname, 'bookmarks.json');

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
    bookmarksView = ById('bookmarksView'),
    bookmarksList = ById('bookmarksList');


    //bookmark views
var createBookmarkView = ById('createBookmarkView'),
    removeBookmarkView = ById('removeBookmarkView'),
    createFolderView = ById('createFolderView'),
    removeFolderView = ById('removeFolderView'),
    favoritesBarView = ById('favoritesBarView'),
    createBookmark = ById('createBookmark'),
    removeBookmark = ById('removeBookmark'),
    createFolder = ById('createFolder'),
    removeFolder = ById('removeFolder'),
    favoritesBar = ById('favoritesBar');

    //Sets the initial view
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

        //Handles the presentation of bookmarks on the page.

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

//Creates the bookmark list.
jsonfile.readFile(bookmarks, function(err, obj) {
    if(obj.length !== 0) {
        for (var i = 0; i < obj.length; i++) {
            let url = obj[i].url;
            let icon = obj[i].icon;
            let id = obj[i].id;
            let title = obj[i].title;
            let bookmark = new Bookmark(id, url, icon, title);
            let el = bookmark.ELEMENT();
            bookmarksList.appendChild(el);
        }
    }
})


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

//This handles the bookmark views.
CreateBookmarkView ()
function CreateBookmarkView() {
    createBookmarkView.style.display = "block";
    removeBookmarkView.style.display = "none";
    createFolderView.style.display = "none";
    removeFolderView.style.display = "none";
    favoritesBarView.style.display = "none";
}
function RemoveBookmarkView() {
    createBookmarkView.style.display = "none";
    removeBookmarkView.style.display = "block";
    createFolderView.style.display = "none";
    removeFolderView.style.display = "none";
    favoritesBarView.style.display = "none";
  
}

function CreateFolderView() {
    createBookmarkView.style.display = "none";
    removeBookmarkView.style.display = "none";
    createFolderView.style.display = "block";
    removeFolderView.style.display = "none";
    favoritesBarView.style.display = "none";
}
function RemoveFolderView() {
    createBookmarkView.style.display = "none";
    removeBookmarkView.style.display = "none";
    createFolderView.style.display = "none";
    removeFolderView.style.display = "block";
    favoritesBarView.style.display = "none";

    
}

function FavoritesBarView() {
    createBookmarkView.style.display = "none";
    removeBookmarkView.style.display = "none";
    createFolderView.style.display = "none";
    removeFolderView.style.display = "none";
    favoritesBarView.style.display = "block";
}


    
    personalize.addEventListener('click', PersonalizeView);
    privacy.addEventListener('click', PrivacyView);
    about.addEventListener('click', AboutView);
    bookmark.addEventListener('click', BookmarksView);
    themeSelector.addEventListener('click', ChangeTheme);
    createBookmark.addEventListener('click', CreateBookmarkView);
    removeBookmark.addEventListener('click', RemoveBookmarkView);
    createFolder.addEventListener('click', CreateFolderView);
    removeFolder.addEventListener('click', RemoveFolderView);
    favoritesBar.addEventListener('click', FavoritesBarView);
   