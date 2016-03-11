/**
 * Created by fx on 11/03/2016.
 */

var logger = require('debug')('vdm:app');
var info = require('./package.json');
var program = require('commander');
var configuration = require('./configuration.json');

program
    .version(info.version)
    .option('-f, --fetch', 'Retrieve VDM items from viedemerde.fr')
    .option('-s, --server', 'Serve VDM items from local storage though REST API')
    .parse(process.argv);

// Starts scrapper
if (program.fetch) {
    logger('fetch');
    require('./scrapper')(configuration);
}

// Starts REST API
if (program.server) {
    logger('server');
    require('./server')(configuration);
}

// Default action
if (!program.fetch && !program.server) {
    program.help();
}