import express from 'express';
import request from 'superagent';
import config from '../config.js';

const router = express.Router();



const _createRepo = function(name, description, isprivate, accessToken){
 	
 	console.log("creating repo..." + name);
 	
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
   			.set('Authorization', `token ${accessToken}`)
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
       				
     			 	//give github time it needs to set up repo
     			 	
     			 	setTimeout(
     			 		function(){
							resolve({
								name: result.name, 
								updated: result.updated_at, 
								icon:result.owner.avatar_url, 
								url:result.url
							})       					
       					},2000
       				);
     			}
   			})
   	});
} 


const _addFile = function(options){
	
	const {username, repo, filename, message, email, content, accessToken} = options;
	
	return new Promise((resolve, reject)=>{
	  request
			.put(`${config.github.API}/repos/${username}/${repo}/contents/${filename}`)
			.send({
				"message": message,
				"committer": {
					"name": username,
					"email": email,
				},
				"content": content,
			})
			.set('Authorization', `token ${accessToken}`)
			.set('Accept', 'application/json')
			.end((err, res)=>{
				if (err) {
					console.log("---error creating first commit!----");
					reject(err);
				} else {
					resolve(res.body);
				}
			})    					
   	})	
}

const _saveToAppStore = function(manifest){
	return new Promise((resolve, reject)=>{
		request
  			.post(`${config.appstore.URL}/app/post`)
  			.send(manifest)
  			.set('Accept', 'application/json')
  			.type('form')
  			.end(function(err, res){
  				if (err){
  					console.log(err);
  					reject(err);
  				}else{
          			resolve(res.body);
  	 			}
  	 		})	
  	});
}

const _generateManifest = function(user, reponame, app, packages, forbidden){
	return  {
				'manifest-version': 1,
				name: app.name,
				version: "0.1.0",
				description: app.description,
				licence: "MIT",
				tags: app.tags.split(","),
				homepage: `${config.github.URL}/${user.username}/${reponame}`,
				repository:{
					type: 'git',
					url: `git+${config.github.URL}/${user.username}/${reponame}.git`
				},
			
				packages: packages.map((pkg)=>{
					return {
						id: pkg.id,
						name: pkg.name,
						description: pkg.description,
						required: pkg.install === "compulsory",
						'driver-permissions': Array.from(new Set([...pkg.datastores.map((d)=>{return d.type}), ...pkg.outputs.map((o)=>{return o.type})])),
						risks: pkg.risk,
						benefits: pkg.benefits,
					}
				}),
				
				'forbidden-combinations' : forbidden,
			}	
}

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
	
	return new Promise((resolve,reject)=>{
		
		request
			.get(`${config.github.API}/repos/${user.username}/${repo}/commits`)
			.set('Accept', 'application/json')
			.set('Authorization', `token ${req.user.accessToken}`)
			.end((err, data)=>{
				if (err || !data.ok) {
					reject(err);
				} else {
					const commits = data.body;
					resolve(commits[0].sha);
				}
			});	
	
	}).then((commit)=>{
	
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
					res.send({
								flows: JSON.parse(jsonstr),
								commit: {
											sha: commit,
											name: repo,	
										}	
							 });
				}
			});			
	});
	//first retrieve the latest sha of this commit
	
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
	var message 	= req.body.message || "first commit";
	
	return _createRepo(name, description, isprivate, req.user.accessToken).then( repo => {    
   		return _addFile({
   							username: user.username,
   							repo: repo.name, 
   							filename: 'flows.json',
   							email: req.user.email || `${req.user.username}@me-box.com`,
   							message: message,
   							content: new Buffer(JSON.stringify(content)).toString('base64'),
   							accessToken: req.user.accessToken,
   						})
   	}).then((commit)=>{
   		console.log("committed!!");
  		console.log(commit) 		
   	});   
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
	
	console.log(req.body);
	const repo = req.body.repo;
	const manifest = req.body.manifest;
	const app = manifest.app;
	const packages = manifest.packages;
	const forbidden = manifest['forbidden-combinations'];
	const description = manifest.app.description;
	
	const REPONAME = `dbapp.${app.name}`;
	
	const user = req.user;
	//need to create a new docker file
	const dcommands = [
							"FROM databox/red", 
							`ADD ${config.github.RAW_URL}/${user.username}/${repo.name}/${repo.sha}/flows.json /root/.node-red/flows.json`,
							"EXPOSE 1880", 
							"CMD ['node', '/root/node-red/red.js']"
					   ]	
	
	
	const dockerfile = dcommands.join("\n");
	
	
	const data = {
						manifest: _generateManifest(req.user, REPONAME, app, packages, forbidden),
										
						poster: {
								username: req.user.username,
						},
										
						postDate:  (new Date()).toISOString(),
										
						queries: 0,
					  } 
		
	console.log({manifest: JSON.stringify(data)});
						

	return _createRepo(REPONAME, description, false, req.user.accessToken).then( (repo)=>{
		return _addFile({
   							username: user.username,
   							repo: repo.name, 
   							filename: 'Dockerfile',
   							email: req.user.email || `${req.user.username}@me-box.com`,
   							message: 'first commit',
   							content: new Buffer(dockerfile).toString('base64'),
   							accessToken: req.user.accessToken,
   						})
	
	}).then(function(commit){
		//user, repo, app, packages, forbidden
		const data = {
						manifest: _generateManifest(req.user, REPONAME, app, packages, forbidden),
										
						poster: {
								username: req.user.username,
						},
										
						postDate:  (new Date()).toISOString(),
										
						queries: 0,
					  } 
		
		console.log({manifest: JSON.stringify(data)});
						
		return _saveToAppStore({manifest: JSON.stringify(data)}); 	
		
	}).then(function(result){
		console.log(result);
	});
});

module.exports = router;