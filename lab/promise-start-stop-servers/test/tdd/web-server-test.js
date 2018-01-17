'use strict';

var Promise = require('bluebird');
var assert = require('chai').assert;
var lodash = require('lodash');
var path = require('path');
var fetch = require('node-fetch');
var DT = require('devebot-test');
var TS = require('devebot-test').toolset;
var debugx = require('debug')('tdd:testing-with-nodejs:promise-start-stop-servers');

describe('testing-with-nodejs:promise-start-stop-servers:web-server-test', function() {
  this.timeout(60000);

  describe('single web service', function() {
    beforeEach(function(done) {
      TS.processRunner
        .start({
          apps: [
            {
              name: 'server1',
              script: path.join(__dirname, '../../lib/web-server.js'),
              env: {
                'PORT': '9001',
              }
            }
          ]
        })
        .then(function() {
          done();
        })
        .catch(done);
    });

    it('should start/stop processes properly', function(done) {
      TS.processRunner
        .list()
        .then(function(procs) {
          debugx.enabled && debugx('list() result: %s', JSON.stringify(procs, null, 2));
          assert.sameDeepMembers(lodash.map(procs, function(proc) {
            return { name: proc.name, status: proc.env.status };
          }), [
            { name: 'server1', status: 'online' }
          ]);
          done();
        })
        .catch(function(error) {
          done(error);
        });
    });

    it('make a HTTP request and should be responsed successfully', function(done) {
      var promize;
      if (process.env.CHECK_SERVICE_READY) {
        promize = DT.isServiceReady({
          url: 'http://localhost:9001/',
          retryMax: 10,
          statusCode: 200
        });
      } else {
        promize = Promise.resolve().delay(1000);
      }
      promize
        .then(fetch.bind(fetch, 'http://localhost:9001/sayhello'))
        .then(function(res) {
          return res.text();
        })
        .then(function(body) {
          debugx.enabled && debugx('Response body: [%s]', body);
          assert.equal(body, 'Hello World, server running on port: 9001');
          done();
        })
        .catch(done);
    });

    afterEach(function(done) {
      TS.processRunner.stop(['server1'])
        .then(lodash.ary(done, 0))
        .catch(done);
    });

    after(function(done) {
      TS.processRunner.deleteAll()
        .then(lodash.ary(done, 0))
        .catch(done);
    });
  });

  describe('multiple web services', function() {
    beforeEach(function(done) {
      TS.processRunner
        .start({
          apps: [
            {
              name: 'server1',
              script: path.join(__dirname, '../../lib/web-server.js'),
              env: {
                'PORT': '9001',
              }
            }, {
              name: 'server2',
              script: path.join(__dirname, '../../lib/web-server.js'),
              env: {
                'PORT': '9002',
              }
            }
          ]
        })
        .then(function() {
          done();
        })
        .catch(done);
    });

    it('should start/stop processes properly', function(done) {
      TS.processRunner
        .list()
        .then(function(procs) {
          debugx.enabled && debugx('list() result: %s', JSON.stringify(procs, null, 2));
          assert.sameDeepMembers(lodash.map(procs, function(proc) {
            return { name: proc.name, status: proc.env.status };
          }), [
            { name: 'server1', status: 'online' },
            { name: 'server2', status: 'online' }
          ]);
          done();
        })
        .catch(function(error) {
          done(error);
        });
    });

    it('make a HTTP request and should be responsed successfully', function(done) {
      var promize;
      if (process.env.CHECK_SERVICE_READY) {
        promize = DT.isServiceReady({
          url: 'http://localhost:9001/',
          retryMax: 10,
          statusCode: 200
        });
      } else {
        promize = Promise.resolve().delay(1000);
      }
      promize
        .then(fetch.bind(fetch, 'http://localhost:9001/sayhello'))
        .then(function(res) {
          return res.text();
        })
        .then(function(body) {
          debugx.enabled && debugx('Response body: [%s]', body);
          assert.equal(body, 'Hello World, server running on port: 9001');
          done();
        })
        .catch(done);
    });

    afterEach(function(done) {
      TS.processRunner.stop(['server1', 'server2'])
        .then(lodash.ary(done, 0))
        .catch(done);
    });

    after(function(done) {
      TS.processRunner.deleteAll()
        .then(lodash.ary(done, 0))
        .catch(done);
    });
  });
});
