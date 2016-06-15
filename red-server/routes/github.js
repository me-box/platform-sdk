import express from 'express';
import request from 'superagent';
const router = express.Router();

//list all apps owned by this user
router.get('/repos', function(req,res){
	
	const user = req.user;
	
	request
   		.get(`${config.github.API}/users/${user.username}/repos`)
   		.set('Accept', 'application/json')
   		.end((err, data)=>{
     		if (err){
     			console.log(err);
     			res.err(err);
     		}else{
     			res.send(data.body.map(function(repo){
       				return {
       							name: repo.name, 
       							updated: repo.updated_at, 
       							icon:repo.owner.avatar_url, 
       							url:repo.url
       				} 
       			}).filter(function(repo){
       				return repo.name.startsWith("databox");
       			}));
       		}
   		})
});

//load up an app from a repo
router.get('/flow', function(req,res){
	
	const repo = req.query.repo;
	const user = req.user;
	
	request
		.get(`${config.github.API}/repos/${user.username}/${repo}/contents/flows.json`)
		.set('Accept', 'application/json')
		.end((err, data)=>{
			if (err || !data.ok) {
				console.log('error');
				console.log(err);
				res.send({success:false});
			} else {
				const jsonstr = new Buffer(data.body.content, 'base64').toString('ascii')
				res.send(JSON.parse(jsonstr));
			}
		});
});

//create a new 'app' (i.e a github repo prefixed with 'databox.').  Will also create a new empty flows.json file.
//returns repo : {repodetails}, flow: {flowdetails}

//perhaps this should also automatically create the docker file.  Or should we create a published branch or
// published repo for all PUBLISHED repos?
router.post('/repo/new', function(req,res){
	var user 		= req.user;
	var repo 		= req.body.repo.startsWith("databox.") ? req.body.repo : `databox.${req.body.repo}`;
	var description = req.body.description || "";
	var homepage    = req.body.homepage || "";
	var isprivate   = req.body.isprivate || false;
	var content     = req.body.flow || [];
	var message 	= req.body.message || "first commit";
	
	return new Promise((resolve,reject)=>{
		
		request
   			.post(`${config.github.API}/user/repos`)
   			.send({
  				"name": repo,
  				"description": description,
  				"homepage": homepage,
  				"private": isprivate,
  				"has_issues": false,
  				"has_wiki": false,
  				"has_downloads": false
			})
   			.set('Authorization', `token ${req.user.accessToken}`)
   			.set('Accept', 'application/json')
   			.end((err, data)=>{
     			if (err || !res.ok) {
       				console.log('error');
       				reject(error);
     			} 
     			else {
       				resolve({
       						name: data.name, 
       						updated: data.updated_at, 
       						icon:data.owner.avatar_url, 
       						url:data.url
       				});
     			}
   			})
   	}).then( repo => {
   		
   		return new Promise((resolve, reject)=>{
   			request
   				.put(`${config.github.API}/repos/${user.username}/${repo.name}/contents/flows.json`)
   				.send({
  					"message": message,
 					"committer": {
    					"name": user.username
  					},
  					"content": new Buffer(JSON.stringify(content)).toString('base64'),
				})
   				.set('Authorization', `token ${req.user.accessToken}`)
   				.set('Accept', 'application/json')
   				.end((err, res)=>{
     				if (err || !res.ok) {
       					console.log('error');
       					console.log(err);
     				} else {
       					console.log(JSON.stringify(res.body));
     				}
   				})
   		})
   	})
   
});

router.post('/repo/update', function(req, res){
	
	var user = req.user;
	var repo = req.body.repo;
	var content = new Buffer(JSON.stringify(req.body.flow)).toString('base64');
	var sha = rep.body.sha;
	var message = req.body.message || "checkpoint commit";
	
	request
   			.put(`${config.github.API}/repos/${user.username}/${repo}/contents/flows.json`)
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
   			.end((err, data)=>{
     			if (err || !res.ok) {
       				console.log('error');
       				console.log(err);
     			} else {
       				res.send(data.content.sha);
     			}
   			});
	
});

router.post('/publish', function(req,res){
	
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

module.exports = router;