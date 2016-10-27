import express from 'express';
import request from 'superagent';
import config from '../config.js';
import fs from 'fs';
import docker from '../utils/docker';
import {flatten, dedup, createTarFile, createDockerImage, uploadImageToRegistry, matchLibraries, writeTempFile, removeTempFile} from '../utils/utils';
const router = express.Router();

const _createCommit = function(user, repo, sha, filename, content, message, accessToken){

	return new Promise((resolve, reject)=>{
		request
   			.put(`${config.github.API}/repos/${user.username}/${repo}/contents/${filename}`)
   			.send({
  					"message": message,
 					"committer": {
    					"name": user.username,
    					"email": user.email || `${user.username}@me-box.com`
  					},
  					"content": content,
  					"sha":sha,
			})
   			.set('Authorization', 'token ' + accessToken)
   			.set('Accept', 'application/json')
   			.end((err, data)=>{
     			if (err ) {
       				console.log("******** ERROR ********");
       				console.log(err);
       				reject(err);
       				
     			} else {
     				//have found that it can still take time before this registers as the latest commit.
     				resolve(data)
     			}
   			});
	
	});
}

const _createRepo = function(user, name, description, flows, manifest, commitmessage, accessToken){
 	

	return new Promise((resolve,reject)=>{
		
		request
   			.post(`${config.github.API}/user/repos`)
   			.send({
  				"name": name,
  				"description": description,
  				"private": false,
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
   	}).then((repo)=>{
   
   	 	return Promise.all([
		 						Promise.resolve(repo),
		 						
		 						_addFile({	username: user.username,
   											repo: repo.name, 
   											filename: 'flows.json',
   											email: user.email || `${user.username}@me-box.com`,
   											message: commitmessage,
   											content: new Buffer(JSON.stringify(flows)).toString('base64'),
   											accessToken: accessToken,
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
										email: user.email || `${user.username}@me-box.com`,
										message: commitmessage,
										content: new Buffer(JSON.stringify(manifest)).toString('base64'),
										accessToken: accessToken,
								})
   							]);
		
   		
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
					console.log(err);
					reject(err);
				} else {
					console.log(res.body);
					resolve(Object.assign({},res.body, {repo:repo}));
				}
			})    					
   	})	
}

const _fetchFile = function(username, repoowner, accessToken, repo, filename){
	
	return new Promise((resolve,reject)=>{
		request
			.get(`${config.github.API}/repos/${repoowner}/${repo}/contents/${filename}`)
			.set('Accept', 'application/json')
			.set('Authorization', `token ${accessToken}`)
			.end((err, data)=>{
				if (err || !data.ok) {
					reject(err);
				} 
				else {	
				
					//only send back sha (used for future updates) if user that requested this repo is the owner
					const jsonstr = new Buffer(data.body.content, 'base64').toString('ascii')
					if (username === repoowner){
						resolve({content: JSON.parse(jsonstr), sha: data.body.sha});
					}else{
						resolve({content: JSON.parse(jsonstr)});
					}
				}
			});		
	});
}

const _saveToAppStore = function(manifest){
	console.log("saving to app store now");
	console.log(`${config.appstore.URL}/app/post`);
	
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
  					console.log("DONE!");
  					console.log(res.body);
          			resolve(res.body);
  	 			}
  	 		})	
  	});
}

const _generateManifest = function(user, reponame, app, packages, allowed){
	
	const appname = app.name.startsWith(user.username) ? app.name : `${user.username}-${app.name}`;
	
	return  {
				'manifest-version': 1,
				name: appname,
				version: "0.1.0",
				description: app.description,
				author: user.username,
				licence: "MIT",
				tags: app.tags ? app.tags.split(","): "",
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
						datasources: Array.from(new Set([...pkg.datastores.map((d)=>{return d.id})])),
						risks: pkg.risk,
						benefits: pkg.benefits,
					}
				}),
				
				'allowed-combinations' : allowed,
				
				datasources: flatten(packages.map((pkg)=>{
					return pkg.datastores.map((d)=>{
						return {
							type: d.type,
							required: true,
							name: d.name || d.type,
							clientid: d.id,
							granularities: [],
						}
					});
				})),
			}	
}


