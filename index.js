/**
 * Created by fx on 11/03/2016.
 */

var conf = require('./package.json');
var program = require('commander');

program
    .version(conf.version)
    .option('-f, --fetch', 'Retrieve VDM items from viedemerde.fr')
    .option('-s, --serve', 'Serve local VMD items from local storage though REST API')
    .parse(process.argv);

if (program.fetch) {
    console.log('fetch');
    require('scrapper')
}

if (program.serve) {
    console.log('serve');
    require('server');
}