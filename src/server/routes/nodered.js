import express from 'express';
import request from 'superagent';
import docker from '../utils/docker.js';
import {matchLibraries, flatten, dedup, createTarFile, createDockerImage, createTestContainer, stopAndRemoveContainer} from '../utils/utils.js';
import minimist from 'minimist';
const router = express.Router();

const argv = minimist(process.argv.slice(2));
const DEVMODE = argv.dev || false;
const network = "bridge";


const _postFlows = function(ip, port, data, username, attempts=0){
	console.log(`connecting to ${ip}:${port}/flows`);

	
	//add in channelIDs here
	const flows = data.map((node)=>{
		const outputtypes = ["app", "debugger", "bulbsout", "pipstaprint"];		
		const modifier = outputtypes.indexOf(node.type) != -1 ? {appId: username} : {}; //inject the appID
		return Object.assign({}, node, modifier);
	});
	//REMOVE THIS TO -- PUT IN TO TEST!
	//port = 1880;
    //console.log("flows:", JSON.stringify(flows,null,4));
	return new Promise((resolve,reject)=>{
		
		if (attempts > 5){
			reject("sorry couldn't connect to the container!");
			return;
		}
		
		request
			.post(`${ip}:${port}/flows`)
			.send(flows)
			.set('Accept', 'application/json')
			.type('json')
			.end((err, result)=>{
				if (err) {
					console.log("eror posting new flows", err);
					setTimeout(()=>{
						attempts += 1;
						console.log("retrying ", attempts);
						_postFlows(ip, port, data, username, attempts);
					},1000);
				} else {
					console.log("successfully installed new flows");
					resolve(true);
				}
			});
		
	});
}

/*  after a container has started it'll take a bit of time initing, after which we need to send it a flow file
    the only way I can think of to be sure it is ready to receive this is to monitor the container stdout and
    look for "Started Flows", and send the flow file a second after this */ 
const _waitForStart = function(container){
	return new Promise((resolve,reject)=>{
		container.attach({stream: true, stdout: true, stderr: true}, function (err, stream) {
    		stream.on('data', function(line) {
    			console.log(line.toString());
    			if (line.toString().indexOf("Started flows") != -1){
    				console.log("container ready for flows");
    				stream.destroy();
    				setTimeout(()=>{
    					console.log("posting flows");
    					resolve(true);	
    				},1000);
    			}
    		});
		});
	});
}


const _pullContainer  = function(name){
	console.log("pulling container", name);

	return docker.pull(name).then((stream, err)=>{
		return new Promise((resolve, reject)=>{
			if (err){
				console.log("error pulling container!", err);
				reject(err);
				return;
			}
			const pulled = ()=>{
				console.log("successfully pulled container");
				resolve("complete!");
			}

			const pulling = (event)=>{
				console.log(`[pulling]: ${event.toString()}`);
			}

			return docker.modem.followProgress(stream, pulled, pulling);
		});
	});
}

const _fetchAddr = function(cdata){
	if (DEVMODE){
		return {
			ip: "127.0.0.1",
			port: cdata['NetworkSettings']['Ports']['1880/tcp'][0]['HostPort']
		}
	}
	return {
		ip: cdata.NetworkSettings.Networks[network].IPAddress,
		port: 1880
	}
}

const _fetchRunningAddr = function(c){
	console.log("FETCHING RUNNING ADDR");

	if (DEVMODE){
		console.log("in dev mode!");
		return {
			
			ip: "127.0.0.1",
			
			port: c.Ports.reduce((acc, obj)=>{
				if (obj.PrivatePort == 1880)
					acc = obj.PublicPort;
				return acc;
			},0)
		}
	}
	console.log("ok getting ip, port from", c);

	return {	
		ip: c.NetworkSettings.Networks[network].IPAddress,
		port: 1880, 
		//c.Ports[0].PrivatePort,
	} 
}

var _inspect = function(container){
 	return new Promise((resolve, reject)=>{
 		container.inspect((err, cdata)=>{
        	if (err){
        		reject(err);
        	}else{
        		resolve(cdata);
        	}
        })
 	});
}

var _startContainer = function(container, flows, username){
    return _waitForStart(container).then(()=>{
    	console.log("container has started!");
        return _inspect(container);
    }).then((cdata)=>{
    	console.log("starting container, devmode is ", DEVMODE);
		const {ip, port} = _fetchAddr(cdata);
		return _postFlows(ip, port, flows, username);
    }, (err)=>{
    	console.log(err);
    	throw err;
    });
}