const _publish = function(user, reponame, app, packages, libraries, allowed, flows){
	
	
	
	return new Promise((resolve, reject)=>{
		//create a new docker file
		
		const libcommands = libraries.map((library)=>{
							return `RUN npm install -g ${library}`
						});
		
		
		//add a echo statement to force it not to cache (nocache option in build doesn't seem to work
		const dcommands = [
							`FROM ${config.registry.URL}/databox/red`,
							`RUN echo ${Date.now()}`,
							`ADD flows.json /root/.node-red/flows.json`,
							'LABEL databox.type="app"',
							`LABEL databox.manifestURL="${config.appstore.URL}/${app.name}/manifest.json"`,
					   ];	
	
		const startcommands = [
							"EXPOSE 8080",
							"CMD /root/start.sh"
		];
		
		const dockerfile = [...dcommands, ...libcommands, ...startcommands].join("\n");
	
		console.log("building with dockerfile");
		console.log(dockerfile);
		
		const data = {
						manifest: JSON.stringify(_generateManifest(user, app.name, app, packages, allowed)),
										
						poster: JSON.stringify({
							username: user.username,
						}),
										
						postDate:  JSON.stringify((new Date()).toISOString()),
										
						queries: JSON.stringify(0),
		}; 
		
		console.log("saving to app store");
		console.log(data);
			
		return _saveToAppStore(data).then(function(result){
			var path = `${user.username}-tmp.tar.gz`;
			return createTarFile(dockerfile, flows, path);
		},(err)=>{
			reject("could not save to app store!");
		}).then(function(tarfile){
			const appname = app.name.startsWith(user.username) ? app.name : `${user.username}-${app.name}`;
			return createDockerImage(tarfile, `${config.registry.URL}/${appname}`);
		},(err)=>{
			reject("could not create tar file");
		}).then(function(tag){
			return uploadImageToRegistry(tag, `${config.registry.URL}`);
		},(err)=>{
			reject('could not create docker image');
		}).then(()=>{
			resolve();
		}, (err)=>{
			reject('could not upload to registry');
		});
	});
};


//list all apps owned by this user
router.get('/repos/:user', function(req,res){
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
     			const repos = data.body.map(function(repo){
       				return {
       							name: repo.name, 
       							updated: repo.updated_at, 
       							icon:repo.owner.avatar_url, 
       							url:repo.url, 
       				} 
       			}).filter(function(repo){
       				return repo.name.startsWith("databox.");
       			})
       			
     			res.send(repos);
       		}
   		})
});

//list all apps owned by this user
router.get('/repos', function(req,res){
	
	const user = req.user;
	
	request
   		.get(`${config.github.API}/users/${user.username}/repos`)
   		.query({'per_page': 100, sort:'created', direction:'desc'})
   		
   		.set('Accept', 'application/json')
   		.set('Authorization', `token ${req.user.accessToken}`)
   		.end((err, data)=>{
     		if (err){
     			console.log(err);
     			req.logout();
     			res.status(500).send({error:'could not retrieve repos'});
     		}else{
     			const repos = data.body.map(function(repo){
       				
       				return {
       							name: repo.name, 
       							updated: repo.updated_at, 
       							icon:repo.owner.avatar_url, 
       							url:repo.url, 
       				} 
       			}).filter(function(repo){
       				return repo.name.startsWith("databox.");
       			});
       			
       			res.send(repos);
       		}
   		})
});


