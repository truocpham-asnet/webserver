var async = require('async'),
  mongoose = require('mongoose'),
  BaseDBService = require('../base-mongodb-service'),
  assert = require('assert'),
  ObjectID = require('mongodb').ObjectID,
  _ = require('underscore');

// import models
require('../schema/linkedin-scraped')();

/**
 * Expose api.
 */
module.exports = BaseDBService.extend({
  modelClass: mongoose.model('DBLinkedInScraped'),

  /**
   * get linkedinID by linkedin URL
   */
  getLinkedInIdByLinkedInUrl: function(opts, callback) {
    var self = this;

    async.parallel({

      count: function(wfCallback) {
        self.countTotal(wfCallback);
      },

      results: function(wfCallback) {
        self.findOne(opts, function(err, doc) {
          return wfCallback(null, doc);
        });
      }

    }, function(err) {
      if (err) {
        callback(err, results);
      } else {
        return callback(null, results);
      }
    });
  }
});
