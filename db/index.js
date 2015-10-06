/*global require */

/**
 * End point of database module
 */
'use strict';

var oop = require('node-g3').oop,
    async = require('async'),
    _ = require('underscore');


// register services
var dbLinkedInScraped = require('./services/linkedin-scraped');

var servicesClasses = {
  dbLinkedInScraped: dbLinkedInScraped
};

/**
 * @class
 */
var DatabaseManager = oop.Base.extend({
  constructor: function (app, opts) {
    this.container = {};
    this.app = app;
    return this;
  },

  /**
   * Init service instances
   */
  init: function (neededServices, fn) {
    var container = this.container,
        app = this.app;

    async.each(neededServices, function (neededService, done) {
      var service = container[neededService] = new servicesClasses[neededService](app);
      service.init(done);
    }, function (error) {
      if (error)
        console.log('Database services init fail', error);
      else
        console.log('Database services init success');

      fn(error);
    });
  },

  /**
   * Destroy server
   */
  destroy: function () {
    _.each(this.container, function (instance) {
      instance.terminal();
    });
  },

  /**
   * Get instance of service by name
   */
  getInstance: function (name) {
    return this.container[name];
  }
}, servicesClasses);

/**
 * Expose.
 */
module.exports = DatabaseManager;
