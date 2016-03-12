/**
 * Created by fx on 11/03/16.
 */

var should = require('should');
var utils = require('../scrapper/scrapper-utils');
var async = require('async');
var MongoClient = require('mongodb');

describe('Scrapper', function () {

    describe('utils', function () {

            describe('#parseAuthor()', function () {
                it('should extract \'unPseudo\'', function () {
                    var res = utils.parseAuthor(' - par unPseudo');
                    res.should.be.exactly('unPseudo');
                });

                it('should extracts \'Anonyme\'', function () {
                    var res = utils.parseAuthor(' - par Anonyme (femme)');
                    res.should.be.exactly('Anonyme');
                });
            });

            describe('#parseDate()', function () {
                it('should not be invalid', function () {
                    var myDate = utils.parseDate('Le 11/03/2016 à 10:51 -');
                    myDate.should.not.be.eql('Invalid Date');
                })
            });

        describe('#formatVdmItem()', function () {
            it('should format an item', function () {
                var formated = utils.formatVdmItem({
                    _id: '123456789',
                    content: 'This is a VDM',
                    dateAndAuthor: 'Le 11/03/2016 à 10:51 - par oups'
                });

                formated.should.have.property('date').which.is.a.Date();
                formated.should.have.property('author').which.is.a.String();
                formated.should.not.have.property('dateAndAuthor');
            });
        });

        }
    );

    describe('scrapper', function () {
        describe('#constructor()', function () {

            var scrapper;
            var conf;
            beforeEach(function () {
                scrapper = require('../scrapper/scrapper');
                conf = require('../configuration.json');
            });

            it('should scrap 10 items', function (done) {
                conf.maxItems = 10;
                async.waterfall([
                    function (cb) {
                        scrapper(conf, cb);
                    },
                    function (cb) {
                        MongoClient.connect(conf.mongoUrl, cb);
                    },
                    function (db, cb) {
                        db.collection('items').count({}, {}, function (err, res) {
                            cb(err, res, db);
                        });
                    },
                    function (count, db, cb) {
                        should.exist(count);
                        count.should.be.exactly(10);
                        db.close();
                        cb();
                    }
                ], function (err) {
                    done(err);
                });
            });

            it('should format item correctly', function (done) {
                async.waterfall([
                    function (cb) {
                        conf.maxItems = 1;
                        scrapper(conf, cb);
                    },
                    function (cb) {
                        MongoClient.connect(conf.mongoUrl, cb);
                    },
                    function (db, cb) {
                        db.collection('items').findOne({}, function (err, doc) {
                            cb(err, doc, db);
                        });
                    },
                    function (doc, db, cb) {
                        should.exist(doc);
                        doc.should.have.property('_id').which.is.String();
                        doc.should.have.property('content').which.is.String();
                        doc.content.should.endWith('VDM');
                        doc.should.have.property('author').which.is.String();
                        doc.should.have.property('date').which.is.Date();
                        db.close();
                        cb();
                    }
                ], function (err) {
                    done(err);
                });
            });
        });
    });
});


