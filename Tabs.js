//This manages the tabs bar.
var ById = function (id) {
    return document.getElementById(id);
}
var jsonfile = require('jsonfile');
var favicon = require('favicon-getter').default;
var path = require('path');
var uuid = require('uuid');

var tabsBar = ById('tabs');
var tab = document.getElementsByClassName('tab');
var newTab = ById('newTab');

function CreateTab(){
    var createTab = document.createElement("a");
    createTab.classList.add("tab");
    tabsBar.appendChild(createTab);
}

newTab.addEventListener('click', CreateTab);