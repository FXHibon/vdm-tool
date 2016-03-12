/**
 * Exposes REST API to access VDM items
 */

module.exports = _constructor;

/**
 * Construct Router object
 * @param conf Configuration
 * @returns {*}
 * @private
 */
function _constructor(conf) {
    var router = require('express').Router();
    var service = require('./api.service')(conf);
    var logger = require('debug')('vdm:routes');


    router.get('/posts', function (req, resp) {
        service.getPosts(req.query, function (err, items) {
            var status, data;
            if (err) {
                data = err;
                if (err instanceof service.BadRequest) {
                    status = 400;
                } else {
                    status = 500;
                }
            } else {
                status = 200;
                data = items;
            }
            resp.status(status).json(data);
        });
    });

    router.get('/posts/:id', function (req, resp) {
        service.getPost(req.params.id, function (err, item) {
            var status, data;
            if (err) {
                data = err;
                if (err instanceof service.NotFound) {
                    status = 404;
                } else {
                    status = 400;
                }
            } else {
                status = 200;
                data = item;
            }
            resp.status(status).json(data);
        });
    });

    return router;
}
