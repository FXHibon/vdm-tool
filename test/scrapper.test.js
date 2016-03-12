/**
 * Created by fx on 11/03/16.
 */

var should = require('should');
var utils = require('../scrapper/scrapper-utils');
var async = require('async');
var MongClient = require('mongodb');

describe('Scrapper', function () {

    describe('utils', function () {

            describe('#parseAuthor()', function () {
                it('should works', function () {
                    var res = utils.parseAuthor(' - par unPseudo');
                    res.should.be.exactly('unPseudo');
                });

                it('should works', function () {
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
        }
    );

    describe('scrapper', function () {

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
                    MongClient.connect(conf.mongoUrl, cb);
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
                should.not.exist(err);
                done();
            });
        })
    });

});


