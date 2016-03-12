/*
 * VDM service for accessing VDM items
 */

module.exports = _constructor;

/**
 * Construct API service
 * @param conf Configuration
 * @returns {_constructor}
 * @private
 */
function _constructor(conf) {
    this.getPost = _getPost;
    this.getPosts = _getPosts;
    this.NotFound = _NotFound;

    var configuration = conf;
    var MongoClient = require('mongodb');
    var logger = require('debug')('vdm:service');
    var db;

    MongoClient.connect(configuration.mongoUrl + configuration.dbName, function (err, res) {
        if (err) throw err;
        logger('Connected to DB');
        db = res;
    });

    /**
     * Find the VDM matching given id
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
     * @param cb Callback
     */
    function _getPosts(cb) {
        db.collection('items').find({}).toArray(function (err, res) {
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
                posts: items,
                count: items.length
            })
        });
    }

    /**
     * Custom error
     * @param msg Error message
     * @private
     */
    function _NotFound(msg) {
        this.message = msg;
    }

    return this;
}