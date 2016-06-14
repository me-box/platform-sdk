var http = require('http');
var express = require('express');
var expressSession = require('express-session');
var RedisStore = require('connect-redis')(expressSession);

var bodyparser = require('body-parser');
var config = require('./config');
var mongoose = require('mongoose');
var request = require('superagent');

mongoose.connect(config.mongourl);

var app = express();

//to support posts!
app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());


app.use(expressSession(
                      {
                        store: new RedisStore({
                          host: config.redis.host,
                          port: config.redis.port,
                          disableTTL: true,
                          pass: config.redis.pass || undefined,
                        }),
                        key: 'express.sid',
                        resave: false,
                        rolling: false,
                        saveUninitialized:false, //else passport will save empty object to store, which forces logout!
                        cookie:{
                            maxAge: 2*24*60*60*1000, //2 days
                        },
                        secret: config.secret,
                      }
));


app.use('/', express.static("static"));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
var server = http.createServer(app);

function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
    return  next(null);
  }
  res.redirect("/editor/auth/github");
}

require("./routes/auth")(app);

app.get('/', ensureAuthenticated, function(req,res){
  	res.render('index');
});

app.post('/publish', ensureAuthenticated, function(req,res){
	
	var content = new Buffer(JSON.stringify(req.body)).toString('base64')
	
	//create a new repo
	/*request
   		.post('https://api.github.com/user/repos')
   		.send({
  					"name": "databox-hello-world",
  					"description": "This is your first repository",
  					"homepage": "https://github.com/tlodge",
  					"private": false,
  					"has_issues": true,
  					"has_wiki": true,
  					"has_downloads": true
		})
   		.set('Authorization', 'token ' + req.user.accessToken)
   		.set('Accept', 'application/json')
   		.end(function(err, res){
     		if (err || !res.ok) {
       			console.log('error');
       			console.log(err);
     		} else {
       			console.log(JSON.stringify(res.body));
     		}
   		});*/
   		
   			
   		//add a new file to a repo
   		/*
   		request
   			.put('https://api.github.com/repos/' + req.user.username + '/databox-hello-world/contents/test.json')
   			.send({
  					"message": "test commit!",
 					"committer": {
    					"name": "tlodge",
    					"email": "tlodge@gmail.com"
  					},
  					"content": content,
			})
   			.set('Authorization', 'token ' + req.user.accessToken)
   			.set('Accept', 'application/json')
   			.end(function(err, res){
     			if (err || !res.ok) {
       				console.log('error');
       				console.log(err);
     			} else {
       				console.log(JSON.stringify(res.body));
     			}
   			});
   		*/
   		
   		//list repos
   		/*request
   			.get('https://api.github.com/users/' + req.user.username + '/repos')
   			.set('Accept', 'application/json')
   			.end(function(err, data){
     			if (err || !data.ok) {
       				console.log('error');
       				console.log(err);
     			} else {
     				console.log(data.body.filter(function(repo){
       					return repo.name.startsWith("databox");
       				}));
       				
       				res.send(data.body.filter(function(repo){
       					return repo.name.startsWith("databox");
       				}));
     			}
   			});	*/
   			
   		//list contents
   		//GET /repos/:owner/:repo/contents/:path
   		request
   			.get('https://api.github.com/repos/' + req.user.username + '/databox-hello-world/contents/test.json')
   			.set('Accept', 'application/json')
   			.end(function(err, data){
     			if (err || !data.ok) {
       				console.log('error');
       				console.log(err);
     			} else {
     				console.log(data.body);
     			}
   			});	
   			 
   		
});

server.listen(8080);
