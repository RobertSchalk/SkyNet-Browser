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
const urlRegex = require('url-regex'); // checks a url and tells the browser what to do with it. It's a bit better than my original method.

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
    favoritesBar = ById('favoritesBar'),
    bookmarkTitle = ById('bookmarkTitle'),
    bookmarkUrl = ById('bookmarkUrl');

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


function CreateBookmark(url, title) {
   
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
            bookmarksList.appendChild(el);
        });
        
    });
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
    bookmarkTitle.addEventListener('keydown', function(e){
        if(e.keyCode ==13){
            bookmarkUrl.focus(); //Shifts the focus to the bookmarkUrl element when Enter is pressed.
        }
    })
    bookmarkUrl.addEventListener('keydown', function(e){
        if(e.keyCode == 13){
            if(bookmarkTitle.value.length !== 0 && bookmarkUrl.value.length !== 0){
                url = _purifyUrl(bookmarkUrl.value);
                if(url != null){
                    //adds bookmark then clears the form to prevent accidental duplicates.
                    CreateBookmark(url, bookmarkTitle.value)
                    bookmarkTitle.value = null;
                    bookmarkUrl.value = null;
                } else{
                    window.alert("Error: Bookmark Url is in an incorrect format. Please write a propert url. \n (https://www.example.com | www.example.com | example.com) ");
                }
            } else{
                if(bookmarkTitle.value.length == 0 && bookmarkUrl.value.length == 0){
                window.alert("Error: Bookmark Title & Url are empty.\nCan't create empty bookmark.");
                } else{
                if(bookmarkTitle.value.length == 0 ){
                window.alert("Error: Bookmark Title is empty.\nCan't create bookmark without a title.");
                } 
                if(bookmarkUrl.value.length == 0){
                window.alert("Error: Bookmark Url is empty.\nCan't create bookmark without a URL.");
                } }

            }
        }
    });
   
    

    _purifyUrl = function(url){
        
        let c = url.slice(0,2).toLowerCase()
        let file = url.slice(0,8).toLowerCase()
        if(c ==='c:'){
            url
        } else if(file === 'file:///'){
            url
        } else{
            if (urlRegex({
                strict: false,
                exact: true,
                file: true
            }).test(url)) {
            url = (url.match(/^https?:\/\/.*/)) ? url : 'http://' + url;
        }else {
            url = null;
        }
    }
        return url;
    
    }