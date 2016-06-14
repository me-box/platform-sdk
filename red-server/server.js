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

//list all apps owned by this user
app.get('/repos', ensureAuthenticated, function(req,res){
	request
   		.get('https://api.github.com/users/' + req.user.username + '/repos')
   		.set('Accept', 'application/json')
   		.end(function(err, data){
     		if (err || !data.ok) {
       			console.log('error');
       			console.log(err);
     		} else {
       			res.send(data.body.map(function(repo){
       				return {name: repo.name, updated: repo.updated_at, icon:repo.owner.avatar_url, url:repo.url} 
       			}).filter(function(repo){
       				return repo.name.startsWith("databox");
       			}));
     		}
   		});
});

//load up an app from a repo
app.get('/repo', ensureAuthenticated, function(req,res){
	
	var repo = req.query.repo;
	
	request
		.get('https://api.github.com/repos/' + req.user.username + '/' + appname + '/contents/flows.json')
		.set('Accept', 'application/json')
		.end(function(err, data){
			if (err || !data.ok) {
				console.log('error');
				console.log(err);
			} else {
				var jsonstr = new Buffer(data.body.content, 'base64').toString('ascii')
				res.send(JSON.parse(jsonstr));
			}
		});
});

//create a new 'app' (i.e a github repo prefixed with 'databox.').  Will also create a new empty flows.json file.
//returns repo : {repodetails}, flow: {flowdetails}

//perhaps this should also automatically create the docker file.  Or should we create a published branch 
// published repo for all PUBLISHED repos?
app.post('/repo/new', ensureAuthenticated, function(req,res){
	
	var repo = req.body.repo.startsWith("databox.") ? req.body.repo : "databox."+req.body.repo;
	var description = req.body.description || "";
	var homepage = req.body.homepage || "";
	var isprivate = req.body.isprivate || false;
	
	
	//need to make this thenable! and to create a new flows file?
	
	request
   		.post('https://api.github.com/user/repos')
   		.send({
  				"name": repo,
  				"description": description,
  				"homepage": homepage,
  				"private": isprivate,
  				"has_issues": false,
  				"has_wiki": false,
  				"has_downloads": false
		})
   		.set('Authorization', 'token ' + req.user.accessToken)
   		.set('Accept', 'application/json')
   		.end(function(err, data){
     		if (err || !res.ok) {
       			console.log('error');
       			console.log(err);
     		} else {
       			res.send({
       						name: data.name, 
       						updated: data.updated_at, 
       						icon:data.owner.avatar_url, 
       						url:data.url
       			});
     		}
   		});
   	
     var content = new Buffer(JSON.stringify([])).toString('base64')
   	 /*request
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
   			});*/
});

app.post('/repo/update', ensureAuthenticated, function(req, res){
	
	var repo = req.body.repo;
	var content = new Buffer(JSON.stringify(req.body.flow)).toString('base64');
	var sha = rep.body.sha;
	var message = req.body.message || "checkpoint commit";
	
	request
   			.put('https://api.github.com/repos/' + req.user.username + '/' + repo + '/contents/flows.json')
   			.send({
  					"message": message,
 					"committer": {
    					"name": req.user.username,
    					//"email": "tlodge@gmail.com" //get the emai
  					},
  					"content": content,
  					"sha":sha,
			})
   			.set('Authorization', 'token ' + req.user.accessToken)
   			.set('Accept', 'application/json')
   			.end(function(err, data){
     			if (err || !res.ok) {
       				console.log('error');
       				console.log(err);
     			} else {
       				res.send(data.content.sha);
     			}
   			});
	
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
   		request
   			.get('https://api.github.com/users/' + req.user.username + '/repos')
   			.set('Accept', 'application/json')
   			.end(function(err, data){
     			if (err || !data.ok) {
       				console.log('error');
       				console.log(err);
     			} else {
     				console.log(data.body.filter(function(repo){
       					return repo.name.startsWith("databox.");
       				}));
       				
       				res.send(data.body.filter(function(repo){
       					return repo.name.startsWith("databox.");
       				}));
     			}
   			});	
   			
   		//list contents
   		//GET /repos/:owner/:repo/contents/:path
   		/*request
   			.get('https://api.github.com/repos/' + req.user.username + '/databox-hello-world/contents/test.json')
   			.set('Accept', 'application/json')
   			.end(function(err, data){
     			if (err || !data.ok) {
       				console.log('error');
       				console.log(err);
     			} else {
     				var jsonstr = new Buffer(data.body.content, 'base64').toString('ascii')
     				console.log(JSON.parse(jsonstr));
     			}
   			});	*/
   			 
   		
});

server.listen(8080);
