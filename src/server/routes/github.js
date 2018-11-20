import express from 'express';
import request from 'superagent';
import fs from 'fs';
import path from 'path';
import docker from '../utils/docker';
import { flatten, dedup, createTarFile, createDockerImage, uploadImageToRegistry, matchLibraries, writeTempFile, removeTempFile } from '../utils/utils';
const router = express.Router();
const agent = request.agent();
const networks = ["databox_default", "bridge"];
import { sendmessage } from '../utils/websocket';

//TODO: check if container is tagged instead, as this is a less ambiguous way of retrieving the required container
const _fetchDockerIP = function (containerName) {

	console.log(`retrieving docker ip for container ${containerName}`);

	return new Promise((resolve, reject) => {
		docker.listContainers({}, function (err, containers) {
			if (err) {
				console.log("error listing containers!!");
				reject(containers);
			} else {
				const ip = containers.reduce((acc, c) => {
					if (_name(c).indexOf(containerName) !== -1) {
						//console.log("found container!!!");
						return _addr(c);
					}
					return acc;
				}, "127.0.0.1");
				console.log("RETURNING IP", ip);
				resolve(ip);
			}
		});
	});

}

var _name = function (container) {
	try {
		if (container["Names"]) {
			return container["Names"][0].split("\/").slice(-1)[0];
		} else {
			return "";
		}
	} catch (err) {
		console.log("error getting name for container", container);
		return "";
	}
}

var _addr = function (container) {
	//console.log("GETTING THE ADDRESS OF THE CONTAINER", JSON.stringify(container,null,4));
	//databox_databox-cm-app-server-net
	//ingress
	console.log("retrieving addr for", container);

	if (container.NetworkSettings && container.NetworkSettings.Networks) {
		const net = networks.find((network) => {
			return container.NetworkSettings.Networks[network];
		});

		console.log("found ip addr for network", net);

		if (net) {
			return container.NetworkSettings.Networks[net].IPAddress || "127.0.0.1";
		}
	}

	return "127.0.0.1";
}

const _createCommit = function (config, user, repo, sha, filename, content, message, accessToken) {

	return new Promise((resolve, reject) => {
		request
			.put(`${config.github.API}/repos/${user.username}/${repo}/contents/${filename}`)
			.send({
				"message": message,
				"committer": {
					"name": user.username,
					"email": user.email || `${user.username}@me-box.com`
				},
				"content": content,
				"sha": sha,
			})
			.set('Authorization', 'token ' + accessToken)
			.set('Accept', 'application/json')
			.end((err, data) => {
				if (err) {
					console.log("******** ERROR ********", err);
					reject(err);

				} else {
					//have found that it can still take time before this registers as the latest commit.
					resolve(data)
				}
			});

	});
}


const _generateGithubRepo = ({ config, name, description, accessToken }) => {

	return new Promise((resolve, reject) => {

		request
			.post(`${config.github.API}/user/repos`)
			.send({
				"name": name,
				"description": description,
				"private": false,
				"has_issues": false,
				"has_wiki": false,
				"has_downloads": false,
				"topic": "databox",
			})
			.set('Authorization', `token ${accessToken}`)
			.set('Accept', 'application/json')
			.end((err, data) => {
				if (err) {
					console.log("--> failed to create repo!");
					reject(err);
				}
				else {

					const result = data.body;

					//give github time it needs to set up repo

					setTimeout(
						function () {
							resolve({
								name: result.name,
								updated: result.updated_at,
								icon: result.owner.avatar_url,
								url: result.url
							})
						}, 2000
					);
				}
			})
	})
}

const _generateTopic = ({ config, user, accessToken, repo }) => {
	return new Promise((resolve, reject) => {
		request.put(`${config.github.API}/repos/${user.username}/${repo.name}/topics`)
			.send({ names: ["databox"] })
			.set('Authorization', `token ${accessToken}`)
			.set('Accept', 'application/vnd.github.mercy-preview+json')
			.end((err, data) => {
				if (err) {
					console.log("failed to create repo", err);
					reject(err);
				}
				else {
					resolve(true)
				}
			})
	});
}

