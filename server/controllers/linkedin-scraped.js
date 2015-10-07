
var BaseController = require('../rest-controller-base'),
  assert = require('assert'),
  async = require('async'),
  _ = require('underscore');

/**
 * Expose.
 */
module.exports = BaseController.extend({

  /**
   * @overriden
   */
  dbServiceName: 'dbLinkedInScraped',

  /**
   * overriden
   */
  actions: {
    'get-linkedin-id': {
      method: 'get',
      fn: 'getLinkedinId'
    }
  },


  // ================================
  // Actions
  // ================================

  /**
   * get linkedin Id by linkedin url
   */
  getLinkedinId: function(opts, callback) {
    assert(opts.req, 'Require request');
    assert(opts.res, 'Require response');

    var self = this,
        service = self.getService();

    service.getLinkedInIdByLinkedInUrl(opts, callback);
  }
});
