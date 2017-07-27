import zlib from 'zlib';
import fs from 'fs';
import tar from 'tar-stream';
import docker from './docker';

export function matchLibraries(code){

	const REQUIRE_RE = /require\(['"]([^'"]+)['"](?:, ['"]([^'"]+)['"])?\);?/g;
	const IMPORT_RE  = /\bimport\s+(?:.+\s+from\s+)?[\'"]([^"\']+)["\']/g;

	const requires = code.match(REQUIRE_RE);
	const imports = code.match(IMPORT_RE);
	let r1 = [], r2 = [];
	
	if (requires && requires.length > 0){
		r1 = requires.map((pkg)=>{
			return pkg.replace(/require\w*\(\w*['"]/g, "").replace(/['"]\);*/g,"")
		});
	}

	if (imports && imports.length > 0){
	 	r2 = imports.map((module)=>{
			return module.replace(/import\s*/g,"").replace(/\s*(\w|\W|\s)*from\s*/g,"").replace(/['"]/g, "");
		});
	}

	return [...r1, ...r2];
}

export function flatten(arr){
	return arr.reduce((acc, row)=>{
			return row.reduce((acc, src)=>{
					acc.push(src);
					return acc;
			}, acc);
	}, [])
}

export function dedup(arr){
	let seen = {};
	return arr.filter((item)=>{
		if (seen[item])
			return false;
		seen[item] = true;
		return true;
	});
}


const _addEntry = function(pack, name, file){
	return new Promise((resolve, reject)=>{
		pack.entry({name: name}, file, function(err){
			if (err){
				reject(err);
			}	
			else{
				resolve(true);
			}
		});
	});
}

export function createTarFile(dockerfile, flowfile, path){

	console.log("cerating tar file with flowfile");
	console.log(flowfile);
	var tarball = fs.createWriteStream(path);
	const gzip   = zlib.createGzip();
	const pack   = tar.pack();
		
	return _addEntry(pack, "Dockerfile", dockerfile).then(()=>{
		return _addEntry(pack, "flows.json", flowfile)
	})
	.then(()=>{
		pack.finalize();
	
		const stream = pack.pipe(gzip).pipe(tarball);
		return new Promise((resolve,reject)=>{
			stream.on('finish', function (err) {
				if(err){
					reject(err);
				}else{
					resolve(path);
				}
			});	
		});
	});
}
	/*return new Promise((resolve, reject)=>{
		var tarball = fs.createWriteStream(path);
		const gzip   = zlib.createGzip();
		const pack   = tar.pack();
		pack.entry({name: 'Dockerfile'}, dockerfile, function(err){
			if (err){
				reject(err);
			}
			
			console.log("am herwe");
			
			pack.entry({name: "flows.json"}, flowfile, function(err){
				if (err){
				
        	   		reject(err);
        		}
        		console.log("finalising");
        		pack.finalize();
        	
        		const stream = pack.pipe(gzip).pipe(tarball);
		
				stream.on('finish', function (err) {
					resolve(path);
				});	
			});
		});
	})
}*/

/*export function createTarFile(dockerfile, path){
		
	return new Promise((resolve, reject)=>{
		
		var tarball = fs.createWriteStream(path);
		const gzip   = zlib.createGzip();
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
}*/

export function createDockerImage(tarfile, tag){

	console.log(`creating image for tarfile ${tarfile} with tag ${tag}`);

	return new Promise((resolve, reject)=>{
		docker.buildImage(tarfile, {t: tag, nocache:true}, function (err, output){
			if (err){
				console.warn(err);
				reject(err);
			}
			output.pipe(process.stdout);
			
			output.on('end', function() {
				resolve(tag);
			});
		});
	});
}


export function uploadImageToRegistry(tag, registry){
	return new Promise((resolve, reject)=>{
		var image = docker.getImage(tag);
		image.push({
			registry : registry
		}, function(err, data) {
			data.pipe(process.stdout);
			if (err){
				reject(err)
			}
			resolve();
		});
	});
}

export function stopAndRemoveContainer(name){
	
	return new Promise((resolve, reject)=>{
			
		const container = docker.listContainers(function (err, containers) {
			
			if (err){
				reject(err);
			}
			
			const container = containers.reduce((acc, container)=>{
				if (container.Names.indexOf(`/${name}`) != -1){
					return container;
				}	
				return acc;
			},null);
			
			if (!container){
				console.log("did not find running container");
				resolve(true);
				return;
			}
		
			var containerToStop = docker.getContainer(container.Id);
			
			containerToStop.stop((err,data)=>{
				console.log("container stopped!");
				if (err){
					reject(err);
				}
				containerToStop.remove((err, data)=>{
					if (err){
						reject(err);
					}
					resolve(true);
				});
			});			
		});
		
		
	});
}

export function createTestContainer(image, name){
	console.log(`creating test container ${image}, name: ${name}`);
	return new Promise((resolve, reject)=>{
		docker.createContainer({Image: image, PublishAllPorts:true, Links: ["mock-datasource:mock-datasource","databox-test-server:databox-test-server"], Env: ["TESTING=true", "MOCK_DATA_SOURCE=http://mock-datasource:8080"],  Labels: {'user':`${name}`}, "ExposedPorts": {"1880/tcp": {}}, Cmd: ["npm", "start", "--", "--userDir", "/data"], name: `${name}-red`}, function (err, container) {
			if (err){
				console.log(err);
				reject(err);
			}else{
			
				container.start({}, function (err, data) {
					if (err){
						console.log("error!");
						reject(err);
					}else{
						resolve(container);
					}
				});
			}
		});
	});
}

export function writeTempFile(filestr, fileName){
	
	
	return new Promise((resolve, reject)=>{
		fs.writeFile(fileName, filestr, function(err) {
			if(err) {
				reject(err);
			}
			
			resolve(true);
		}); 
	});
}

export function removeTempFile(fileName){
	return new Promise((resolve,reject)=>{
		fs.unlink(fileName, function(err){
			if(err) {
				console.log(err);
				reject(err);
			}
			resolve(true);
		});
	});
}