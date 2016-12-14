#What is databox?

The Databox is an open-source personal networked device, augmented by cloud-hosted services, that collates, curates, and mediates access to an individual’s personal data by verified and audited third party applications and services. The Databox will form the heart of an individual’s personal data processing ecosystem, providing a platform for managing secure access to data and enabling authorised third parties to provide the owner with authenticated services, including services that may be accessed while roaming outside the home environment.

Databox has several key components these are:

###Data Sources
These are not technically part of Databox. They are: IoT devices, online accounts and other connected sources of data.  

###Drivers
Drivers are responsible for interfacing between the Databox and data sources. They provide a mechanism for extracting data from a data source into a data store.

###Data Stores
Data stores are a core part of the Databox Architecture. They record data; either **primary**, originating with a source; or **derived**, the result of computation over one or more other stores. They make this data available to other components on presentation of appropriate credentials. All accesses to datastores are logged, to provide a complete audit trail of data use.

###Apps
Applications are the process data in on the databox in order to accomplish a task.  The set of *things* an application can do (i.e. actuate, send data externally, access specific stores) is restricted to what was negotiated in a contract (SLA) at install. A Databox may support many applications, each installed with the permission of a databox user. 


###The App Store
Each app store is a service to which Databox users can connect to discover applications they might wish to install.  App stores may validate and verify the apps that they provide.  App stores can present only those apps that are relevant to a particular databox (i.e. one that has the appropriate set of datasources connected to it)


###The Databox SDK
IoT apps have a large number of moving parts.  The Databox SDK is a visual programming environment that facilitates the development, testing and publishing of databox apps.