//load up an app from a repo
router.get('/flow', function(req,res){
	
	const user = req.user;
	const repo = req.query.repo;
	const owner = req.query.username || user.username;
	
	return Promise.all([_fetchFile(user.username, owner, user.accessToken, repo, 'flows.json'), _fetchFile(user.username, owner, user.accessToken, repo, 'manifest.json')]).then(function(values) {
		
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

	var user 			= req.user;
	var name 			= req.body.name.startsWith("databox.") ? req.body.name : `databox.${req.body.name}`;
	var description 	= req.body.description || "";
	var flows       	= req.body.flows 	|| [];
	var manifest    	= req.body.manifest || {};
	var commitmessage 	= req.body.message || "first commit";
	
	return _createRepo(user, name, description, flows, manifest, commitmessage, req.user.accessToken).then(repo=>{
		return repo;
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

	const user = req.user;
	const repo = req.body.repo;
	const flowscontent 		= new Buffer(JSON.stringify(req.body.flows)).toString('base64');
	const manifestcontent 	= new Buffer(JSON.stringify(req.body.manifest)).toString('base64');
	const sha = req.body.sha;
	const message = req.body.message || "checkpoint commit";
	
	return _createCommit(user, repo, sha.flows, 'flows.json', flowscontent, message, user.accessToken).then((data)=>{
			return Promise.all([Promise.resolve(data.body.content.sha), _createCommit(user, repo, sha.manifest,  'manifest.json', manifestcontent, message, user.accessToken)])
	}, (err)=>{
			res.status(500).send({error: err});
	}).then((values)=>{
	
		res.send({
       		result: 'success',
       		repo: repo,
       		sha:{
       			flows: values[0],
       			manifest: values[1].body.content.sha,
       		}
       	});
	},(err)=>{
		console.log(err);
		res.status(500).send({error:'could not update the repo'});
	});
	
});


router.post('/publish', function(req,res){
	
	const user = req.user;
	const repo 		= req.body.repo;
	const manifest  = req.body.manifest;
	const flows 	= req.body.flows;
	
	const app = manifest.app;
	const packages = manifest.packages;
	const allowed = manifest['allowed-combinations'];
	const description = manifest.app.description;
	const commitmessage = 'publish commit';
	
	//first save the manifest and flows file - either create new repo or commit changes
		
	const libraries = dedup(flatten(flows.reduce((acc, node)=>{
		if (node.type === "function"){
			acc = [...acc, matchLibraries(node.func)];
		}
		return acc;
	},[])));
	
	if (repo && repo.sha && repo.sha.flows && repo.sha.manifest){ //commit
		
		const flowcontent 		= new Buffer(JSON.stringify(flows)).toString('base64');
		const manifestcontent 	= new Buffer(JSON.stringify(manifest)).toString('base64');
		const message = commitmessage;
		
		return _createCommit(user, repo.name, repo.sha.flows, 'flows.json', flowcontent, message, req.user.accessToken).then((data)=>{
			return Promise.all([Promise.resolve(data.body.content.sha), _createCommit(user, repo.name, repo.sha.manifest,  'manifest.json', manifestcontent, message, req.user.accessToken)])
		}, (err)=>{
			res.status(500).send({error: err});
		}).then((values)=>{
			return Promise.all([Promise.resolve(values[0]), Promise.resolve(values[1].body.content.sha), _publish(user, repo.name, app, packages, libraries, allowed, JSON.stringify(flows))]);
		},(err)=>{
			res.status(500).send({error: err});
		}).then((values)=>{
			res.send({
				result:'success', 
				repo: repo.name, 
				sha:{
					flows:    values[0],
					manifest: values[1],
				}
			});
		});
		
	}else{ //create a new repo!
	  	
	  	const reponame =  app.name.startsWith("databox.") ? app.name : `databox.${app.name}`;	
		
		return _createRepo(user, reponame, app.description, flows, manifest, commitmessage, req.user.accessToken).then((values)=>{	
			console.log(`publishing...${reponame}`);
			return Promise.all([Promise.resolve(values), _publish(user, reponame, app, packages, libraries, allowed, JSON.stringify(flows))]);
		},(err)=>{
			res.status(500).send({error: err});
		}).then((values)=>{
			const repodetails = values[0];
		
			res.send({
				result:'success', 
				repo: repodetails[0], 
				sha:{
					flows:    repodetails[1].content.sha,
					manifest: repodetails[2].content.sha,
				}
			});
		});
	}
});

module.exports = router;
