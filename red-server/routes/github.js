import express from 'express';
import request from 'superagent';
import config from '../config.js';
import zlib from 'zlib';
import fs from 'fs';
import tar from 'tar-stream';
import Docker from 'dockerode';

const router = express.Router();
const gzip   = zlib.createGzip();
const docker = new Docker({socketPath: '/var/run/docker.sock'});


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
       				console.log('am here error creating repo!');
       				reject(err);
     			} 
     			else {
     			 	
     			 	const result = data.body;
     			 	
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
				id: app.id,
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
						purpose: pkg.purpose,
						required: pkg.install === "compulsory",
						'driver-permissions': Array.from(new Set([...pkg.datastores.map((d)=>{return d.type}), ...pkg.outputs.map((o)=>{return o.type})])),
						risks: pkg.risk,
						benefits: pkg.benefits,
					}
				}),
				
				'forbidden-combinations' : forbidden,
			}	
}

const _createTarFile = function(dockerfile, path){
		
	return new Promise((resolve, reject)=>{
		
		var tarball = fs.createWriteStream(path);
		
		console.log("creating dockerfile and adding to registry!");
		const pack   = tar.pack();
		
		pack.entry({name: 'Dockerfile'}, dockerfile, function(err){
        	if (err){
        	   reject(err);
        	}
        	pack.finalize();
        	const stream = pack.pipe(gzip).pipe(tarball);
		
			stream.on('finish', function (err) {
				resolve(path);
			});	
		});
	});
		
}

const _createDockerImage = function(tarfile, name){
	return new Promise((resolve, reject)=>{
		docker.buildImage(tarfile, {t: `localhost:5000/${name}`}, function (err, output){
			if (err){
				console.warn(err);
				reject(err);
			}
			output.pipe(process.stdout);
			output.on('end', function() {
				var image = docker.getImage(`localhost:5000/${name}`);
				image.push({
					registry : 'localhost:5000'
				}, function(err, data) {
					data.pipe(process.stdout);
					if (err){
						reject(err)
					}
					resolve();
				});
			});
		});
	});
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
					res.send({result:'error', error:err});
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
					res.send({result:'error', error:err});
				} else {
					const jsonstr = new Buffer(data.body.content, 'base64').toString('ascii')
					res.send({
								result: 'success',
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
   	},(err)=>{
   		res.send({result:'error', error:'could not create the repo'});
  	}).then((commit)=>{
   		
   		res.send({
   			result: 'success',
   			commit: {
   				sha: commit.commit.sha,
   				name: name,
   			}
   		});	
   	}, (err)=>{
   		res.send({result:'error', error:'could not perform a first commit on the repo'});
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
       				res.status(500).send({error:'could not update the repo'});
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
	
	const REPONAME = app.name;
	
	const user = req.user;
	//need to create a new docker file
	const dcommands = [
							"FROM databox/red", 
							`ADD ${config.github.RAW_URL}/${user.username}/${repo.name}/${repo.sha}/flows.json /root/.node-red/flows.json`,
							'LABEL databox.type="app"',
							`LABEL databox.manifestURL="${config.appstore.URL}/${REPONAME}/manifest.json"`,
							"EXPOSE 8080",
							`CMD ["node", "/root/node-red/red.js"]`
					   ]	
	
	
	const dockerfile = dcommands.join("\n");
	

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
	
	},(err)=>{
   		res.status(500).send({error:'could not create the repo'});
  	}).then(function(commit){
		const data = {
						manifest: JSON.stringify(_generateManifest(req.user, REPONAME, app, packages, forbidden)),
										
						poster: JSON.stringify({
								username: req.user.username,
						}),
										
						postDate:  JSON.stringify((new Date()).toISOString()),
										
						queries: JSON.stringify(0),
					  } 
		
		
						
		return _saveToAppStore(data); 	
		
	},(err)=>{
   		res.status(500).send({error:'could not save to app store'});
  	}).then(function(result){
		var path = "tmp.tar.gz";
		return _createTarFile(dockerfile, path);
	},(err)=>{
   		res.status(500).send({error: 'could not create tar file'});
  	}).then(function(tarfile){
		return _createDockerImage(tarfile, REPONAME);
	},(err)=>{
   		res.status(500).send({error: 'could not create docker file'});
  	}).then(function(){
		res.send({success:true});
	});
});

module.exports = router;