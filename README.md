# Getting started with the databox editor

The databox editor is a reimplementation of the node-red frontend and is currently the main tool for building databox apps.  The code is written in Javascript.  To get running, you'll need a number of components, which are detailed in this guide.  The following is a high-level overview of the components and how they currently fit together:

[diagram to be added]

The databox editor requires the following:

* Node red
* Docker
* Databox editor (client & server)
* Companion app
* Mock datasource

The following instructions assume a recent (14.04 / 16.04) version of ubuntu, but it should be simple enough to get it running on other Linux flavours.  

## Node red

Node red has a client (the graphical tool for building flows) and a server (a nodejs application that executed the flows).  We currently make use of an node-red server component, with a few purpose built databox-nodes.  To compile and run this, do the following

1. install the nodejs ecosystem:
```
apt-get install -y nodejs
apt-get install -y npm
ln -s /usr/bin/nodejs /usr/bin/node
```
2. get/build the latest node red version:
```
npm install -g grunt-cli
git clone https://github.com/me-box/node-red.git
cd node-red && npm install && grunt build  
```
3. To test whether this has installed successfully, cd to the node-red directory then run:

```
node red
```
4. In a web browser, navigate to localhost:1880, and ensure that the node-red editor is running.

## Docker

The databox editor allows users to test flows before packaging them up and installing them to the app store.  It accomplishes this by deploying flows to the node-red backend.  Because node-red has no support for multiple users, a single set of flows can only ever be run on the node-red backend at one time.  To deal with this, each user will have their own (containerised) instance of node-red for testing their deployments. 

Details on installing docker can be found here: 

[https://docs.docker.com/engine/installation/] (https://docs.docker.com/engine/installation/)

## Databox editor client & server

This is the main graphical interface for building node-red flows.  It is written in Javascript using the Facebook's React and Flux frameworks.  It has the following dependencies:

* Redis  
	
see: [http://redis.io/topics/quickstart](http://redis.io/topics/quickstart) or:
```
	apt-get install -y redis-server
```

* Mongo  
	
see: [https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/](https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/)
	
* A github developer application (developers login to the databox editor using github's oAuth) 
		
* go to: https://github.com/settings/developers
* click on: 'register a new application'
* give it an application name eg: databox
* give it an application url  eg: https://github.com/me-box
* give it an application description eg: Databox application builder
* give it a callback url:  http://[yourservername]/auth/github/callback
		
* A databox app store & Docker registry
	
Apps are published to the databox app store. When an app is published (from the databox editor), a manifest file is uploaded to the app store, and a node red container is built with the datastore app (node red flow).  This container is published to a docker registry.  There is one running at store.upintheclouds.org and http://datashop.amar.io which you should be able to test with, but ideally you should run your own, 

see:  [https://github.com/me-box/databox-app-server](https://github.com/me-box/databox-app-server) for instructions on installing
		
		
* Now you can install the databox editor (we assume you have already installed nodejs earlier)

1. Pull code and build nodejs modules:
```
	git clone https://github.com/me-box/iot.red.git
    cd [rootdir]/iot.red/red-server && npm install
    cd [rootdir]/iot.red/node-red-react-editor && npm install
```
2. Create/Edit the server config files:
```
	cd [rootdir]/iot.red/red-server
	cp config.sample.js config.js
```
Update the config file with your details (should be fairly self-explanatory).  
3. Create/Edit the client config files:
```
	cd [rootdir]/iot.red/node-red-react-editor/js
	cp config.sample.js config.js
```
Update the config file with your details (again, should be fairly self-explanatory). 
4.  Build/run the client (production)
The editor uses webpack to transpile/minify the code.  There are two webpack files in  the [rootdir]/iot.red/node-red-react-editor directory.  Each has references to the public url of the editor (currently http://databox.upintheclouds.org/) - change these to the url of your server.
	
Now:
```	
	cd [rootdir]/iot.red/
	./startprod.sh
```
This will compile the javascript then run the databox editor server.  Assuming no changes to the javascript, you can also just run the server directly:
```
	cd [rootdir]/iot.red/red-server
	npm start
```
If you are developing, you can also run dev mode which will watch for code changes and recompile, and provide some client side debugging tools:
```	
	cd [rootdir]/iot.red
	./startdev.sh
```	
	
## Companion app

The companion app is a webapp that runs on a databox user's device and can be a recipient of messages from databox apps.  The companion app has a node red node and messages can be sent to it to be displayed on the screen.  The companion app currently has a interface for browsing the app store (databox-app-server) and installing an app, though this will be superseded by an interface currently being developed for the container manager.

The companion app is also used by the databox editor to support testing.  When flows with a companion app node are tested, a mockup of a mobile phone screen will display messages in the test environment as they would appear on an end user's device.

The companion app has client and server components.  The server subscribes to a mqtt broker,  listening to messages from its node red node.  It then pushes messages over a websocket to its client.

The steps for installing the companion app are as follows:
```
   git clone https://github.com/me-box/databox-companion-app.git
   cd [rootdir]/databox-companion-app/client && npm install
   cd [rootdir]/databox-companion-app/server && npm install
   cd [rootdir]/databox-companion-app/client && npm run build
```
To run it:

```
   cd [rootdir]/databox-companion-app/server && npm run start  
``` 

## Mock datastore.

The mock datastore creates mock sensor data and publishes it to a mqtt broker.  It is used to provide dummy data for testing apps. The steps for installing it are as follows:
   
```
   git clone https://github.com/me-box/databox-datasource-mock.git
   cd [rootdir]/databox-datasource-mock && npm install
   npm start	
```