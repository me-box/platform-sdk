module.exports = {

    secret: 'a secret phrase',

    github:{
	    CLIENT_ID: "[yourgithubclientid]",
    	CLIENT_SECRET: "[yourgithubclientsecret]",
    	CALLBACK: "http://localhost/auth/github/callback",
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
    	url : 'mongodb://mongo/passport',
    },
    
    redis: {
   	    host: 'redis',
        port: 6379,
    }
}
