var ById = function (id) {
    return document.getElementById(id);
}

function CountTabs(){
    
    var nt = ById('newTab');
    
    
        nt.title = 'Create New Tab :\nTabs currently open: ' + currentTabs + '\nTotal tabs opened during this session: ' + totalTabs;
    
    }


    module.exports = CountTabs();