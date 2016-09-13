import express from 'express';
import request from 'superagent';
import config from '../config.js';
import zlib from 'zlib';
import fs from 'fs';
import tar from 'tar-stream';
import docker from '../utils/docker';

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
					console.log(res.body);
					resolve(Object.assign({},res.body, {repo:repo}));
				}
			})    					
   	})	
}

const _fetchFile = function(username, accessToken, repo, filename){
	return new Promise((resolve,reject)=>{
		request
			.get(`${config.github.API}/repos/${username}/${repo}/contents/${filename}`)
			.set('Accept', 'application/json')
			.set('Authorization', `token ${accessToken}`)
			.end((err, data)=>{
				if (err || !data.ok) {
					reject(err);
				} 
				else {	
					const jsonstr = new Buffer(data.body.content, 'base64').toString('ascii')
					resolve({content: JSON.parse(jsonstr), sha: data.body.sha});
				}
			});		
	});
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
		const gzip   = zlib.createGzip();
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
router.get('/repos/:user', function(req,res){
	console.log("am in here!!");
	const user = req.user;
	const username = req.params.user;
	
	request
   		.get(`${config.github.API}/users/${username}/repos`)
   		.set('Accept', 'application/json')
   		.set('Authorization', `token ${req.user.accessToken}`)
   		.end((err, data)=>{
     		if (err){
     			console.log(err);
     			res.status(500).send({error:'could not retrieve repos'});
     		}else{
     			res.send(data.body.map(function(repo){
       				return {
       							name: repo.name, 
       							updated: repo.updated_at, 
       							icon:repo.owner.avatar_url, 
       							url:repo.url
       				} 
       			}).filter(function(repo){
       				return repo.name.startsWith("databox.");
       			}));
       		}
   		})
});

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
     			res.status(500).send({error:'could not retrieve repos'});
     		}else{
     			res.send(data.body.map(function(repo){
       				return {
       							name: repo.name, 
       							updated: repo.updated_at, 
       							icon:repo.owner.avatar_url, 
       							url:repo.url
       				} 
       			}).filter(function(repo){
       				return repo.name.startsWith("databox.");
       			}));
       		}
   		})
});


//load up an app from a repo
router.get('/flow', function(req,res){
	
	const user = req.user;
	const repo = req.query.repo;
	const username = req.query.username || user.username;
	
	console.log("fetching for userne " + username);
	
	return Promise.all([_fetchFile(username, user.accessToken, repo, 'flows.json'), _fetchFile(username, user.accessToken, repo, 'manifest.json')]).then(function(values) {
		console.log(values);
        res.send({
        	result: 'success',
        	flows: values[0],
        	manifest: values[1],
        });
    }, (err)=>{
    	console.log(err);
    	res.status(500).send({error:'could not retrieve flows and manifest file'});
    });
});

//create a new 'app' (i.e a github repo prefixed with 'databox.').  Will also create a new  flows.json / manifest.json file.

router.post('/repo/new', function(req,res){
	var user 		= req.user;
	var name 		= req.body.name.startsWith("databox.") ? req.body.name : `databox.${req.body.name}`;
	var description = req.body.description || "";
	var isprivate   = false;
	var flows       = req.body.flows 	|| [];
	var manifest    = req.body.manifest || {};
	var message 	= req.body.message || "first commit";
	
	console.log("creating new repo!");
	
	return _createRepo(name, description, isprivate, req.user.accessToken).then(repo=>{
		 return Promise.all([
		 						Promise.resolve(repo),
		 						
		 						_addFile({	username: user.username,
   											repo: repo.name, 
   											filename: 'flows.json',
   											email: req.user.email || `${req.user.username}@me-box.com`,
   											message: message,
   											content: new Buffer(JSON.stringify(flows)).toString('base64'),
   											accessToken: req.user.accessToken,
   								})
   							]);
	}, (err)=>{
		console.log(err);
		res.status(500).send({error:'could not create repo'});
	}).then( (values)=>{
		
		const repo = values[0];
		
		return Promise.all([
								Promise.resolve(repo.name),
								Promise.resolve(values[1]),  
								_addFile({
										username: user.username,
										repo: repo.name, 
										filename: 'manifest.json',
										email: req.user.email || `${req.user.username}@me-box.com`,
										message: message,
										content: new Buffer(JSON.stringify(manifest)).toString('base64'),
										accessToken: req.user.accessToken,
								})
   							]);
		
	}).then((values)=>{
		res.send({
					result:'success', 
					repo: values[0], 
					sha:{
						flows:    values[1].content.sha,
						manifest: values[2].content.sha,
					}
				});
	}, (err)=>{
		console.log(err);
		res.status(500).send({error:'could not create files'});
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
		
	const user = req.user;
	//need to create a new docker file
	const dcommands = [
							"FROM databox/red", 
							`ADD ${config.github.RAW_URL}/${user.username}/${repo.name}/master/flows.json /root/.node-red/flows.json`,
							'LABEL databox.type="app"',
							`LABEL databox.manifestURL="${config.appstore.URL}/${app.name}/manifest.json"`,
							"EXPOSE 8080",
							`CMD ["node", "/root/node-red/red.js"]`
					   ]	
	
	
	const dockerfile = dcommands.join("\n");
	

	/*return _createRepo(REPONAME, description, false, req.user.accessToken).then( (repo)=>{
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
  	}).then(function(commit){*/
  	
	const data = {
					manifest: JSON.stringify(_generateManifest(req.user, app.name, app, packages, forbidden)),
										
					poster: JSON.stringify({
						username: req.user.username,
					}),
										
					postDate:  JSON.stringify((new Date()).toISOString()),
										
					queries: JSON.stringify(0),
	}; 
		
		
						
	return _saveToAppStore(data).then(function(result){
		var path = "tmp.tar.gz";
		return _createTarFile(dockerfile, path);
	},(err)=>{
   		res.status(500).send({error: 'could not save to app store'});
  	}).then(function(tarfile){
		return _createDockerImage(tarfile, app.name);
	},(err)=>{
   		res.status(500).send({error: 'could not create tar file'});
  	}).then(function(){
		res.send({success:true});
	},(err)=>{
   		res.status(500).send({error: 'could not create docker image'});
  	});
});

module.exports = router;