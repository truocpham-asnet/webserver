var async = require('async'),
    http = require('http'),
    oop = require('node-g3').oop,
    _ = require('underscore'),
    ControllerManager = require('./controller-manager'),
    Log = require('log'),
    log = new Log('info');

/**
 * Router configuration endpoint
 */
module.exports = function (app) {
    var webapp = app.webapp,
        conf = app.conf,
        controllerManager = new ControllerManager({app: app}).initControllers();

    /**
     * api handler
     */
    var apiHandler = function (req, res, next) {
        var requestParams = {
            controller: req.params.controller,
            action: req.params.action, // action can be an id
            query: req.query,
            method: req.method.toLowerCase(),
            data: req.body
        };

        log.info('Dashboard REST', requestParams);

        // avoid log to much data we need add req, res & next later
        requestParams = _.extend(requestParams, {
            req: req,
            res: res,
            next: next
        });

        // delegate request to
        controllerManager.handle(requestParams, function (err, result) {
            // always use json
            res.set('Content-Type', 'application/json');
            if (err) {
                log.error('Dashboard REST api call fail', err);
                if (typeof err === 'string')
                    res.send(404, JSON.stringify(err));
                else
                    res.send(err.errCode, err.errMsg);
            } else {
                res.send(200, result);
            }
        });
    };

    // user logout router
    webapp.get('/api/users/logout', function (req, res, next) {
        req.logout();
        res.redirect('/');
    });

    /**
     * REST api router
     */
    webapp.all('/api/:controller/:action', apiHandler);
    webapp.all('/api/:controller', apiHandler);

    // expose list of api support by platform if running in debug mode
    if (conf.get('debug'))
        webapp.all('/api', function (req, res) {
            res.send(controllerManager.dumpAPIs(), {
                'Content-Type': 'application/json'
            }, 200);
        });
};