const _createRepo = async (config, user, name, description, flows, dockerfile, manifestfile, commitmessage, accessToken) => {

	const repo = await _generateGithubRepo({ config, name, description, accessToken });
	await _generateTopic({ config, user, accessToken, repo });

	const _flows = await _addFile({
		config: config,
		username: user.username,
		repo: repo.name,
		filename: 'flows.json',
		email: user.email || `${user.username}@me-box.com`,
		message: commitmessage,
		content: new Buffer(JSON.stringify(flows, null, 4)).toString('base64'),
		accessToken: accessToken,
	});

	const _dockerfile = await _addFile({
		config: config,
		username: user.username,
		repo: repo.name,
		filename: 'Dockerfile',
		email: user.email || `${user.username}@me-box.com`,
		message: commitmessage,
		content: new Buffer(dockerfile).toString('base64'),
		accessToken: accessToken,
	});

	const _manifestfile = await _addFile({
		config: config,
		username: user.username,
		repo: repo.name,
		filename: 'databox-manifest.json',
		email: user.email || `${user.username}@me-box.com`,
		message: commitmessage,
		content: new Buffer(manifestfile).toString('base64'),
		accessToken: accessToken,
	});

	return [_flows, _dockerfile, _manifestfile];
}

const _addFile = function (options) {

	const { config, username, repo, filename, message, email, content, accessToken } = options;

	return new Promise((resolve, reject) => {
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
			.end((err, res) => {
				if (err) {
					console.log("error adding file", err);
					reject(err);
				} else {
					resolve(Object.assign({}, res.body, { repo: repo }));
				}
			})
	})
}

const _fetchFile = function (config, username, repoowner, accessToken, repo, filename) {

	console.log(`{fetching file: ${filename}`);

	return new Promise((resolve, reject) => {
		request
			.get(`${config.github.API}/repos/${repoowner}/${repo}/contents/${filename}`)
			.set('Accept', 'application/json')
			.set('Authorization', `token ${accessToken}`)
			.end((err, data) => {
				if (err || !data.ok) {
					reject(err);
				}
				else {

					//only send back sha (used for future updates) if user that requested this repo is the owner
					const str = new Buffer(data.body.content, 'base64').toString('ascii')
					try {
						if (username === repoowner) {
							resolve({ content: str, sha: data.body.sha });
						} else {
							resolve({ content: str });
						}
					} catch (error) {
						resolve({ content: {} });
					}
				}
			});
	});
}


const _saveToAppStore = function (config, manifest, username) {
	console.log("in save to app store with manifest", manifest);

	//if no appstore url specified, assume a dockerised one running and retrieve docker ip
	if (!config.appstore || (config.appstore.URL || "").trim() === "") {
		console.log("fetching docker ip for databox_app-server");
		return _fetchDockerIP("databox_app-server").then((ip) => {
			console.log("url to post to:", ip);
			return _postToAppStore(`${ip}:8181`, manifest, username);
		});
	}
	else {

		return _postToAppStore(config.appstore.URL, manifest, username);
	}
}

//this should now post to github manifest repo!
const _postToAppStore = function (storeurl, manifest, username) {
	return new Promise((resolve, reject) => {
		resolve();
	});
}

const _generateDockerfile = function (libraries, config, name) {

	const libcommands = libraries.map((library) => {
		return `RUN cd /data/nodes/databox && npm install --save ${library}`
	});


	//add a echo statement to force it not to cache (nocache option in build doesn't seem to work
	const dcommands = [
		`FROM tlodge/databox-red:latest`,
		`ADD flows.json /data/flows.json`,
		'LABEL databox.type="app"',
		`LABEL databox.manifestURL="${config.appstore.URL}/${name.toLowerCase()}/databox-manifest.json"`,
	];

	const startcommands = [
		"EXPOSE 8080",
		"CMD /root/start.sh"
	];

	return [...dcommands, ...libcommands, ...startcommands].join("\n");

}


