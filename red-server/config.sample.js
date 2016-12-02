module.exports = {

    secret: 'a secret phrase',

    github:{
	CLIENT_ID: "[yourgithubclientid]",
    	CLIENT_SECRET: "[yourgithubclientsecret]",
    	CALLBACK: "[githubcallbackurl]",
 	API: "https://api.github.com",
        RAW_URL: "https://raw.githubusercontent.com",
        URL: "https://github.com",
    },
    
    appstore: {
                URL: 'http://store.upintheclouds.org'
    },
    
    registry: {
                URL: 'registry.upintheclouds.org'
    },

    mongo:{
    	url : 'mongodb://localhost/passport',
    },
    
    redis: {
   	 host: '127.0.0.1',
         port: 6379,
    }
}
