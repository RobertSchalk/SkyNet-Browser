
var ById = function (id) {
    return document.getElementById(id);
}


var settingsView = ById('settingsView'),
    about = ById('about'),
    appearance = ById('appearance'),
    privacy = ById('privacy');


    
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