const _generateManifest = function (config, user, reponame, app, packages, allowed) {

	console.log("generating manifest!");

	const appname = app.name.startsWith(user.username) ? app.name : `${user.username}-${app.name}`;

	return {
		'manifest-version': 1,
		name: appname.toLowerCase(),
		version: "0.1.0",
		description: app.description,
		author: user.username,
		licence: "MIT",
		"databox-type": "app",
		tags: app.tags ? app.tags.split(",") : "",
		homepage: `${config.github.URL}/${user.username}/${reponame}`,
		repository: {
			type: 'git',
			url: `git+${config.github.URL}/${user.username}/${reponame}.git`
		},
		packages: packages.map((pkg) => {
			return {
				id: pkg.id,
				name: pkg.name,
				purpose: pkg.purpose,
				required: pkg.install === "compulsory",
				datastores: Array.from(new Set([...pkg.datastores.map((d) => { return d.id })])),
				risk: pkg.risk,
				benefits: pkg.benefits,
			}
		}),

		'allowed-combinations': allowed,

		datasources: flatten(packages.map((pkg) => {
			return pkg.datastores.map((d) => {
				return {
					type: d.type,
					required: true,
					name: d.name || d.type,
					clientid: d.id,
					granularities: [],
				}
			});
		})),

		"network-permissions": [],

		"resource-requirements": {},

		volumes: []
	}
}


const _pull = function (repo) {
	return new Promise((resolve, reject) => {
		docker.pull(repo, (err, stream) => {
			docker.modem.followProgress(stream, onFinished, onProgress);

			function onFinished(err, output) {
				if (err) {
					reject(err);
				} else {
					resolve(output);
				}
			}
			function onProgress(event) {
				console.log(event);
			}

		});
	})
}

const _stripscheme = function (url) {
	return url.replace("http://", "").replace("https://", "");
}

const _uploadImageToRegistry = function (tag, registry, username) {

	console.log("uploading image to registry", tag, registry, username);
	return new Promise((resolve, reject) => {
		if (registry && registry.trim() !== "") {

			var image = docker.getImage(tag);
			console.log("ok have image to upload", tag);
			console.log(image);
			image.push({ registry: registry }, (err, stream) => {

				docker.modem.followProgress(stream, onFinished, onProgress);

				function onFinished(err, output) {
					console.log("FINISHED PUSHING IMAGE!");
					if (err) {
						sendmessage(username, "debug", { msg: err.json.message });
						reject(err);
					} else {
						sendmessage(username, "debug", { msg: "successfully pushed image!" });
						resolve(output);
					}
				}

				function onProgress(event) {
					sendmessage(username, "debug", { msg: `[pushing]: ${JSON.stringify(event)}` });
				}
			});

		}
		else {
			resolve();
		}
	});
}

const _formatmanifest = function (manifest, config, user) {

	console.log("formatting manifest", JSON.stringify(manifest, null, 4));
	//if empty object return
	if (Object.keys(manifest).length === 0 && manifest.constructor === Object) {
		return manifest;
	}

	return {
		...manifest,
		name: manifest.name.toLowerCase(),
		homepage: manifest.homepage.toLowerCase(),
		"docker-image": manifest.name.toLowerCase(),
		"docker-registry": _stripscheme(config.registry.URL) || user.username,
		"docker-image-tag": "latest",
		repository: {
			...manifest.repository,
			url: manifest.repository.url.toLowerCase(),
		}
	}
}

const _buildImage = async (config, user, manifest, flows, dockerfile) => {


	sendmessage(user.username, "debug", { msg: "pulling latest base container" });

	await _pull("tlodge/databox-red:latest").catch((err) => {
		console.log("failed to pull latest base image!");
		sendmessage(user.username, "debug", { msg: "could not pull latest image", err });
		throw (err);
	});

	sendmessage(user.username, "debug", { msg: "finshed pulling latest base container" });

	const path = `${user.username}-tmp.tar.gz`;
	const tarfile = await createTarFile(dockerfile, flows, path).catch((err) => {
		console.log("failed to create tar file for building docker image!", err);
		sendmessage(user.username, "debug", { msg: "could not create tar file!" });
		throw (err);
	});

	sendmessage(user.username, "debug", { msg: "successfully created tar file, creating docker image" });


	const _appname = manifest.name.toLowerCase();//.replace(`${user.username}-`, "");
	const _tag = config.registry.URL && config.registry.URL.trim() != "" ? `${_stripscheme(config.registry.URL)}` : `${user.username.toLowerCase()}`;

	const tag = await createDockerImage(tarfile, `${_tag}/${_appname}-amd64:${config.version || "latest"}`).catch((err) => {
		console.log("failed to create docker image", err);
		sendmessage(user.username, "debug", { msg: err });
		throw (err);
	});

	sendmessage(user.username, "debug", { msg: `uploading to registry with tag ${tag}` });

	await _uploadImageToRegistry(tag, `${config.registry.URL}`, user.username.toLowerCase()).catch((err) => {
		sendmessage(user.username, "debug", { msg: err });
		console.log("failed to upload image to registry!", err);
		throw (err);
	});

	sendmessage(user.username, "debug", { msg: "successfully published" });

}

