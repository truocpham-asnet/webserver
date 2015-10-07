var async = require('async'),
  LinkedInBodyParser = require('../../scripts/companies/linkedin/utils'),
  request = require('request'),
  Services;

Services = {

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
};

/**
 * Expose api.
 */
module.exports = Services;
