'use strict';

var Promise = require('bluebird');
var assert = require('chai').assert;
var lodash = require('lodash');
var path = require('path');
var util = require('util');
var fetch = require('node-fetch');
var LogTracer = require('logolite').LogTracer;
var DT = require('devebot-test');
var TS = require('devebot-test').toolset;
var debugx = require('debug')('bdd:testing-with-nodejs:log-message-collection');

describe('testing-with-nodejs:log-message-collection:web-server-test', function() {
  this.timeout(DT.DEFAULT_TIMEOUT);

  before(function() {
    TS.envCustomizer.setup({
      LOGOLITE_ALWAYS_ENABLED: 'all',
      LOGOLITE_TEXTFORMAT_ENABLED: 'false',
      LOGOLITE_TAGS_EMBEDDABLE: 'true',
      NODE_ENV: 'test'
    });
  });

  var services = {
    "server1": "9001",
    "server2": "9002"
  }

  describe('multiple web services', function() {
    beforeEach(function(done) {
      Promise.all([
          TS.loggingTracer
            .start({
              filters: [
                {
                  filter: function() { return true },
                  countTo: 'total',
                  storeTo: 'store'
                }
              ],
              stopWhen: function(packet, stats) {
                if (stats.total >= 2) return true;
                return false;
              }
            }),
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
        ])
        .then(function() {
          return Promise.all(lodash.map(services, function(serverPort, serverName) {
            return DT.isServiceReady({
              url: util.format('http://localhost:%s/', serverPort),
              retryMax: 10,
              statusCode: 200
            })
          }));
        })
        .then(lodash.ary(done, 0))
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
      var requestId = LogTracer.getLogID();
      debugx.enabled && debugx('RequestID: %s', requestId);
      Promise.resolve()
        .then(fetch.bind(fetch, 'http://localhost:9001/sayhello', {
          headers: {
            'Accept': 'application/json',
            'X-Request-Id': requestId
          }
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
        })
        .catch(done);

      TS.loggingTracer.process().then(function(stats) {
        debugx.enabled && debugx('==@ Status: %s', JSON.stringify(stats, null, 2));
        assert.equal(stats.total, 2);
        assert.sameDeepMembers(
          lodash.map(stats.store, function(item) { return item.requestId }),
          lodash.times(2, lodash.constant(requestId))
        );
        done();
      }).catch(done);
    });

    afterEach(function(done) {
      Promise.all([
          TS.loggingTracer.stop(),
          TS.processRunner.stop(lodash.keys(services))
        ])
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
