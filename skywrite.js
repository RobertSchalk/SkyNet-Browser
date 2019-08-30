//const { app, BrowserWindow, Menu } = require('electron');
//const {menu} = require('electron')
//const electron = require('electron');
//var jsonfile = require('jsonfile');
//var favicon = require('favicon-getter').default;
var path = require('path');
var uuid = require('uuid');
const fs = require('fs')
const { readTitles } = require(path.resolve('../actions/uiActions/'))

readTitles('./data').map(({title, dir}) => {
    el = document.createElement("li");
    text = document.createTextNode(`${title.split('.md')[0]}`);
    el.appendChild(text)
    el.addEventListener('click', function(e){ // clicking on sidebar titles
        fs.readFile(dir, (err, data) => {
        if (err) throw err;
        fileDir = dir;
        document.getElementById('content').innerHTML = data;
        });
    })
    document.getElementById('titles').appendChild(el)
}) 

//window.webContents.setDevToolsWebContents(devtools.webContents);
//window.webContents.openDevTools({mode: 'detach'});