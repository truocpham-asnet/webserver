/**
 * Dashboard api server
 */
'use strict';

var assert = require('assert'),
    _ = require('underscore'),
    async = require('async'),
    express = require('express'),
    http = require('http'),
    path = require('path'),
    session = require('express-session'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    expressSession = require('express-session'),
    MongoStore = require('connect-mongo')(session),
    Log = require('log'),
    log = new Log('info'),
    ServiceBase = require('../utils/service'),

    router = require('./router'),

    DatabaseManager = require('../db'),

    // passport
    passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;

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

    // Define database manager
    var db = this.db = new DatabaseManager(this);

    // webapp.use(require('express-logger')());
    webapp.use(bodyParser.json());
    webapp.use(bodyParser.urlencoded({ extended: false }));
    // TODO: stop using bodyParser for now
    //webapp.use(express.bodyParser());
    // webapp.use(express.methodOverride());
    webapp.use(cookieParser('jljlfjasdf8983927dhf'));

    /**
     * @author: Huytran
     *
     * Save user session to mongodb
     */
    webapp.use(expressSession({
      secret: 'bryony',
      store: new MongoStore({url : conf.get('database:mongodb:connectionString')}),
      cookie: {
        maxAge: conf.get('dashboard:session:maxAge') || 60 * 60 * 24 * 14 * 1000 // 2 weeks
      }
    }));

    /**
     * Frontend root
     */
    if (conf.get('dashboard:staticPath'))
        webapp.use(express.static(conf.get('dashboard:staticPath')));
    else
        webapp.use(express.static(path.join(__dirname, '../../../leadedge-dashboard/src/dist')));

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
      function initialDatabase(callback){
        log.info('Init Database service ...');
        self.db.init([
          'dbLinkedInScraped'
        ], function (err) {
          if (err) return callback(err);
          callback && callback();
        });
      },
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
