What is databox?
---------------

The Databox is an open-source personal networked device, augmented by cloud-hosted services, that collates, curates, and mediates access to an individual’s personal data by verified and audited third party applications and services. The Databox will form the heart of an individual’s personal data processing ecosystem, providing a platform for managing secure access to data and enabling authorised third parties to provide the owner with authenticated services, including services that may be accessed while roaming outside the home environment.

Databox has several key components these are:

###Data Sources
These are not technically part of Databox. They are you IoT devices, online accounts and other connected sources of data.  

###Drivers

Drivers are responsible for interfacing between the Databox and data sources. Providing a mechanism for extracting data from a data source into a data store.

###Data Stores

Datastores are a core part of the Databox Architecture. They record personal data, either **primary**, originating with a source; or **derived**, the result of computation over one or more other stores. They make this data available to other components on presentation of appropriate credentials. All accesses to datastores are logged, providing a complete audit trail of data use.

###Apps

A Databox may support many applications, each installed with the permission of the owner. Applications may be proposed by data processors having discovered Databoxes with stores of interest, or they may be discovered in the app store and installed by the subject. Applications are implemented as derived stores to which external parties -- whether data processing organisations or a browser operated by the data subject -- can connect.

###The App Store

Each app store is a service to which Databox users can connect to discover applications they might wish to install. The apps will be validated and verified; they can only have limited, approved external communication to their own servers or dedicated Datastore.


###The Databox SDK

IoT apps have a large number of moving parts.  The Databox SDK is a visual programming environment that facilitates the development, testing and publishing of databox apps.