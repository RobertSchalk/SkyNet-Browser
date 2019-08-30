const { session } = require('electron');
const electron = require('electron');
const {ipcRenderer} = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const windowStateKeeper = require('electron-window-state');
const jsonfile = require('jsonfile');
const favicon = require('favicon-getter').default;
const path = require('path');
const urlRegex = require('url-regex');
const contextMenu = require('electron-context-menu');
const dragula = require("dragula");
var $ = require('jquery');
var Color = require('color.js');
var globalCloseableTabsOverride;

var ById = function (id) {
    return document.getElementById(id);
}
var bookmarks = path.join(__dirname, 'bookmarks.json');


var omni = ById('url'),
dev = ById('console'),
fave = ById('fave'),
list = ById('list'),
popup = ById('fave-popup'),
closeExtras = ById('closeExtras'),
favorites = ById('favorites'),
settings = ById('settings'),
skyWrite = ById('skyWrite');

console.log(process);




    function Navigation(options){
        var defaults = {
            closableTabs: true,
            defaultFavicons: false,
            newTabCallback: null,
            changeTabCallback: null,
            newTabParams: null
        };
        options = options ? Object.assign(defaults, options) : defaults;

        globalCloseableTabsOverride = options.closableTabs;
        const NAV = this;
        this.newTabCallback = options.newTabCallback;
        this.changeTabCallback = options.changeTabCallback;
        this.SESSION_ID = 1;
        if (options.defaultFavicons) {
            this.TAB_ICON = "default";
        } else {
            this.TAB_ICON = "clean";
        }
        this.SVG_RELOAD = '<svg height="100%" viewBox="0 0 24 24" id="nav-ready"><path d="M17.65 6.35C16.2 4.9 14.21 4 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08c-.82 2.33-3.04 4-5.65 4-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
        this.SVG_CLEAR = '<svg height="100%" viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/><path d="M0 0h24v24H0z" fill="none"/></svg>';
        this.SVG_FAVICON = '<svg height="100%" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>';
    

        
    //
    // switch active view and tab on click
    //

        $('#tabs').on('click', '.etabs-tab', function(){
            $('.etabs-tab, .etabs-view').removeClass('active');
   
       
        var sessionID = $(this).data('session');
        $('.etabs-tab, .etabs-view')
            .filter('[data-session="' + sessionID + '"]')
            .addClass('active');
        var session = $('.etabs-view[data-session="' + sessionID + '"]')[0];
        (NAV.changeTabCallBack || (() => {}))(session);
        NAV._updateUrl(session.getURL());  
        NAV._updateCtrls();

        // close tab and view
    }).on('click', '.etabs-tab-buttons', function(){
        var sessionID = $(this).parent('.etabs-tab').data('session');
        var session = $('.etabs-tab, .etabs-view').filter('[data-session="' + sessionID + '"]');

        if(session.hasClass('active')){
            if(session.next('etabs-tab').length){
                session.next().addClass('active');
                (NAV.changeTabCallBack || (() => {}))(session.next()[1]);
            } else{
                session.prev().addClass('active');
                (NAV.changeTabCallback || (() =>{}))(session.prev()[1]);
            }
        }
        session.remove();
        NAV._updateUrl();
        NAV._updateCtrls();
        return false;
    });


    //add a tab, default to Bing.com
    $('#lowBar').on('click', '#newTab', function(){
        let params;
        if(typeof options.newTabParams === "function"){
            params = options.newTabParams();
        } else if(options.newTabParams instanceof Array){
            params = options.newTabParams
        } else{
            params = ['http://www.bing.com/', {
                close: options.closableTabs,
                icon: NAV.TAB_ICON
            }];
        }
        NAV.newTab(...params);
    });

    //go back
    $('#navigation').on('click', '#back', function(){
        NAV.back();
        //console.log('back')
    });

    // go forward

    $('#navigation').on('click', '#forward', function(){
        NAV.forward();
        //console.log('forward')
    });

    //refresh
    $('#navigation').on('click', '#refresh', function(){
        
        //check webview  spot
       if($(this).find('#nav-ready').length){
        NAV.reload();
        //console.log('refreshed');
        } else {
        NAV.stop();
        //console.log('refreshed stopped');
        }
    });

    //highlights url text on first select

    $('#url').on('focus', function(e){
        $(this)
            .one('mouseup', function(){
                $(this).select();
                return false;
            })
            .select();
    });


    $('#url').keyup(function(e){
        if(e.keyCode == 13) {
            if(e.shiftKey) {
                NAV.newTab(this.value, {
                    close: options.closableTabs,
                    icon: NAV.TAB_ICON
                });
            } else {
                if($('.etabs-tab').length){
                    NAV.changeTab(this.value);
                } else{
                    NAV.newTab(this.value, {
                        close: options.closableTabs,
                        icon: NAV.TAB_ICON
                    });
                }
            }
        }
    });

    //functions
//Updates controls

    this._updateCtrls = function(){
        webview = $('.etabs-view.active')[0];
        if(!webview) {
            $('#back').addClass('disabled');
            $('#foward').addClass('disabled');
            $('#refresh').html(this.SVG_RELOAD).addClass('disabled');
            return;
        }
        if(webview.canGoBack()){
            $('#back').removeClass('disabled');
        } else {
            $('#back').addClass('disabled');
        }
        if(webview.canGoForward()){
            $('#forward').removeClass('disabled');
        } else{
            $('#forward').addClass('disabled');
        } 
        if(webview.isLoading()){
            this._loading();
            //console.log('webview loading.')
        } else {
            this._stopLoading();
            //console.log('webview stopped loading.')
        }
        if (webview.getAttribute('data-readonly') == 'true'){
            $('#url').attr('readonly', 'readonly');
        } else{
            $('#url').removeAttr('readonly');
        }
    } // _updateCtrls()

    //loading animations
    //start

    this._loading = function(tab) {
        tab = tab || null;

        if(tab == null) {
            tab = $('.etabs-tab.active');
        }
        tab.find('.etabs-tab-icon').css('animation', 'nav-spin 2s linear infinate');
        $('#refresh').html(this.SVG_CLEAR);
    } //:_loading()
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    //stop animation

    this._stopLoading = function (tab) {
        tab = tab || null;

        if(tab == null){
            tab = $('.etabs-tab.active');
        }

        tab.find('.etabs-tab-icon').css('animation', '');
        $('#refresh').html(this.SVG_RELOAD);
    } //:_stopLoading();

    this._purifyUrl = function(url){
        
            if (urlRegex({
                strict: false,
                exact: true
            }).test(url)) {
            url = (url.match(/^https?:\/\/.*/)) ? url : 'http://' + url;
        } else {
            url = (!url.match(/^[a-zA-Z]+:\/\//)) ? 'https://www.bing.com/search?q=' + url.replace(' ', '+') : url;
        }
        return url;
    
    }//:_purifyUrl()
    
    this._setTabColor = function(url, currTab){
        const getHexColor = new Color(url, {
            amount: 1,
            format: 'hex'
        });
        getHexColor.mostUsed(result => {
            currTab.find('.etabs-tab-icon svg').attr('fill', result);
        });
    } //:_setTabColor()
    

    //add event listeners to current webview

    this._addEvents = function (sessionID,options) {
        let currTab = $('.etabs-tab[data-session="' + sessionID + '"]');
        let webview = $('.etabs-view[data-session="' + sessionID + '"]');

        webview.on('dom-ready', function(){
            if(options.contextMenu) {
                contextMenu({
                    window: webview[0],
                    labels: {
                        cut: 'Cut',
                        copy: 'Copy',
                        paste: 'Paste',
                        save: 'Save',
                        copyLink: 'Copy Link',
                        inspect: 'Inspect'
                    }
                });
            }
        });
        webview.on('page-title-updated', function(){
            if(options.title == 'default'){
                currTab.find('.etabs-tab-title').text(webview[0].getTitle());
                currTab.find('.etabs-tab-title').attr('title', webview[0].getTitle());
               
            }
        });
        webview.on('did-start-loading', function() {
            NAV._loading(currTab);
          //  console.log('started loading.')
        });
        webview.on('did-stop-loading', function(){
            NAV._stopLoading(currTab);
           // console.log('stopped loading.')
        });
        webview.on('enter-html-full-screen', function(){
            $('.etabs-view.active').siblings().not('script').hide();
            $('.etabs-view.active').parents().not('script').siblings().hide();
        });
        webview.on('load-commit', function(){
            NAV._updateCtrls();
        });
        webview[0].addEventListener('did-navigate', (res) =>{
            NAV._updateUrl(res.url);
        });
        webview[0].addEventListener('did-fail-load', (res) => {
            NAV._updateUrl(res.validatedUrl);
        });
        webview[0].addEventListener('did-navigate-in-page', (res) =>{
            NAV._updateUrl(res.url);
        });
        webview[0].addEventListener("new-window", (res) =>{
            if(!(options.newWindowFrameNameBlacklistExpression instanceof RegExp && options.newWindowFrameNameBlacklistExpression.test(res.frameName))) {
                NAV.newTab(res.url, {
                    icon: NAV.TAB_ICON
                });
            } 
        });
        webview[0].addEventListener('page-favicon-updated', (res) => {
            if (options.icon == 'clean') {
                NAV._setTabColor(res.favicons[0], currTab);
                
            } else if (options.icon == 'default') {
                currTab.find('etabs-tab-icon').attr('src', res.favicons[0]);
            }
        });

        webview[0].addEventListener('did-fail-load', (res) => {
            if (res.validatedURL == $('#url').val() && res.errorCode != -3) {
                this.executeJavaScript('document.body.innerHTML=' +
                    '<div style="background-color:whitesmoke;padding:40px;margin:20px;">' +
                    '<h2 align=center>This page failed to load correctly.</h2>' +
                    '<p align=center><i>ERROR [ ' + res.errorCode + ', ' + res.errorDescription + ' ]</i></p>' +
                    '<br/><hr/>' +
                    '<h4>Try this</h4>' +
                    '<li type=circle>Check your spelling - <b>"' + res.validatedURL + '".</b></li><br/>' +
                    '<li type=circle><a href="javascript:location.reload();">Refresh</a> the page.</li><br/>' +
                    '<li type=circle>Perform a <a href=javascript:location.href="https://www.bing.com/search?q=' + res.validatedURL + '">search</a> instead.</li><br/>' +
                    '</div>'
                );
            }
        });
        return webview[0];
    } //:_addEvents()

    //update #url to new url or active tab's url

    this._updateUrl = function(url){
        url = url || null;
        urlInput = $('#url');
        if(url == null){
            if($('.etabs-view').length){
                url = $('.etabs-view.active')[0].getURL();
            } else{
                url = '';
            }
        }
        urlInput.off('blur');
        if(!urlInput.is(':focus')){
            urlInput.prop('value', url);
            urlInput.data('last', url);
        } else {
            urlInput.on('blur', function(){
                //if it's not edited
                if(urlInput.val() == urlInput.data('last')) {
                    urlInput.prop('value', url);
                    urlInput.data('last', url);
                }
                urlInput.off('blur');
            });
        }
    } // :_updateUrl()

} //:Navigation()


Navigation.prototype.newTab = function(url, options){
    

    var defaults = {
        id: null, // null, 'yourIdHere'
        node: false,
        webviewAttributes: {},
        icon: "clean", // 'default', 'clean', 'c:\location\to\image.png'
        title: "default", // 'default', 'your title here'
        close: true,
        readonlyUrl: false,
        contextMenu: true,
        newTabCallback: this.newTabCallback,
        changeTabCallback: this.changeTabCallbackgo
    }
    options = options ? Object.assign(defaults,options) : defaults;
    if(typeof options.newTabCallback === "function"){
        let result = options.newTabCallback(url, options);
        if(!result){
            return null;
        }go
        if(result.url){go
            url = result.url;
        }go
        if(result.options){
            options = result.options;
        }
        if(typeof result.postTabOpenCallback === "function"){
            options.postTabOpenCallback = result.postTabOpenCallback;
        }
    }
    
    //validate options.id
    $('.etabs-tab, .etabs-view').removeClass('active');
    if($('#' + options.id).length) {
        console.log('ERROR[electron-navigation][func "newTab();"]: The ID "' + options.id + '" already exists. Please use another one.');
        return false;
    }
    if (!(/^[A-Za-z]+[\w\-\:\.]*$/.test(options.id))) {
        console.log('ERROR[electron-navigation][func "newTab();"]: The ID "' + options.id + '" is not valid. Please use another one.');
        return false;
    }
    //build tab
    var tab = '<div class="etabs-tab active" data-session="' + this.SESSION_ID + '">';
    //favicon
    if (options.icon == 'clean') {
        tab += '<i class="etabs-tab-icon">' + this.SVG_FAVICON + '</i>';
    } else if (options.icon === 'default') {
        tab += '<img class="etabs-tab-icon" src=""/>';
    } else {
        tab += '<img class="etabs-tab-icon" src="' + options.icon + '"/>';
    }
    //title
    if(options.title == 'default'){
        tab += '<span class="etabs-tab-title"> . . . </span>';
    } else {
        tab += '<span class="etabs-tab-title">' + options.title + '</span';
    }
    //close
    if(options.close && globalCloseableTabsOverride){
        tab+= '<span class="etabs-tab-buttons"> <button class="etabs-tab-button-close">✖</button></span> '
    }

    //finish tab
    tab+= '</div>';

    $('#tabs').append(tab);

    //add webview

    let composedWebviewTag = `<webview class="etabs-view active" data-session="${this.SESSION_ID}" src="${this._purifyUrl(url)}"`;
    
    composedWebviewTag += ` data-readonly="${((options.readonlyUrl) ? 'true': 'false')}"`;
    if (options.id) {
        composedWebviewTag += ` id=${options.id}`;
    }
    if (options.node) {
        composedWebviewTag += " nodeintegration";
    }
    if (options.webviewAttributes) {
        Object.keys(options.webviewAttributes).forEach((key) => {
            composedWebviewTag += ` ${key}="${options.webviewAttributes[key]}"`;
        });
    }


    $('#etabs-views').append(`${composedWebviewTag}></webview>`);    
    // enable reload button
    $('#refresh').removeClass('disabled');

    //update url and add events
    this._updateUrl(this._purifyUrl(url));
    let newWebview = this._addEvents(this.SESSION_ID++, options);
    if(typeof options.postTabOpenCallback === "function"){
        options.postTabOpenCallback(newWebview)
    }
    (this.changeTabCallback || (() => {}))(newWebview);
    return newWebview;
} // :newTab()

//change current or specified tab and view

Navigation.prototype.changeTab = function(url, id){
    id = id || null;
    if(id == null){
        $('.etabs-view.active').attr('src', this._purifyUrl(url));
    } else {
        if($('#' + id).length){
            $('#' + id).attr('src', this._purifyUrl(url));
        } else{
            console.log('ERROR[electron-navigation][func "changeTab();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:changeTab()

//close current or specified tab and view

Navigation.prototype.closeTab = function(id) {
    id = id || null;

    var session;
    if(id == null){
        session = $('.etabs-tab.active, .etabs-view.active');
    } else {
        if($('#' + id).length){
            var sessionID = $('#' + id).data('session');
            session = $('.etabs-tab, .etabs-view').filter('[data-session="' + sessionID + '"]');
        } else{
            console.log('ERROR[electron-navigation][func "closeTab();"]: Cannot find the ID "' + id + '"');
            return false;
        }
    }
    if(session.next('.etabs-tab').length){
        session.next().addClass('active');
        (this.changeTabCallback || (() => {}))(session.next()[1]);
    } else{
        session.prev().addClass('active');
        (this.changeTabCallback || (() => {}))(session.prev()[1]);
    }

    session.remove();
    this._updateUrl();
    this._updateCtrls();
} //:closeTab()


//go back on current / specified view

Navigation.prototype.back = function(id){
    id = id || null;
    if(id == null){
        $('.etabs-view.active')[0].goBack();
    } else{
        if($('#' + id).length) {
            $('#' + id)[0].goBack();
        } else {
            console.log('ERROR[electron-navigation][func "back();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:back()

//go forward on current / specified view

Navigation.prototype.forward = function (id) {
    id = id || null;
    if (id == null) {
        $('.etabs-view.active')[0].goForward();
    } else {
        if ($('#' + id).length) {
            $('#' + id)[0].goForward();
        } else {
            console.log('ERROR[electron-navigation][func "forward();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:forward()


// reload current / specified view

Navigation.prototype.reload = function (id) {
    id = id || null;
    if (id == null) {
        $('.etabs-view.active')[0].reload();
    } else {
        if ($('#' + id).length) {
            $('#' + id)[0].reload();
        } else {
            console.log('ERROR[electron-navigation][func "reload();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:reload()


// stop loading current or specified view

Navigation.prototype.stop = function (id) {
    id = id || null;
    if (id == null) {
        $('.etabs-view.active')[0].stop();
    } else {
        if ($('#' + id).length) {
            $('#' + id)[0].stop();
        } else {
            console.log('ERROR[electron-navigation][func "stop();"]: Cannot find the ID "' + id + '"');
        }
    }
} //:stop()


// listen for a message from webview

Navigation.prototype.listen = function (id, callback) {
    let webview = null;
    //console.log('entering listen');

    //check id
    if ($('#' + id).length) {
        webview = document.getElementById(id);
        //console.log('checked id');
    } else {
        console.log('ERROR[electron-navigation][func "listen();"]: Cannot find the ID "' + id + '"');
    }

    // listen for message
    if (webview != null) {
        try {
            webview.addEventListener('ipc-message', (event) => {
                callback(event.channel, event.args, webview);
            });
        } catch (e) {
            //console.log('caught ' + e)
            webview.addEventListener("dom-ready", function (event) {
                webview.addEventListener('ipc-message', (event) => {
                    callback(event.channel, event.args, webview);
                });
            });
        }
    }
} //:listen()

// send message to webview

Navigation.prototype.send = function (id, channel, args) {
    let webview = null;

    // check id
    if ($('#' + id).length) {
        webview = document.getElementById(id);
    } else {
        console.log('ERROR[electron-navigation][func "send();"]: Cannot find the ID "' + id + '"');
    }

    // send a message
    if (webview != null) {
        try {
            webview.send(channel, args);
        } catch (e) {
            webview.addEventListener("dom-ready", function (event) {
                webview.send(channel, args);
            });
        }
    }
} //:send()


// open developer tools of current or ID'd webview

Navigation.prototype.openDevTools = function (id) {
    id = id || null;
    let webview = null;

    // check id
    if (id == null) {
        webview = $('.etabs-view.active')[0];
    } else {
        if ($('#' + id).length) {
            webview = document.getElementById(id);
        } else {
            console.log('ERROR[electron-navigation][func "openDevTools();"]: Cannot find the ID "' + id + '"');
        }
    }

    // open dev tools
    if (webview != null) {
        try {
            webview.openDevTools();
        } catch (e) {
            webview.addEventListener("dom-ready", function (event) {
                webview.openDevTools();
            });
        }
    }
} //:openDevTools()


// print current or specified tab and view

Navigation.prototype.printTab = function (id, opts) {
    id = id || null
    let webview = null

    // check id
    if (id == null) {
        webview = $('.etabs-view.active')[0]
    } else {
        if ($('#' + id).length) {
            webview = document.getElementById(id)
        } else {
            console.log('ERROR[electron-navigation][func "printTab();"]: Cannot find the ID "' + id + '"')
        }
    }

    // print
    if (webview != null) {
        webview.print(opts || {});
    }
}//:printTab()

//toggle next avail tab


Navigation.prototype.nextTab = function () {
    var tabs = $('.etabs-tab').toArray();
    var activeTabIndex = tabs.indexOf($('.etabs-tab.active')[0]);
    var nexti = activeTabIndex + 1;
    if (nexti > tabs.length - 1) nexti = 0;
    $($('.etabs-tab')[nexti]).trigger('click');
    return false
} //:nextTab()

// toggle previous available tab

Navigation.prototype.prevTab = function () {
    var tabs = $('.etabs-tab').toArray();
    var activeTabIndex = tabs.indexOf($('.etabs-tab.active')[0]);
    var nexti = activeTabIndex - 1;
    if (nexti < 0) nexti = tabs.length - 1;
    $($('.etabs-tab')[nexti]).trigger('click');
    return false
} //:prevTab()

// go to a tab by index or keyword

Navigation.prototype.goToTab = function (index) {
    $activeTabAndView = $('#tabs .etabs-tab.active, #etabs-views .etabs-view.active');

    if (index == 'previous') {
        $tabAndViewToActivate = $activeTabAndView.prev('#tabs .etabs-tab, #etabs-views .etabs-view');
    } else if (index == 'next') {
        $tabAndViewToActivate = $activeTabAndView.next('#tabs .etabs-tab, #etabs-views .etabs-view');
    } else if (index == 'last') {
        $tabAndViewToActivate = $('#tabs .etabs-tab:last-of-type, #etabs-views .etabs-view:last-of-type');
    } else {
        $tabAndViewToActivate = $('#tabs .etabs-tab:nth-of-type(' + index + '), #etabs-views .etabs-view:nth-of-type(' + index + ')');
    }

    if ($tabAndViewToActivate.length) {
        $('#url').blur();
        $activeTabAndView.removeClass('active');
        $tabAndViewToActivate.addClass('active');

        this._updateUrl();
        this._updateCtrls();
    }
} //:goToTab()

module.exports = Navigation;

navigation = new Navigation();







//handles bookmarks
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
    var favimage = document.createElement('img');
    favimage.src = this.icon;
    favimage.className = 'favicon';
    a_tag.insertBefore(favimage, a_tag.childNodes[0]);
    return a_tag;
}
//This adds the bookmark information to Bookmarks.json
function addBookmark () {
    let url = webview.src;
    let title = webview.getTitle();
    favicon(url).then(function(fav) {
        let book = new Bookmark(uuid.v1(), url, fav, title);
        jsonfile.readFile(bookmarks, function(err, curr) {
            curr.push(book);
            jsonfile.writeFile(bookmarks, curr, function (err) {
            })
        })
    })
}

//This controls the opening and closing of the Bookmarks screen.
function openPopUp (event) {
    CloseExtras();
    let state = popup.getAttribute('data-state');
    if (state === 'closed') {
        popup.innerHTML = '';
        jsonfile.readFile(bookmarks, function(err, obj) {
            if(obj.length !== 0) {
                for (var i = 0; i < obj.length; i++) {
                    let url = obj[i].url;
                    let icon = obj[i].icon;
                    let id = obj[i].id;
                    let title = obj[i].title;
                    let bookmark = new Bookmark(id, url, icon, title);
                    let el = bookmark.ELEMENT();
                    popup.appendChild(el);
                }
            }
                popup.style.display = 'block';
                popup.setAttribute('data-state', 'open');
        });
    } else {
        popup.style.display = 'none';
        popup.setAttribute('data-state', 'closed');
    }

    
}
//This handles the url transation from the bookmarks to omni.
function handleUrl (event) {
        popup.style.display = 'none';
        popup.setAttribute('data-state', 'closed');
    if (event.target.className === 'link') {
        event.preventDefault();
        webview.loadURL(event.target.href);
    } else if (event.target.className === 'favicon') {
        event.preventDefault();
        webview.loadURL(event.target.parentElement.href);
    }
}


//handles devtools for webview.
function handleDevtools () {
    CloseExtras();
    navigation.openDevTools();
}
//This takes the omni bar to update everytime the webview changes.
function updateNav (event) {
    omni.value = webview.src;
}

//These two functions open and close the extras overlay.
function OpenExtras() {
    document.getElementById("ExtrasWindow").style.width = "calc(100vw)";
}

function CloseExtras() {
    document.getElementById("ExtrasWindow").style.width = "0%";
}


//This manages the tabs bar.

var NewTab = ById('newTab');


    

// use tab[i] = view[i]
function focusTab(){
    
    
    console.log('focus tab complete')
    
}


//This allows you to scroll through the tabs horizontally instead of the usual virtical scroll.
(function() {
    function scrollHorizontally(e) {
        e = window.event || e;
        var delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));
        tabs.scrollLeft -= (delta*80); // Multiplied by 40
        e.preventDefault();
    }
    
    
        tabs.addEventListener('mousewheel', scrollHorizontally, false);
})();





//Creates the setting window when called on. Settings is currently handled in a different window.
function CreateSettingsView () {
        
    omni.blur();
    
    let winState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800

    })
    //let settingsSession = session.fromPartition('settingsWindow')
   // const settingsPath = path.join('file://', _dirname, '../settings/settings.html')
    let settingsWindow = new BrowserWindow({
        width: winState.width, 
        height: winState.Height,
        minWidth: 700,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
             webviewTag: true,
              electron: true},
        })
        //let session = settingsWindow.webContents.session;
        winState.manage(settingsWindow);
    settingsWindow.on('close', function(){settingsWindow = null})
    settingsWindow.loadFile('settings/Settings.html')
    settingsWindow.show();
 

    CloseExtras();
}

//Creates the SkyWrite Window. All extras will be opened in a new window for now.
//They will eventually be integrated into the browser window itself.
function CreateSkyWriteView () {

    omni.blur();
    
    let winState = windowStateKeeper({
        defaultWidth: 1000,
        defaultHeight: 800

    })

    //let skyWriteSession = session.fromPartition('skyWriteWindow')
    // const settingsPath = path.join('file://', _dirname, '../settings/settings.html')
     let skyWriteWindow = new BrowserWindow({
         width: winState.width,
          height: winState.height,
        minWidth: 700,
        minHeight: 600,
        webPreferences: {
            nodeIntegration: true,
             webviewTag: true,
              electron: true,
              path: true,
               },

        })


      //  let session = settingsWindow.webContents.session;
        winState.manage(skyWriteWindow);
     skyWriteWindow.on('close', function(){skyWriteWindow = null})
     skyWriteWindow.loadFile('Extras/SkyWrite.html');

     skyWriteWindow.show();
   
     CloseExtras();
}




//event listeners

fave.addEventListener('click', addBookmark);
list.addEventListener('click', OpenExtras);
favorites.addEventListener('click', openPopUp);
popup.addEventListener('click', handleUrl);
dev.addEventListener('click', handleDevtools);
closeExtras.addEventListener('click', CloseExtras);
settings.addEventListener('click', CreateSettingsView);
skyWrite.addEventListener('click', CreateSkyWriteView);

