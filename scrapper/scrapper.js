/**
 * Created by fx on 11/03/2016.
 */

/**
 * Exports constructor
 * @type {_constructor}
 */
module.exports = _constructor;

/**
 * Construct and launch the scrapper
 * @param conf Configuration
 * @param cb Call when scrapper is done. Optional param
 * @private
 */
function _constructor(conf, cb) {
    var logger = require('debug')('vdm:scrapper');
    var async = require('async');
    var osmosis = require('osmosis');
    var MongoClient = require('mongodb').MongoClient;

    var MAX = conf.maxItems;
    var URL = conf.remoteUrl;

    var finalCb = cb;

    var count = 0;

    var utils = require('./scrapper-utils');

    var parseDate = utils.parseDate;
    var parseAuthor = utils.parseAuthor;

    async.waterfall([
        // DB connection
        function (cb) {
            logger('Connecting to ', conf.mongoUrl);
            MongoClient.connect(conf.mongoUrl, cb);
        },

        // DB Cleaning
        function (db, cb) {
            logger('Connected to db. Cleaning collection...');
            var collection = db.collection('items');
            collection.removeMany({}, function (err) {
                cb(err, db, collection);
            })
        },

        // Scrapping
        function (db, collection, cb) {
            logger('Starting VDM scrapper');
            var items = [];
            var instance = osmosis
                .get(URL)
                .find('.post.article')
                .set({
                    _id: '@id',
                    content: 'child::*',
                    dateAndAuthor: '.date .right_part p[2]'
                })
                .paginate('.pagination ul.right li[2] a', 15)
                .then(function (context, vdmItem) {
                    logger('VDM ', count + 1, ' / ', MAX);

                    // Format fields: split 'dateAndAuthor' field into 2 individuals fields
                    vdmItem.date = parseDate(vdmItem.dateAndAuthor);
                    vdmItem.author = parseAuthor(vdmItem.dateAndAuthor);
                    delete vdmItem.dateAndAuthor;

                    // Save
                    items.push(vdmItem);

                    // End condition
                    if (++count >= MAX) {
                        logger(MAX, ' items fetched, stopping scraper');
                        instance.stop();
                        cb(null, db, collection, items);
                    }
                });
        },

        // Saving into db
        function (db, collection, items, cb) {
            logger('Saving ', items.length, ' items into db');
            collection.insertMany(items, function (err) {
                err && cb(err);
                db.close();
                cb(null)
            });
        }

    ], function (err) {
        logger('Scrapper done');
        if (finalCb) {
            finalCb(err);
        } else if (err) {
            throw err;
        }
    });
}