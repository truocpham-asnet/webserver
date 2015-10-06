/**
 * Constroller manager for REST api
 */
var assert = require('assert'),
    oop = require('node-g3').oop,
    fs = require('fs'),
    path = require('path'),
    basename = path.basename,
    _ = require('underscore'),
    log = require('log')('info');

/**
 * @class
 */
var ControllerManager = oop.Base.extend({

    /**
     * @constructor
     */
    constructor: function(opts) {
        this.app = opts.app;
        this.controllers = {};
    },

    /**
     * Init handlers read from ./controllers folder
     */
    initControllers: function (fn) {
        var self = this,
            app = this.app;

        fs.readdirSync(__dirname + '/controllers').forEach(function(filename){
            if (!/\.js$/.test(filename)) return;
            var name = basename(filename, '.js'),
                constrollerClass = require('./controllers/' + name),
                constroller = new constrollerClass({app: app}),
                constrollerName = constroller.controllerName || name;

            self.controllers[constrollerName] = constroller;
        });

        fn && fn();

        return this;
    },

    /**
     * Handler rest api
     */
    handle: function (opts, fn) {
        assert(opts.controller, 'Constroller is required');

        var constroller = this.controllers[opts.controller];

        // delegate for invidule controller
        if (constroller) {
            constroller.handle(opts, fn);
        } else {
            return fn && fn('Wrong request');
        }
    },

    /**
     * Dump all apis support by this web app
     */
    dumpAPIs: function () {
        var results = {};

        _.each(this.controllers, function (obj, name) {
            results[name] = obj.dumpAPIs(name);
        });

        return results;
    }

});

/**
 * Expose.
 */
module.exports = ControllerManager;