//list all apps owned by this user
router.get('/repos/:user', function (req, res) {
	const user = req.user;
	let username = req.params.user;

	//set to this user if passed in empty string or no user
	if (!username || username.trim() === "") {
		username = req.user.username;
	}

	const query = {
		user: username,
		topic: "databox",
	}
	request
		//.get(`${req.config.github.API}/users/${username}/repos`)
		.get(`${req.config.github.API}/search/repositories`)
		.query({ q: `user:${user.username} topic:databox` })
		.set('Accept', 'application/json')
		.set('Authorization', `token ${req.user.accessToken}`)
		.query(query)
		.end((err, data) => {
			if (err) {
				console.log(err);
				res.status(500).send({ error: 'could not retrieve repos' });
				//res.send({username,repos:[]})
			} else {

				const repos = data.body.items.map(function (repo) {

					return {
						name: repo.name,
						description: repo.description,
						updated: repo.updated_at,
						icon: repo.owner.avatar_url,
						url: repo.url,
					}
				})

				res.send({ username, repos });
			}
		})
});

//list all apps owned by this user
router.get('/repos', function (req, res) {
	console.log("getting repos with accessToken", req.user.accessToken);
	const user = req.user;

	request
		//.get(`${req.config.github.API}/users/${user.username}/repos`)
		.get(`${req.config.github.API}/search/repositories`)
		.query({ q: `user:${user.username} topic:databox` })
		.set('Accept', 'application/json')
		.set('Authorization', `token ${req.user.accessToken}`)
		.end((err, data) => {
			if (err) {
				console.log(err);
				//req.logout();
				res.status(500).send({ error: 'could not retrieve repos' });
			} else {

				const repos = data.body.items.map(function (repo) {

					return {
						name: repo.name,
						description: repo.description,
						updated: repo.updated_at,
						icon: repo.owner.avatar_url,
						url: repo.url,
					}
				})

				res.send({ username: req.user.username, repos });
			}
		})
});


//load up an app from a repo
router.get('/flow', function (req, res) {

	const user = req.user;
	const repo = req.query.repo;
	const owner = req.query.username || user.username;

	//console.log("would fetch", `${repo}-manifest.json`);

	return Promise.all([
		_fetchFile(req.config, user.username, owner, user.accessToken, repo, 'flows.json'),
		//_fetchFile(req.config, user.username, owner, user.accessToken, "databox-manifest-store", `${repo}-manifest.json`),
		_fetchFile(req.config, user.username, owner, user.accessToken, repo, 'databox-manifest.json'),
		_fetchFile(req.config, user.username, owner, user.accessToken, repo, 'Dockerfile')
	]

	).then(function (values) {

		const flows = { ...values[0], content: JSON.parse(values[0].content) };
		const manifest = { ...values[1], content: JSON.parse(values[1].content) };

		res.send({
			result: 'success',
			flows,
			manifest,
			Dockerfile: values[2],
		});

	}, (err) => {
		console.log(err);
		res.status(500).send({ error: 'could not retrieve flows, manifest and Dockerfile' });
	});
});

//create a new 'app' (i.e a github repo prefixed with 'databox.').  Will also create a new  flows.json / manifest.json file.

router.post('/repo/new', function (req, res) {

	var user = req.user;
	var name = req.body.name.toLowerCase();
	var description = req.body.description || "";
	var flows = req.body.flows || [];
	var manifest = req.body.manifest || {};
	var dockerfile = `# ${name} Dockerfile`;
	var commitmessage = req.body.message || "first commit";
	const manifestfile = JSON.stringify(_formatmanifest(manifest, req.config, user), null, 4);

	return _createRepo(req.config, user, name, description, flows, dockerfile, manifestfile, commitmessage, req.user.accessToken).then(repo => {
		console.log("successfully created repo", repo);
		return repo;
	}).then((values) => {
		res.send({
			result: 'success',
			repo: values[0],
			sha: {
				flows: values[1].content.sha,
				manifest: values[2].content.sha,
				Dockerfile: values[3].content.sha,
			}
		});
	}, (err) => {
		console.log(err);
		res.status(500).send({ error: 'could not create files' });
	});
});

