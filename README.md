# vdm-tools

### Scrap and serve VDM from [http://viedemerde](http://viedemerde.fr)

## Installation
```bash
git clone https://github.com/FXHibon/vdm-tools
cd vdm-tools
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
