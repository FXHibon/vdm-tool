/*
 * VDM service for accessing VDM items
 */

/**
 * Exports constructor
 * @type {_constructor}
 */
module.exports = _constructor;

/**
 * Constructs API service
 * @param conf Configuration
 * @returns {_constructor}
 * @private
 */
function _constructor(conf) {

    this.getPost = _getPost;
    this.getPosts = _getPosts;
    this.NotFound = _NotFound;
    this.BadRequest = _BadRequest;

    var configuration = conf;
    var MongoClient = require('mongodb');
    var logger = require('debug')('vdm:service');
    var db;

    MongoClient.connect(configuration.mongoUrl + configuration.dbName, function (err, res) {
        if (err) throw err;
        logger('Connected to DB: ' + configuration.mongoUrl + configuration.dbName);
        db = res;
    });

    /**
     * Find the VDM item matching given id
     * @param id Id to find
     * @param cb Callback
     */
    function _getPost(id, cb) {
        db.collection('items').findOne({_id: parseInt(id)}, function (err, res) {
            if (err) {
                cb(err);
                return;
            }

            if (res) {
                res.id = res._id;
                delete res._id;
                cb(null, {
                    post: res
                });
            } else {
                cb(new _NotFound(id + ' not found'));
            }

        });
    }

    /**
     * Find all VDMs
     * @param query Param: from, to, author
     * @param cb Callback
     */
    function _getPosts(query, cb) {

        var findQuery = {};

        if (query.author) {
            findQuery.author = query.author;
        }

        var date;
        if (query.from) {
            date = new Date(query.from);
            if (date == 'Invalid Date') {
                cb(new _BadRequest(query.from + ' is not a valid date'));
                return;
            }
            findQuery.date = {$gte: new Date(query.from)};
        }
        if (query.to) {
            date = new Date(query.to);
            if (date == 'Invalid Date') {
                cb(new _BadRequest(query.to + ' is not a valid date'));
                return;
            }
            if (!findQuery.date) findQuery.date = {};
            findQuery.date.$lte = new Date(query.to);
        }

        db.collection('items').find(findQuery).sort({date: -1}).toArray(function (err, res) {
            if (err) {
                cb(err);
                return;
            }

            // '_id' => 'id'
            var items = res.map(function (item) {
                item.id = item._id;
                delete item._id;
                return item;
            });
            cb(null, {
                count: items.length,
                posts: items
            })
        });
    }

    /**
     * Custom error: trigger when item is not found
     * @param msg Error message
     * @private
     */
    function _NotFound(msg) {
        this.message = msg;
    }

    /**
     * Custom error: trigger when parameter is not valid
     * @param msg Error message
     * @private
     */
    function _BadRequest(msg) {
        this.message = msg;
    }

    return this;
}