router.post('/repo/update', function (req, res) {

	console.log("updating manifest", JSON.stringify(req.body.manifest, null, 4));
	const user = req.user;
	const repo = req.body.repo;
	const sha = req.body.sha;

	const message = req.body.message || "checkpoint commit";

	const libraries = dedup(flatten(req.body.flows.reduce((acc, node) => {
		if (node.type === "dbfunction") {
			acc = [...acc, matchLibraries(node.func)];
		}
		return acc;
	}, [])));

	const dockerfile = _generateDockerfile(libraries, req.config, req.body.manifest.name);
	const flowscontent = new Buffer(JSON.stringify(req.body.flows, null, 4)).toString('base64');
	const manifestcontent = new Buffer(JSON.stringify(_formatmanifest(req.body.manifest, req.config, user), null, 4)).toString('base64');
	const dockerfilecontent = new Buffer(dockerfile).toString('base64');

	return _createCommit(req.config, user, repo, sha.flows, 'flows.json', flowscontent, message, user.accessToken).then((data) => {
		return Promise.all([
			Promise.resolve(data.body.content.sha),
			_createCommit(req.config, user, repo, sha.manifest, 'databox-manifest.json', manifestcontent, message, user.accessToken)
		])
	}, (err) => {
		res.status(500).send({ error: err });
	}).then((values) => {
		return Promise.all([
			Promise.resolve(values[0]),
			Promise.resolve(values[1].body.content.sha),
			_createCommit(req.config, user, repo, sha.Dockerfile, 'Dockerfile', dockerfilecontent, message, user.accessToken)
		])
	}).then((values) => {

		res.send({
			result: 'success',
			repo: repo,
			sha: {
				flows: values[0],
				manifest: values[1],
				Dockerfile: values[2].body.content.sha,
			}
		});
	}, (err) => {
		console.log(err);
		res.status(500).send({ error: 'could not update the repo' });
	});

});


const _manifestStoreExists = (API, user) => {
	return new Promise((resolve, reject) => {
		request
			.get(`${API}/repos/${user.username}/databox-manifest-store`)
			.set('Accept', 'application/json')
			.set('Authorization', `token ${user.accessToken}`)
			.end((err, data) => {

				if (data.body && data.body.message && data.body.message === "Not Found") {
					resolve(null);
					return;
				}
				else if (err) {
					resolve(null)
					return;
				}
				resolve(true);
			});
	});
}



const _createNewRepo = (options) => {

	const { config, user, repo, description, message, data } = options;

	return new Promise((resolve, reject) => {

		request
			.post(`${config.github.API}/user/repos`)
			.send({
				"name": repo,
				"description": description,
				"private": false,
				"has_issues": false,
				"has_wiki": false,
				"has_downloads": false,
			})
			.set('Authorization', `token ${user.accessToken}`)
			.set('Accept', 'application/json')
			.end((err, data) => {
				if (err) {
					console.log("--> failed to create repo!");
					console.log(err);
					reject(err);
				}
				else {

					const result = data.body;

					//give github time it needs to set up repo

					setTimeout(
						function () {
							resolve({
								name: result.name,
								updated: result.updated_at,
								icon: result.owner.avatar_url,
								url: result.url
							})
						}, 2000
					);
				}
			})
	}).then((repo) => {
		return _addFile({
			config,
			username: user.username,
			repo: repo.name,
			filename: data.name,
			email: user.email || `${user.username}@me-box.com`,
			message: message,
			content: data.value,
			accessToken: user.accessToken,
		});
	})
}

const _fileExists = async (config, user, filename) => {

	return await _fetchFile(config, user.username, user.username, user.accessToken, "databox-manifest-store", filename).catch((err) => {
		return false;
	});

}

