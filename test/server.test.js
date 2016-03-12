/**
 * Created by fx on 12/03/16.
 */

var should = require('should');
var async = require('async');
var conf = require('../configuration.test.json');
var MongoClient = require('mongodb');
var testData = require('./dump.json');

describe('api.service', function () {

    var apiService = require('../server/api.service')(conf);

    // Import test data
    before(function (done) {
        async.waterfall([
            function (cb) {
                MongoClient.connect(conf.mongoUrl + conf.dbName, cb);
            },
            function (db, cb) {
                db.collection('items').remove({}, function (err) {
                    cb(err, db);
                });
            },
            function (db, cb) {

                testData = testData.map(function (item) {
                    item.date = new Date(item.date);
                    return item;
                });

                db.collection('items').insertMany(testData, function (err) {
                    cb(err, db);
                });
            },
            function (db, cb) {
                db.close();
                cb()
            }
        ], function (err) {
            done(err);
        });
    });

    describe('#getPosts()', function () {

        it('should find all posts', function (done) {
            apiService.getPosts({}, function (err, items) {
                should.exist(items);
                items.should.have.property('posts').which.is.an.Array();
                items.should.have.property('count').which.is.an.Number();
                items.posts.length.should.be.exactly(testData.length);
                items.count.should.be.exactly(testData.length);
                done()
            });
        });

        it('should retrieve one VDM from Greys92', function (done) {
            apiService.getPosts({author: 'Greys92'}, function (err, res) {
                should.not.exist(err);
                should.exist(res);
                res.should.have.property('count').which.is.a.Number();
                res.should.have.property('posts').which.is.an.Array();
                res.count.should.be.exactly(1);
                res.posts[0].author.should.be.exactly('Greys92');
                done();
            });
        });

        it('should retrieve only a subset of VDM starting from a date', function (done) {
            apiService.getPosts({from: '2016-02-11'}, function (err, res) {
                should.not.exist(err);
                should.exist(res);
                res.should.have.property('count').which.is.a.Number();
                res.should.have.property('posts').which.is.an.Array();
                res.count.should.be.exactly(3);
                done();
            })
        });

        it('should retrieve only a subset of VDM older than given date', function (done) {
            apiService.getPosts({to: '2016-01-12'}, function (err, res) {
                should.not.exist(err);
                should.exist(res);
                res.should.have.property('count').which.is.a.Number();
                res.should.have.property('posts').which.is.an.Array();
                res.count.should.be.exactly(2);
                done();
            })
        });

        it('should retrieve only a subset of VDM between two dates', function (done) {
            apiService.getPosts({from: '2015-12-11', to: '2016-02-12'}, function (err, res) {
                should.not.exist(err);
                should.exist(res);
                res.should.have.property('count').which.is.a.Number();
                res.should.have.property('posts').which.is.an.Array();
                res.count.should.be.exactly(2);
                done();
            })
        });

    });

    describe('#getPost()', function () {
        it('should find one post', function (done) {
            apiService.getPost(8690505, function (err, item) {
                should.not.exist(err);
                should.exist(item);
                item.should.have.property('post').which.is.an.Object();
                item.post.id.should.be.exactly(8690505);
                done();
            })
        });

        it('should throw NotFound', function (done) {
            apiService.getPost(999999, function (err, item) {
                should.exist(err);
                err.should.be.instanceOf(apiService.NotFound);
                done();
            })
        });
    });
});