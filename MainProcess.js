

function loadUrl() {
    document.getElementById("urlDisplay").src = document.getElementById("urlSource").value;
    
}

function UrlKeyDown(event) {
    var x = event.keyCode;
    if(x == 13) {
        loadUrl();
    }
}



function PreviousWindow(){
    
    document.getElementById("urlDisplay").src = currentBrowsingHistory[current--];
    current--;

}