const _saveManifestToStore = async (config, user, content, filename) => {

	let repo = await _manifestStoreExists(config.github.API, user);
	if (!repo) {
		return await _createNewRepo({ config, user, repo: "databox-manifest-store", description: "databox manifest store", message: "first commit", data: { name: filename, value: content } });
	} else {

		const file = await _fileExists(config, user, filename);

		if (file) {
			return await _createCommit(config, user, "databox-manifest-store", file.sha, filename, content, "update commit", user.accessToken);
		} else {
			return await _addFile({
				config,
				username: user.username,
				repo: "databox-manifest-store",
				filename,
				email: user.email || `${user.username}@me-box.com`,
				message: "first commit",
				content,
				accessToken: user.accessToken,
			})
		}
	}
};

router.post('/publish', async (req, res) => {
	const user = req.user;
	const repo = req.body.repo;
	const manifest = {
		...req.body.manifest,
		datasources: [...req.body.manifest.datasources,
		{
			type: "personalLoggerActuator",
			required: false,
			name: "personalLoggerActuator",
			clientid: "personalLoggerActuator",
			granularites: [],
		}]
	}
	const flows = req.body.flows;
	const commitmessage = 'publish commit';
	sendmessage(user.username, "debug", { msg: `publishing manifest, ${JSON.stringify(manifest, null, 4)}` });

	//first save the manifest and flows file - either create new repo or commit changes	
	const libraries = dedup(flatten(flows.reduce((acc, node) => {
		if (node.type === "dbfunction") {
			acc = [...acc, matchLibraries(node.func)];
		}
		return acc;
	}, [])));

	//generate docker file
	const dockerfile = _generateDockerfile(libraries, req.config, manifest.name);

	//generate manifest file
	const manifestfile = JSON.stringify(_formatmanifest(manifest, req.config, user), null, 4);

	sendmessage(user.username, "debug", { msg: `dockerfile, ${dockerfile}` });

	if (repo && repo.sha && repo.sha.flows && repo.sha.Dockerfile) { //commit

		sendmessage(user.username, "debug", { msg: `commiting changes` });
		const flowcontent = new Buffer(JSON.stringify(flows, null, 4)).toString('base64');
		const manifestcontent = new Buffer(manifestfile).toString('base64');
		const dockerfilecontent = new Buffer(dockerfile).toString('base64');
		const message = commitmessage;

		const flowcommit = await _createCommit(req.config, user, repo.name, repo.sha.flows, 'flows.json', flowcontent, message, req.user.accessToken);
		const dockercommit = await _createCommit(req.config, user, repo.name, repo.sha.Dockerfile, 'Dockerfile', dockerfilecontent, message, req.user.accessToken);
		const manifestcommit = await _createCommit(req.config, user, repo.name, repo.sha.manifest, 'databox-manifest.json', manifestcontent, message, req.user.accessToken)

		//now add manifest to manifest store!
		const storecommit = await _saveManifestToStore(req.config, user, manifestcontent, `${repo.name}-manifest.json`);
		await _buildImage(req.config, user, manifest, JSON.stringify(flows), dockerfile);

		console.log("---flowcommit---", flowcommit.body.content.sha);

		console.log("full", flowcommit.body.content.sha);

		res.send({
			result: 'success',
			repo: repo.name,
			sha: {
				flows: flowcommit.body.content.sha,
				Dockerfile: dockercommit.body.content.sha,
				manifest: manifestcommit.body.content.sha,
			}
		});

	} else {
		const reponame = manifest.name.toLowerCase();
		const manifestcontent = new Buffer(JSON.stringify(_formatmanifest(manifest, req.config, user), null, 4)).toString('base64');
		const values = await _createRepo(req.config, user, reponame, manifest.description, flows, dockerfile, manifestfile, commitmessage, req.user.accessToken);

		console.log("ok values are", values);
		await _saveManifestToStore(req.config, req.user, manifestcontent, `${reponame}-manifest.json`);
		await _buildImage(req.config, user, manifest, JSON.stringify(flows), dockerfile);
		res.send({
			result: 'success',
			repo: reponame,
			sha: {
				flows: values[0].content.sha,
				Dockerfile: values[1].content.sha,
				manifest: values[2].content.sha,
			}
		});
	}
});



module.exports = router;
