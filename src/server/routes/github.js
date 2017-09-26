import express from 'express';
import request from 'superagent';
import fs from 'fs';
import path from 'path';
import docker from '../utils/docker';
import {flatten, dedup, createTarFile, createDockerImage, uploadImageToRegistry, matchLibraries, writeTempFile, removeTempFile} from '../utils/utils';
const router = express.Router();
const agent = request.agent();
const networks= ["databox_default", "bridge"];

//TODO: check if container is tagged instead, as this is a less ambiguous way of retrieving the required container
const _fetchDockerIP = function(containerName){
	
	console.log(`retrieving docker ip for container ${containerName}`);

	return new Promise((resolve,reject)=>{
		docker.listContainers({}, function(err, containers) {
			if (err){
				console.log("error listing containers!!");
				reject(containers);
			}else{
				const ip = containers.reduce((acc, c)=>{
					if (_name(c).indexOf(containerName) !== -1){
						//console.log("found container!!!");
						return _addr(c);
					}
					return acc;
				},"127.0.0.1");
				console.log("RETURNING IP", ip);
				resolve(ip);
			}
		});
	});
	
}

var _name = function(container){
	try{
		if (container["Names"]){
			return container["Names"][0].split("\/").slice(-1)[0];
		}else{
			return "";
		}
	}catch(err){
		console.log("error getting name for container", container);
		return "";
	}
}

var _addr = function(container){
	//console.log("GETTING THE ADDRESS OF THE CONTAINER", JSON.stringify(container,null,4));
	//databox_databox-cm-app-server-net
	//ingress
	console.log("retrieving addr for", container);
	
	if (container.NetworkSettings && container.NetworkSettings.Networks){
		const net = networks.find((network)=>{
			return container.NetworkSettings.Networks[network];
		});

		console.log("found ip addr for network", net);
	
		if (net){
			return container.NetworkSettings.Networks[net].IPAddress || "127.0.0.1";
		}
	}
	
	return "127.0.0.1";
}

const _createCommit = function(config, user, repo, sha, filename, content, message, accessToken){

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

const _createRepo = function(config, user, name, description, flows, manifest, commitmessage, accessToken){
 	

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
		 						
		 						_addFile({	
		 									config:config,
		 									username: user.username,
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
										config: config,
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
	
	const {config, username, repo, filename, message, email, content, accessToken} = options;

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

const _fetchFile = function(config, username, repoowner, accessToken, repo, filename){
	
	console.log(`{fetching file: ${filename}`);

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
					try{
						if (username === repoowner){
							resolve({content: JSON.parse(jsonstr), sha: data.body.sha});
						}else{
							resolve({content: JSON.parse(jsonstr)});
						}
					}catch(error){
						console.log("error parsing JSON");
						console.log(error);
						console.log(jsonstr);
						resolve({content:{}});
					}
				}
			});		
	});
}

const _wait = (storeurl)=> { 
	return new Promise((resolve,reject)=>{
		function get () {
			console.log(`calling ${storeurl}`);
			agent.get(`http://${storeurl}`, (error,response,body)=>{
                if(error) {
                        console.log("[seeding manifest] waiting for appstore", error);
                        setTimeout(get,4000);
                } else {
					resolve();
				}
			});
		}
		setTimeout(get,2000);
	});
}

const _saveToAppStore = function(config,manifest){
	console.log("saving to app store with manifest", manifest);
	
	//if no appstore url specified, assume a dockerised one running and retrieve docker ip
	if (!config.appstore || (config.appstore.URL || "").trim() === ""){
		console.log("fetching docker ip for databox_app-server");
		return _fetchDockerIP("databox_app-server").then((ip)=>{
			console.log("url to post to:", ip);
			return _postToAppStore(`${ip}:8181`, manifest);
		});
	}
	else{
		return _postToAppStore(`${config.appstore.URL}`, manifest);
	}
}

