const electron  = require('electron');
const path = require('path');
const fs= require('fs');

class Store{
    constructor(opts){
        //Renderer process has to get 'app' module via 'remote', whereas the main process can get it directly.
        const userDataPath = (electron.app || electron.remote.app).getPath('userData');
        this.path = path.join((userDataPath, opts.config) + '.json');

        this.data = parseDataFile(this.path, opts.defaults);
    }

    //returns property on the data object
    
    get(key) {
        
        return this.data[key];
    
    }
    //sets the property
    set(key, val){
        this.data[key] = val;
        
        fs.writeFileSync(this.path, JSON.stringify(this.data));
        
    }
}

function parseDataFile(filePath, defaults){
    try{
        return JSON.parse(fs.readFileSync(filePath));
        
    } catch(error){
        return defaults;
    }
}

module.exports = Store;