const _createNewImageAndContainer = function(libraries, username, flows){
	//need to create a new Image!
	console.log("found external libraries, so creating new image!");
	
	
	const libcommands = libraries.map((library)=>{
							return `RUN cd /data/nodes/databox && npm install --save ${library}`
						});

	const dcommands = [...[`FROM tlodge/databox-red`, `ADD flows.json /data/flows.json`], ...libcommands]			
	const dockerfile = dcommands.join("\n");
	
	console.log(dockerfile);
	
	const path = `tmp-${username}.tar.gz`;

	return _pullContainer("tlodge/databox-red:latest").then(()=>{
		return stopAndRemoveContainer(`${username}-red`)
	}).then(()=>{
		return createTarFile(dockerfile, JSON.stringify(flows), path)
	}).then((tarfile)=>{
		console.log(`created tar file ${tarfile}`);
		return createDockerImage(tarfile, `${username}-testimage`);
	}).then((image)=>{
		console.log("creating test container!");
		return createTestContainer(image, username, network)
	}).then((container)=>{
		console.log("successfully created container");
		return _startContainer(container, flows, username);
	});
}

/*var _name = function(container){
	if (container["Names"]){
		return container["Names"][0].split("\/").slice(-1)[0];
	}
}

var _addr = function(container){
	if (container.NetworkSettings && container.NetworkSettings.Networks && container.NetworkSettings.Networks.bridge){
		return container.NetworkSettings.Networks.bridge.IPAddress || "";
	}
	return "";
}

var _ports = function(container){
	return (container.Ports || []).reduce((acc, obj)=>{
		if (obj.PublicPort){
			acc.push(obj.PublicPort);
		}
		return acc;
	},[]);
}*/

const _listContainers = function(options={}){
	return new Promise((resolve,reject)=>{
		docker.listContainers(options, function(err, containers) {
			if (err){
				reject(containers);
			}else{
				resolve(containers);

				/*.map((c)=>{
					return {
						id: c["Id"],
						name: _name(c),  
						status: c["Status"],
						state: c["State"],
						ip: _addr(c),
						ports: _ports(c)
					}
				}));*/
			}
		});
	});
}

const _restart = function(container){
	return new Promise((resolve,reject)=>{
		container.restart({}, function(err, data){
			if (err){
				console.log(err);
				reject(err);
			}else{
				resolve(data);
			}		
		});
	});
}

//stop and remove image regardless of whether it is running already or not.  This will deal with teh problem where
//the test web app responds to the client webpage before it has been given the details of the new app.
const _createContainerFromStandardImage = function(username, flows){
	
	const opts = {
		filters : {
			label: [`user=${username}`],
			status: ['running', "exited"],			
		}
  	}	

  	/*return stopAndRemoveContainer(`${username}-red`).then(()=>{
		return _pullContainer("tlodge/databox-red:latest")
	}).then(()=>{	
		return createTestContainer('tlodge/databox-red', username, network);
	}).then((container)=>{
		return _startContainer(container, flows, username);
	});*/

	return _listContainers(opts).then((containers)=>{
    		return containers;
    	}, (err)=>{
    		return err;
    	}).then((containers)=>{
			console.log(`Containers labeled user=${username} ${containers.length}`);
		
			//create a new container and start it, if it doesn't exist
			if (containers.length <= 0){
				console.log("creating test container");
				return _pullContainer("tlodge/databox-red:latest").then(()=>{
					return createTestContainer('tlodge/databox-red', username, network);
				}).then((container)=>{
					return _startContainer(container, flows, username);
				});
			}
			else{
				const c = containers[0];

				//restart the container if it exists but is stopped
				if (c.State === 'exited'){
					console.log("restarting container");
					const container = docker.getContainer(c.Id);
					return _restart(container).then((cdata)=>{
						return _startContainer(container, flows, username);
					}, (err)=>{
						return err;
					});
				}else{
					console.log("container already running");
					console.log(c);
					const {ip, port} = _fetchRunningAddr(c);
					console.log("posting new flows to", ip, port);
					return _postFlows(ip, port, flows, username);
				}
			}
		});	
	
}

router.post('/flows', function(req, res){
	
	const flows = req.body;
	
	const libraries = dedup(flatten(req.body.reduce((acc, node)=>{
		if (node.type === "dbfunction"){
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
});

module.exports = router;