const _postToAppStore = function(storeurl, manifest){

	console.log("POSTING TO APP STORE", `${storeurl}/app/post`);
	return _wait(storeurl).then(()=>{
		return new Promise((resolve, reject)=>{
			agent
	  			.post(`http://${storeurl}/app/post`)
	  			.send(manifest)
	  			.set('Accept', 'application/json')
	  			.type('form')
	  			.end(function(err, res){
	  				if (err){
	  					console.log("error posting to app store", err);
	  					reject(err);
	  				}else{
	  					console.log("DONE!");
	  					console.log(res.body);
	          			resolve(res.body);
	  	 			}
	  	 		})	
	  	});
	});
}

const _generateManifest = function(config,user, reponame, app, packages, allowed){
	
	const appname = app.name.startsWith(user.username) ? app.name : `${user.username}-${app.name}`;
	
	return  {
				'manifest-version': 1,
				name: appname,
				version: "0.1.0",
				description: app.description,
				author: user.username,
				licence: "MIT",
				"databox-type": "app",
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
						datastores: Array.from(new Set([...pkg.datastores.map((d)=>{return d.id})])),
						risk: pkg.risk,
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

				"network-permissions":[],

				"resource-requirements":{},

				volumes: []
			}	
}


const _pull = function(repo){
	return new Promise((resolve, reject)=>{
		docker.pull(repo, function (err, stream) {
  			docker.modem.followProgress(stream, onFinished, onProgress);

			function onFinished(err, output) {
			   if (err){
			   		reject(err);
			   }else{
			   		resolve(output);
			   }
			}
			function onProgress(event) {
				console.log(event);
			}
  			
		});
	})
}

const _publish = function(config, user, reponame, app, packages, libraries, allowed, flows){
	
	
	console.log("PUBLISHING NOW WITH LIBRARIES");
	console.log(libraries);

	return new Promise((resolve, reject)=>{
		//create a new docker file
		return _pull("tlodge/databox-sdk-red:latest").then(()=>{

			const manifest = _generateManifest(config, user, app.name, app, packages, allowed);

			const data = {
				manifest: JSON.stringify(manifest),
								
				poster: JSON.stringify({
					username: user.username,
				}),
								
				postDate:  JSON.stringify((new Date()).toISOString()),
								
				queries: JSON.stringify(0),
			}; 
			return _saveToAppStore(config,data);
		
		}).then((result)=>{
			const libcommands = libraries.map((library)=>{
				return `RUN cd /data/nodes/databox && npm install --save ${library}`
			});


			//add a echo statement to force it not to cache (nocache option in build doesn't seem to work
			const dcommands = [
								`FROM tlodge/databox-sdk-red:latest`,
								`ADD flows.json /data/flows.json`,
								'LABEL databox.type="app"',
								`LABEL databox.manifestURL="${config.appstore.URL}/${app.name}/manifest.json"`,
						   ];	
		
			const startcommands = [
								"EXPOSE 8080",
								"CMD /root/start.sh"
			];
			
			const dockerfile = [...dcommands, ...libcommands, ...startcommands].join("\n");
			const path = `${user.username}-tmp.tar.gz`;
			return createTarFile(dockerfile, flows, path);
		},(err)=>{
			reject("could not save to app store!");
		}).then(function(tarfile){
			const appname = app.name.startsWith(user.username) ? app.name.toLowerCase() : `${user.username.toLowerCase()}-${app.name.toLowerCase()}`;
			return createDockerImage(tarfile, `${appname}`);	
		},(err)=>{
			reject("could not create tar file", err);
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
}


//list all apps owned by this user
router.get('/repos/:user', function(req,res){
	const user = req.user;
	let username = req.params.user;
	
	//set to this user if passed in empty string or no user
	if (!username  || username.trim() === ""){
		username = req.user.username;	
	}
	request
   		.get(`${req.config.github.API}/users/${username}/repos`)
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
       							description: repo.description,
       							updated: repo.updated_at, 
       							icon:repo.owner.avatar_url, 
       							url:repo.url, 
       				} 
       			}).filter(function(repo){
       				return repo.name.startsWith("databox.");
       			})
       			
     			res.send({username,repos});
       		}
   		})
});

