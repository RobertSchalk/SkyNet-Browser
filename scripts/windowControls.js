const { remote} = require('electron');

//Window controls
const minimize = document.getElementById('minimize'),
resize = document.getElementById('resize'),
close = document.getElementById('close');

//updates resize button
function resizeButton(){
    const currentWindow = remote.getCurrentWindow()
    if(currentWindow.isMaximized()){
        document.getElementById('resizeSpan').style.display = 'block';
        document.getElementById('resizeSpan2').style.left = '3px';
        document.getElementById('resizeSpan2').style.top = '5px';
        document.getElementById('resizeSpan2').style.width = '7px';
        document.getElementById('resizeSpan2').style.height = '7px';
    }else{
        document.getElementById('resizeSpan').style.display = 'none';
        document.getElementById('resizeSpan2').style.left = '0';
        document.getElementById('resizeSpan2').style.top = '7px';
        document.getElementById('resizeSpan2').style.width = '7px';
        document.getElementById('resizeSpan2').style.height = '7px';
    }
    }
    resizeButton();





window.addEventListener('resize', resizeButton)
minimize.addEventListener('click', () =>{
    remote.getCurrentWindow().minimize();
});
resize.addEventListener('click', () =>{
    const currentWindow = remote.getCurrentWindow()
    if(currentWindow.isMaximized()){
        currentWindow.unmaximize();
    }else{
        currentWindow.maximize()
    }
})
close.addEventListener('click',() =>{
    remote.app.quit();
});