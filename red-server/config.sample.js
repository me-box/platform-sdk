module.exports = {
	secret: 'a secret phrase',
	GITHUB_CLIENT_ID: [yourgithubclientid],
    GITHUB_CLIENT_SECRET: [yourgithubclientsecret],
    mongourl : 'mongodb://localhost/passport',
    redis: {
   		 host: 127.0.0.1,
         port: 6379,
         pass: //create a long password here e.g. echo "a long password" | sha256sum
    }
}