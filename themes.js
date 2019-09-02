const path = require('path');

var Theme = function( id, title, active,css){
    this.id = id;
    this.title = title;
    this.active = active;
    this.css = css;
}

Theme.prototype.ELEMENT = function(){
    var option_tag = document.createElement('option');
    option_tag.id = this.id;
    option_tag.value = this.title;
    option_tag.textContent = this.title;
    return option_tag;
}

Theme.prototype.Apply = function(){
    var link_tag = document.createElement('link');
        link_tag.id = "Theme";
        link_tag.rel = "stylesheet";
        link_tag.href = this.css;
    return link_tag;
}
module.exports = Theme;