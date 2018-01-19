'use strict';

var Promise = require('bluebird');
var assert = require('chai').assert;
var lodash = require('lodash');
var path = require('path');
var util = require('util');
var fetch = require('node-fetch');
var DT = require('devebot-test');
var TS = require('devebot-test').toolset;
var debugx = require('debug')('tdd:testing-with-nodejs:log-message-collection');

describe('testing-with-nodejs:log-message-collection:web-server-test', function() {
  this.timeout(DT.DEFAULT_TIMEOUT);

  before(function() {
    TS.envCustomizer.setup({
      LOGOLITE_ALWAYS_ENABLED: 'all',
      LOGOLITE_DEBUGLOG: 'true',
      NODE_ENV: 'test'
    });
  });

  var services = {
    "server1": "9001",
    "server2": "9002"
  }

  describe('multiple web services', function() {
    beforeEach(function(done) {
      TS.processRunner
        .start({
          apps: lodash.map(services, function(serverPort, serverName) {
            return {
              name: serverName,
              script: path.join(__dirname, '../../lib/web-server.js'),
              env: {
                'PORT': serverPort,
              }
            }
          })
        })
        .then(function() {
          return Promise.all(lodash.map(services, function(serverPort, serverName) {
            return DT.isServiceReady({
              url: util.format('http://localhost:%s/', serverPort),
              retryMax: 10,
              statusCode: 200
            })
          }));
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
          }), lodash.map(services, function(serverPort, serverName) {
            return { name: serverName, status: 'online' };
          }));
          done();
        })
        .catch(function(error) {
          done(error);
        });
    });

    it('make a HTTP request with Accept type is "application/json"', function(done) {
      Promise.resolve()
        .then(fetch.bind(fetch, 'http://localhost:9001/sayhello', {
          headers: { 'Accept': 'application/json' }
        }))
        .then(function(res) {
          return res.json();
        })
        .then(function(body) {
          debugx.enabled && debugx('Response body: [%s]', JSON.stringify(body));
          assert.deepEqual(body, {
            message: 'Hello World',
            port: '9001'
          });
          done();
        })
        .catch(done);
    });

    afterEach(function(done) {
      TS.processRunner.stop(lodash.keys(services))
        .then(lodash.ary(done, 0))
        .catch(done);
    });

    after(function(done) {
      TS.processRunner.deleteAll()
        .then(lodash.ary(done, 0))
        .catch(done);
    });
  });

  after(function() {
    TS.envCustomizer.reset();
  })
});
