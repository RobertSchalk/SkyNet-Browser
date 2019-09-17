const path = require('path'); // Used for book marks. Joins a path and file location
const jsonfile = require('jsonfile'); // To allow the communication between the .json files.
const uuid= require("uuid"); // Helps create ids for bookmarks.

//handles bookmarks
//creating the Bookmark class
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
    a_tag.title = this.title + '\n' + this.url;
    var favimage = document.createElement('img');
    favimage.src = this.icon;
    favimage.className = 'favicon';
    a_tag.insertBefore(favimage, a_tag.childNodes[0]);
    return a_tag;
}



module.exports = Bookmark;
