import express from 'express';
import request from 'superagent';
import config from '../config.js';

const router = express.Router();

//list all apps owned by this user
router.get('/repos', function(req,res){
	
	const user = req.user;
	
	request
   		.get(`${config.github.API}/users/${user.username}/repos`)
   		.set('Accept', 'application/json')
   		.set('Authorization', `token ${req.user.accessToken}`)
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
		.set('Authorization', `token ${req.user.accessToken}`)
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
	var name 		= req.body.name.startsWith("databox.") ? req.body.name : `databox.${req.body.name}`;
	var description = req.body.description || "";
	var isprivate   = false;
	var content     = req.body.flows || [];
	var commit 	= req.body.message || "first commit";
	
	return new Promise((resolve,reject)=>{
		
		request
   			.post(`${config.github.API}/user/repos`)
   			.send({
  				"name": name,
  				"description": description,
  				"private": isprivate,
  				"has_issues": false,
  				"has_wiki": false,
  				"has_downloads": false
			})
   			.set('Authorization', `token ${req.user.accessToken}`)
   			.set('Accept', 'application/json')
   			.end((err, data)=>{
     			if (err) {
       				console.log('error creating repo!');
       				console.log(err);
       				reject(err);
     			} 
     			else {
     			 	
     			 	const result = data.body;
     			 	
     			 	console.log("successfully created repo");
     			 	console.log({
       						name: result.name, 
       						updated: result.updated_at, 
       						icon:result.owner.avatar_url, 
       						url:result.url
       				});
     			 	
     			 	
       				resolve({
       						name: result.name, 
       						updated: result.updated_at, 
       						icon:result.owner.avatar_url, 
       						url:result.url
       				});
     			}
   			})
   	}).then( repo => {
   	    
   		//we need to wait a bit here before creating afirst commit, else might find that repo hasn't been created
   		
   		console.log("..now writing flows");
   		console.log(`${config.github.API}/repos/${user.username}/${repo.name}/contents/flows.json`);
   		
   		console.log(content);
   		
   		return new Promise((resolve, reject)=>{
   			
   			console.log("waiting 2s before commit");
   			
   			setTimeout(
   				function(){
				  console.log("committing now");
				  request
						.put(`${config.github.API}/repos/${user.username}/${repo.name}/contents/flows.json`)
						.send({
							"message": commit,
							"committer": {
							"name": user.username,
							"email": req.user.email || `${req.user.username}@me-box.com`
						},
						"content": new Buffer(JSON.stringify(content)).toString('base64'),
						})
						.set('Authorization', `token ${req.user.accessToken}`)
						.set('Accept', 'application/json')
						.end((err, res)=>{
							if (err) {
								console.log("---error creating first commit!----");
								console.log(err.body);
							} else {
								console.log(JSON.stringify(res.body));
							}
						}) 
   				  }
   			 ,2000);
   			
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
    					"email": req.user.email || `${req.user.username}@me-box.com`
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