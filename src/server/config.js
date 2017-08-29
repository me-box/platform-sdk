import fs from 'fs';

export function fetch(){
   return new Promise((resolve, reject)=>{

        fs.readFile("./conf/settings.json", 'utf8', function(err, data){
                if (err){
                    console.log("am here ---->>>>> ");
                    return write(JSON.stringify(defaultsettings(),null,4));
                }
                try{
                        const settings = JSON.parse(data);
                        resolve(settings);
                }catch(err){
                        console.log("error reading settings file!", err);   
                        reject(defaultsettings());
                };
        });
   });
}

export function write(file){
        return new Promise((resolve, reject)=>{
                fs.mkdir("./conf", function(){

                    fs.writeFile("./conf/settings.json", file, function(err) {
                        if (err){
                            console.log("hmmm error writing conf/settings.json")
                            reject(JSON.parse(file));
                        }
                        resolve(JSON.parse(file));
                    });
                });
        });   
}

export function defaultsettings(){        
        return {

                "secret": "asdaksgdsahgdhsagd ahjsgdjhsg",

                "github": {
                        "CLIENT_ID": "",
                        "CLIENT_SECRET": "",
                        "CALLBACK": "http://localhost:8086/auth/github/callback",
                        "API": "https://api.github.com",
                        "RAW_URL": "https://raw.githubusercontent.com",
                        "URL": "https://github.com"
                },

                "appstore": {
                        "URL": "http://app-server:8091"
                },

                "registry": {
                        "URL": "registry:5000"
                },

                "mongo": {
                        "URL" : "mongodb://mongo:27017"
                },

                "redis": {
                        "host": "redis",
                        "port": 6379
                },

                "testserver": {
                        "URL": "http://localhost:9090"
                }

        }
}
