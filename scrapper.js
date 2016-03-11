/**
 * Created by fx on 11/03/2016.
 */

module.exports = _constructor;


function _constructor(conf) {
    var debug = require('debug')('vdm:scrapper');
    var async = require('async');
    var osmosis = require('osmosis');
    var MongoClient = require('mongodb').MongoClient;

    var MAX = conf.maxItems;
    var URL = conf.remoteUrl;

    var count = 0;

    /**
     * Extract/parse date from given 'dateAndAuthor' field
     * @param dateAndAuthor
     * @returns {Date}
     */
    var parseDate = function (dateAndAuthor) {
        var pattern = /(\d{2})\/(\d{2})\/(\d{4}) à (\d{2}:\d{2})/;
        var tmpStr = dateAndAuthor.substr(3, 18);
        tmpStr = tmpStr.replace(pattern, '$3-$2-$1T$4');
        return new Date(tmpStr);
    };

    /**
     * Extract author from given 'dateAndAuthor' field
     * @param dateAndAuthor
     * @returns {string|*}
     */
    var parseAuthor = function (dateAndAuthor) {
        var sepIndex = dateAndAuthor.indexOf('par ') + 'par '.length;
        var tmpStr = dateAndAuthor.substr(sepIndex);
        var finalSep = tmpStr.lastIndexOf('(');
        if (finalSep != -1) {
            tmpStr = tmpStr.substr(0, finalSep - 1);
        }
        return tmpStr;
    };

    async.waterfall([
        function (cb) {
            debug('Connecting to ', conf.mongoUrl);
            MongoClient.connect(conf.mongoUrl, cb);
        },
        function (db, cb) {
            debug('Connected to db. Cleaning collection...');
            var collection = db.collection('items');
            collection.removeMany({}, function (err) {
                cb(err, db, collection);
            })
        },
        function (db, collection, cb) {
            debug('Starting VDM scrapper');
            var instance = osmosis
                .get(URL)
                .find('.post.article')
                .set({
                    _id: '@id',
                    content: 'child::*',
                    dateAndAuthor: '.date .right_part p[2]'
                })
                .paginate('.pagination ul.right li[2] a', 15)
                .data(function (vdmItem) {
                    debug('VDM ', count + 1, ' / ', MAX);

                    // Format fields: split 'dateAndAuthor' field into 2 individuals fields
                    vdmItem.date = parseDate(vdmItem.dateAndAuthor);
                    vdmItem.author = parseAuthor(vdmItem.dateAndAuthor);
                    delete vdmItem.dateAndAuthor;

                    // Save
                    collection.insert(vdmItem);

                    // End condition
                    if (++count >= MAX) {
                        debug(MAX, ' items fetched, stopping scraper');
                        db.close();
                        instance.stop();
                        cb(null);
                    }
                });
        }
    ], function (err) {
        if (err) throw err;
    });
}