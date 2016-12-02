
What is databox
---------------

The Databox envisions an open-source personal networked device, augmented by cloud-hosted services, that collates, curates, and mediates access to an individual’s personal data by verified and audited third party applications and services. The Databox will form the heart of an individual’s personal data processing ecosystem, providing a platform for managing secure access to data and enabling authorised third parties to provide the owner with authenticated services, including services that may be accessed while roaming outside the home environment.

Databox has several key components these are:

###Data Sources
These are not technically part of Databox. They are you IoT devices, online accounts and other connected sources of data.  

###Drivers

Drivers are responsible for interfacing between the Databox and data sources. Providing a mechanism for extracting data from a data source into a data store.

###Data Stores

Datastores are a core part of the Databox Architecture. They record personal
data, either **primary**, originating with a source; or **derived**, the result
of computation over one or more other stores. They make this data available to
other components on presentation of appropriate credentials. All accesses to
datastores are logged, providing a complete audit trail of data use.

###Apps

A Databox may support many applications, each installed with the permission of the owner. Applications may be proposed by data processors having discovered Databoxes with stores of interest, or they may be discovered in the app store and installed by the subject. Applications are implemented as derived stores to which external parties -- whether data processing organisations or a browser operated by the data subject -- can connect.

###The App Store

Each app store is a service to which Databox users can connect to discover applications they might wish to install. The apps will be validated and verified; they can only have limited, approved external communication to their own servers or dedicated Datastore.

Databox SDK
===========

The databox SDK is a visual programming environment for building databox apps. The goal of the Databox SDK is to enable the rapid development of Databox applications with existing databox components.


Getting started
---------------

Frist, make sure you have a GitHub account!

   1. Then visit https://sdk.iotdatabox.com/ and log in using the link at the bottom of the screen. 
   2. Then Log in to git hub and Authorize application
   

Run your first examples
---------------------------

To access the example apps click load on the toolbar shown below:

![toolbar](https://raw.githubusercontent.com/me-box/iot.red/master/docs/images/toolbar.png "toolbar")

Then enter "tlodge" into the user box and press browse. 

![browse](https://raw.githubusercontent.com/me-box/iot.red/master/docs/images/browse.png "browse")

A list of available examples will then be shown on the left-hand side. Dubble click on the node and have a look around. 

To run the app and see its output you can use testing mode, by clicking the test button. This can be found in the top left of the screen.  


Your first app
--------------

### datastores, processors and outputs

### free memory chart

![alt-text](https://raw.githubusercontent.com/me-box/iot.red/master/docs/images/firstapp.png "databox demo overview")

### testing

Functions
---------