//list all apps owned by this user
router.get('/repos', function(req,res){
	console.log("getting repos with accessToken", req.user.accessToken);
	const user = req.user;
	
	request
   		.get(`${req.config.github.API}/users/${user.username}/repos`)
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
       							description: repo.description,
       							updated: repo.updated_at, 
       							icon:repo.owner.avatar_url, 
       							url:repo.url, 
       				} 
       			}).filter(function(repo){
       				return repo.name.startsWith("databox.");
       			});
       			
       			res.send({username:req.user.username,repos});
       		}
   		})
});


//load up an app from a repo
router.get('/flow', function(req,res){
	
	const user = req.user;
	const repo = req.query.repo;
	const owner = req.query.username || user.username;
	
	return Promise.all([_fetchFile(req.config,user.username, owner, user.accessToken, repo, 'flows.json'), _fetchFile(req.config, user.username, owner, user.accessToken, repo, 'manifest.json')]).then(function(values) {
		
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
	var name 			= req.body.name.startsWith("databox.") ? req.body.name.toLowerCase() : `databox.${req.body.name.toLowerCase()}`;
	var description 	= req.body.description || "";
	var flows       	= req.body.flows 	|| [];
	var manifest    	= req.body.manifest || {};
	var commitmessage 	= req.body.message || "first commit";
	
	return _createRepo(req.config, user, name, description, flows, manifest, commitmessage, req.user.accessToken).then(repo=>{
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
	
	return _createCommit(req.config, user, repo, sha.flows, 'flows.json', flowscontent, message, user.accessToken).then((data)=>{
			return Promise.all([Promise.resolve(data.body.content.sha), _createCommit(req.config,user, repo, sha.manifest,  'manifest.json', manifestcontent, message, user.accessToken)])
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
		if (node.type === "dbfunction"){
			acc = [...acc, matchLibraries(node.func)];
		}
		return acc;
	},[])));
	

	
	if (repo && repo.sha && repo.sha.flows && repo.sha.manifest){ //commit
		
		console.log("COMMITTING!!!");
		const flowcontent 		= new Buffer(JSON.stringify(flows)).toString('base64');
		const manifestcontent 	= new Buffer(JSON.stringify(manifest)).toString('base64');
		const message = commitmessage;
		
		return _createCommit(req.config, user, repo.name, repo.sha.flows, 'flows.json', flowcontent, message, req.user.accessToken).then((data)=>{
			return Promise.all([Promise.resolve(data.body.content.sha), _createCommit(req.config, user, repo.name, repo.sha.manifest,  'manifest.json', manifestcontent, message, req.user.accessToken)])
		}, (err)=>{
			res.status(500).send({error: err});
		}).then((values)=>{
			return Promise.all([Promise.resolve(values[0]), Promise.resolve(values[1].body.content.sha), _publish(req.config, user, repo.name, app, packages, libraries, allowed, JSON.stringify(flows))]);
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
	  	console.log("CREATING NEW REPO..");
	  	const reponame =  app.name.startsWith("databox.") ? app.name.toLowerCase() : `databox.${app.name.toLowerCase()}`;	
		console.log(reponame);
		return _createRepo(req.config, user, reponame, app.description, flows, manifest, commitmessage, req.user.accessToken).then((values)=>{	
			console.log(`publishing...${reponame}`);
			return Promise.all([Promise.resolve(values), _publish(req.config,user, reponame, app, packages, libraries, allowed, JSON.stringify(flows))]);
		},(err)=>{
			res.status(500).send({error: err});
		}).then((values)=>{
			const repodetails = values[0];
			console.log("SENDING SUCCESS RESPONSE!");
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
