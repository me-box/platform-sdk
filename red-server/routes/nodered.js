import express from 'express';
import request from 'superagent';
import config from '../config.js';
import docker from '../utils/docker.js';
import {matchLibraries, flatten, dedup, createTarFile, createDockerImage, createTestContainer, stopAndRemoveContainer} from '../utils/utils.js';

const router = express.Router();

const _postFlows = function(port, data, username){
	console.log(`connecting to localhost:${port}/flows`);

	
	//add in channelIDs here
	const flows = data.map((node)=>{		
			const modifier = node.type === "app" ? {appId: username} : {}; //inject the appID
			return Object.assign({}, node, modifier);
	});
	//REMOVE THIS TO -- PUT IN TO TEST!
	//port = 1880;
	return new Promise((resolve,reject)=>{
		request
				.post(`localhost:${port}/flows`)
				.send(flows)
				.set('Accept', 'application/json')
				.type('json')
				.end((err, result)=>{
					if (err) {
						console.log(err);
						reject(err);
					} else {
						console.log("successfully installed new flows");
						resolve(true);
						
					}
				});
	});
}

const _waitForStart = function(container){
	return new Promise((resolve,reject)=>{
		container.attach({stream: true, stdout: true, stderr: true}, function (err, stream) {
    		stream.on('data', function(line) {
    			if (line.toString().indexOf("Started flows") != -1){
    				console.log("started container");
    				setTimeout(function(){
    					console.log("sending flows");
    					resolve(true);	
    				},1000);
    			}
    		});
		});
	});
}


const _startContainer = function(container, flows, username){
	return _waitForStart(container).then(function(){
		return container.inspect(function (err, cdata) {
			console.log("starting container!");
			let port = cdata['NetworkSettings']['Ports']['1880/tcp'][0]['HostPort'];
			return _postFlows(port, flows, username);
		});
	});	
}

const _createNewImageAndContainer = function(libraries, username, flows){
	//need to create a new Image!
	console.log("found external libraries, so creating new image!");
	
	const libcommands = libraries.map((library)=>{
							return `RUN npm install -g ${library}`
						});
						
	const dcommands = [...[`FROM databox/testred`], ...libcommands]			
	const dockerfile = dcommands.join("\n");
	
	console.log(dockerfile);
	
	const path = `tmp-${username}.tar.gz`;
	
	return stopAndRemoveContainer(`${username}-red`).then(()=>{
		return createTarFile(dockerfile, path)
	}).then((tarfile)=>{
		console.log(`created tar file ${tarfile}`);
		return createDockerImage(tarfile, `${username}-testimage`);
	}).then((image)=>{
		console.log("creating test container!");
		return createTestContainer(image, username)
	}).then((container)=>{
		console.log("successfully created container");
		return _startContainer(container, flows, username);
	});
}

const _createContainerFromStandardImage = function(username, flows){
	
	const opts = {
		filters : {
						label: [`user=${username}`],
						status: ['running', "exited"],			
		}
  	}	

	return new Promise((resolve,reject)=>{
		docker.listContainers(opts, function(err, containers) {
			console.log(`Containers labeled user=${username} ${containers.length}`);
		
			//create a new container and start it, if it doesn't exist
			if (containers.length <= 0){
				return createTestContainer('databox/testred', username).then((container)=>{
					return _startContainer(container, flows, username);
				});
			}else{
				const c = containers[0];
				//restart the container if it exists but is stopped
				if (c.State === 'exited'){
					console.log("restarting container!!");
					const container = docker.getContainer(c.Id);
					container.restart({}, function(err, data){
						if (err){
							console.log(err);
							return reject(err);
						}else{
							return _startContainer(container, flows, username);
						}		
					});
				}else{
					console.log("container already ruinning...");
					console.log(c);
					//post flows to already running container
					let port = c.Ports[0]['PublicPort'];
					return _postFlows(port, flows, username);
				}
			}
		});	
	});
}

router.post('/flows', function(req, res){
	
	const flows = req.body;


	const libraries = dedup(flatten(req.body.reduce((acc, node)=>{
		if (node.type === "function"){
			acc = [...acc, matchLibraries(node.func)];
		}
		return acc;
	},[])));
	
	if (libraries.length > 0){
		return _createNewImageAndContainer(libraries, req.user.username, flows).then((result)=>{
			res.send({success:true});
		}, (err)=>{
		 	res.status(500).send({error:err});
		});
	}
	else{
		return _createContainerFromStandardImage(req.user.username, flows).then((result)=>{
			res.send({success:true});
		}, (err)=>{
			res.status(500).send({error:err});
		});
	}	
	
	//remove this and re-instate commented code for prod
	//_postFlows(1880, flows, req, res);
	
});

module.exports = router;