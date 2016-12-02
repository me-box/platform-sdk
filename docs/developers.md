#Developing the SDK

This document will take you through all you need to know in order to contribute/develop the SDK further.  If you are simply looking to write apps, then please refer to the [using the sdk](./tutorial.html).

##Technical Overview

The SDK is a re-implementation of [node red](https://nodered.org/) a visual programming environment for developing IoT applications.  Node-red consists of a server execution environment (nodejs) and an HTML5 client-side editor.  The principal changes have been made to the client code, where the features relevant to the SDK have been re-written to use [React](https://facebook.github.io/react/) and [Redux](https://github.com/reactjs/redux).  The core node-red server side code has not changed; there are a number of new databox 'nodes' which adhere to the node-red guidelines/spec, and rather than rely on a single node-red server instance, a new dockerised instance is created for each user of the SDK when a 'flow' (aka app) is deployed for testing.

##Setting up a dev environment

#A dev environment requires the following components to be installed

The SDK dev environment is dependent on [Docker](https://www.docker.com/)


##Creating a new node 
