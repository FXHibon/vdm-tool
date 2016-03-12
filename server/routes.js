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

    router.get('/posts', function (req, resp) {
        service.getPosts(function (err, items) {
            resp.status(200).json(items);
        });
    });

    router.get('/posts/:id', function (req, resp) {
        service.getPost(req.query.id, function (err, item) {
            resp.status(200).json(item);
        })
    });

    return router;
}
