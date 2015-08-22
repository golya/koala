/*global describe, it*/
'use strict';
var superagent = require('supertest');
var app = require('../app');

var userAgent = superagent.agent(app.listen());
var user = {username: 'mail@mail.hu', password: 'test'};

describe('Routes', function () {

    beforeEach(function (done) {
        userAgent
            .post('/auth')
            .send(user)
            .end(onResponse);

        function onResponse(err, res) {
            done();
        }
    });
    describe('GET /', function () {
        it('should return 200', function (done) {
            userAgent
                .get('/')
                .expect(200, done);
        });
    });
    describe('GET /messages', function () {
        it('should return 200', function (done) {
            userAgent
                .get('/messages')
                .expect('Content-Type', /json/)
                .expect(200, done);
        });
    });
    describe('GET /messages/notfound', function () {
        it('should return 404', function (done) {
            userAgent
                .get('/messages/notfound')
                .expect(404, done);
        });
    });
});
