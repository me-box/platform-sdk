module.exports = {

    secret: 'a secret phrase',

    github:{
	CLIENT_ID: [yourgithubclientid],
    	CLIENT_SECRET: [yourgithubclientsecret],
    	CALLBACK: [githubcallbackurl]
    },
    
    appstore: {
                URL: 'http://store.upintheclouds.org'
    },

    red: {
        URL : 'http://127.0.0.1:1880',
    },

    mongo:{
    	url : 'mongodb://localhost/passport',
    },
    
    redis: {
   	 host: '127.0.0.1',
         port: 6379,
         //pass: create a long password here e.g. echo "a long password" | sha256sum
    }
}
