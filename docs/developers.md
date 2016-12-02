#Developing the SDK

This document will take you through all you need to know in order to contribute/develop the SDK further.  If you are simply looking to write apps, then please refer to the [using the sdk](./tutorial.html).

##Technical Overview

The SDK is a re-implementation of [node red](https://nodered.org/) a visual programming environment for developing IoT applications.  Node-red consists of a server execution environment (nodejs) and an HTML5 client-side editor.  The principal changes have been made to the client code, where the features relevant to the SDK have been re-written to use [React](https://facebook.github.io/react/) and [Redux](https://github.com/reactjs/redux).  The core node-red server side code has not changed; there are a number of new databox 'nodes' which adhere to the node-red guidelines/spec, and rather than rely on a single node-red server instance, a new dockerised instance is created for each user of the SDK when a 'flow' (aka app) is deployed for testing.

##Setting up a dev environment

The dev environment consists of a nodejs server and a set of docker components.

###Dependencies

A dev environment has the dependencies on the following components

* A docker registry
* A databox app store

It will also create docker components for:

* mongo
* redis
* mock datasource (used as a source of test data for apps)
 
It will also require the following software to be installed

* [Docker] (https://docs.docker.com/engine/installation/)
* [Docker compose] (https://docs.docker.com/compose/)
* [Nodejs/npm] (https://nodejs.org)


###Step by step install: install base software

1. Install docker (https://docs.docker.com/engine/installation)
2. Install nodejs (https://nodejs.org)
3. mkdir databox
4. cd databox

###Build docker containers

5. git clone https://github.com/tlodge/databox-editor-docker.git
6. cd databox-editor-docker.git
7. docker-compose up -d
8. Assuming all builds as expected, docker ps will have the following containers running:

CONTAINER ID        IMAGE                                 COMMAND                  CREATED              STATUS              PORTS                      NAMES
90f2f0e7ff0f        databoxeditordocker_appserver         "/root/start.sh"         About a minute ago   Up 3 seconds        0.0.0.0:8091->8091/tcp     app-server
7b4befe59acb        databoxeditordocker_mock-datasource   "/root/start.sh"         About a minute ago   Up About a minute   8080/tcp                   mock-datasource
7f71791c5e12        databoxeditordocker_mongo             "/usr/bin/mongod -..."   About a minute ago   Up About a minute   0.0.0.0:27017->27017/tcp   mongo
c41a437c4703        databoxeditordocker_redis             "/usr/bin/redis-se..."   About a minute ago   Up 3 seconds        0.0.0.0:6379->6379/tcp     redis

###Build base node-red images

9.  Create the node-red base images - these are used to build containers for testing and publishing node red apps.

10. cd databox-editor-docker/node-red-base && ./build.sh

11. cd databox-editor-docker/node-red-tester && build.sh

12. cd databox-editor-docker/node-red-databox-base && build.sh

13. cd databox-editor-docker/node-red-databox && build.sh

###Build the (SDK) editor







