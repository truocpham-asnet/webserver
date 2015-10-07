var async = require('async'),
  mongoose = require('mongoose'),
  BaseDBService = require('../base-mongodb-service'),
  assert = require('assert'),
  LinkedInBodyParser = require('../../scripts/companies/linkedin/utils'),
  ObjectID = require('mongodb').ObjectID,
  _ = require('underscore'),
  request = require('request');

// import models
require('../schema/linkedin-scraped')();

/**
 * Expose api.
 */
module.exports = BaseDBService.extend({
  modelClass: mongoose.model('DBLinkedInScraped'),

  /**
   * Re-format LinkedIn url to right url
   *
   * @param {String} linkedInUrl - LinkedIn url
   *
   * @return {String} - Right url start with `https`
   *                    Ex: https://www.linkedin.com/company/3962220
   */
  _reformatLinkedInUrl: function (linkedInUrl) {
    var testPattern = '^http[s]*';

    if (!new RegExp(testPattern).test(linkedInUrl)) {
      linkedInUrl = 'https://' + linkedInUrl;
    }

    return linkedInUrl;
  },

  /**
   * get linkedinID by linkedin URL
   */
  getLinkedInIdByLinkedInUrl: function(opts, callback) {
    var self = this,
        query = opts.query || {},
        url = query.url || '',
        linkedInUrl = url ? self._reformatLinkedInUrl(url) : null,
        linkedInId = null;

    // request to get linkedin id from body of LinkedIn page just scraped
    request(linkedInUrl, function(err, response, body) {
      if (!err && response.statusCode === 200) {
        linkedInId = LinkedInBodyParser.getCompanyId(body);
      }

      callback(err, linkedInId);
    });
  }
});
