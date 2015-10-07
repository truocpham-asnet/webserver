/**
 * Dashboard api server
 */
'use strict';

var assert = require('assert'),
    _ = require('underscore'),
    async = require('async'),
    express = require('express'),
    http = require('http'),
    Log = require('log'),
    log = new Log('info'),
    ServiceBase = require('../utils/service'),

    router = require('./router');

/**
 * Web admin tool server
 *
 * @param {Configs} opts.configs
 *      The configuration
 *
 * @return itself
 */
var Server = ServiceBase.extend({

  constructor: function(opts) {
    opts = opts || {};

    var self = this,
        conf = self.conf = opts.configs;

    // Create express application
    // --------------------------
    var webapp = self.webapp = express();

    // CrossDomain middleware
    var allowCrossDomain = function(req, res, next) {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    };

    webapp.use(allowCrossDomain);
    // webapp.use(webapp.router);

    // Config router
    router(this);
  },

  /**
   * Starts the service
   */
  onStart: function(callback) {
    var self = this,
        conf = this.conf;

    async.parallel([
      function startAPIServer(callback) {
        var port = conf.get('dashboard:apiPort');

        log.info('Dashboard api started successfully at port: ', port);
        self.httpServer = http.createServer(self.webapp).listen(port, callback);
      }
    ],
    function(err, results){
      assert.ok(!err, "E8884883388. Couldn't starts server");
      self.onPreStart();
      callback && callback(err, results);
    });
  },

  onStop: function (callback) {
    this.httpServer.close();
    callback && callback();
  },

  // Event handlers from pubsub
  // --------------------------

  onPreStart: function () {
    // TODO
  }
});

module.exports = Server;
