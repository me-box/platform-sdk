import fs from 'fs';

export function fetch(options={}){

   return new Promise((resolve, reject)=>{

        fs.readFile("./conf/settings.json", 'utf8', function(err, data){
                if (err){
                    return write(JSON.stringify(options.dev ? defaultdevsettings() : defaultsettings(),null,4));
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

export function defaultdevsettings(){        
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
                        "URL": "http://localhost:8091"
                },

                "registry": {
                        "URL": ""
                },

                "mongo": {
                        "URL" : "mongodb://localhost:27017"
                },

                "redis": {
                        "host": "localhost",
                        "port": 6379
                },

                "testserver": {
                        "URL": "http://localhost:9090"
                }

        }
}

export function defaultsettings(){        
        return {

                "secret": "asjhgdsajhd6sa7d78as6s87adsakgdsadgaskdgsagdk",

                "github": {
                        "CLIENT_ID": "",
                        "CLIENT_SECRET": "",
                        "CALLBACK": "http://localhost:8086/auth/github/callback",
                        "API": "https://api.github.com",
                        "RAW_URL": "https://raw.githubusercontent.com",
                        "URL": "https://github.com"
                },

                "appstore": {
                        "URL": ""
                },

                "registry": {
                        "URL": ""
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
