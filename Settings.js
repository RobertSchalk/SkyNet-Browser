
var ById = function (id) {
    return document.getElementById(id);
}


var settingsView = ById('settingsView'),
    about = ById('about'),
    appearance = ById('appearance'),
    privacy = ById('privacy');


    function openSettings() {
        document.getElementById("SettingsWindow").style.width = "calc(100vw)";
    }
    
    function closeSettings() {
        document.getElementById("SettingsWindow").style.width = "0%";
    }

    function AboutView () {
        
            omni.blur();
            view.src = ("About.html");
            closeSettings();
    }
    function AppearanceView () {
        
            omni.blur();
            view.src = ("Appearance.html");
            closeSettings();
    }
    
    function PrivacyView () {
        
        omni.blur();
        view.src = ("privacy.html");
        closeSettings();
    }

    

    /*
    appearance.addEventListener('click', AppearanceView);
    privacy.addEventListener('click', PrivacyView);
    about.addEventListener('click', AboutView);*/

    var version = app.getVersion();