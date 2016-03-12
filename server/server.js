/**
 * Created by fx on 11/03/2016.
 */

module.exports = _constructor;

/**
 * Constructs server
 * @param conf Configuration
 * @private
 */
function _constructor(conf) {
    var express = require('express');
    var app = express();
    var morgan = require('morgan');
    var logger = require('debug')('vdm:server');

    var port = conf.port;

    var routes = require('./routes')(conf);

    app.use(morgan('dev'));
    app.use('/api', routes);

    app.listen(port, function () {
        logger('API listening on ' + port);
        logger('Try http://localhost:' + port + '/api/posts');
    });
}

