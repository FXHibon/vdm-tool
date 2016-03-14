# vdm-tool

### Scrap and serve VDM from [http://viedemerde](http://viedemerde.fr)

## Installation
```bash
git clone https://github.com/FXHibon/vdm-tool
cd vdm-tool
npm install
```

## Usage

#### Log
In order to log on standard output, set an en variable like this:
```bash
export DEBUG=vdm:*
```

### DB
Before starting vdm-tools, ensure you have a MongoDb instance running.
DB connection url can be modified in config file

### Scrap
```bash
./index.js --fetch
```

### Serve
```bash
./index.js --serve
```

* __/api/posts__: list all VDM
* __/api/posts?author=x__: list all VDM from given author
* __/api/posts?from=x__: list all VDM after x
* __/api/posts?to=x__: list all VDM before x
* __/api/posts?from=x&to=y__: list all VDM between x and y
* __/api/posts/:id__: get one VDM

### Display help
```bash
./index --help
```

### Tests
```bash
npm test
```

Tested on linux.

### Configuration

You can customize some parameters through config file. Available parameters are:

* __maxItems__: how many items will be retrieved
* __remoteUrl__: viedemerde url, should not be changed
* __mongoUrl__: Mongo instance url
* __dbName__: DB name where the items will be stored
* __port__: Determine wich port will be used by the REST API
