var fs = require('fs'),
    path = require('path'),
    nconf = require('nconf');

var configPath = path.join(__dirname, '/../config/');
/**
 * Setup nconf to use (in-order):
 *  1. Command-line arguments
 *  2. Environment variables
 *  3. A file located at 'path/to/config.json'
 */
nconf.argv().env();

/**
 * Searching custom file in
 */
if (nconf.get('SETTINGS'))
    nconf.file(path.join(configPath, nconf.get('SETTINGS') + '.json'));
else
    nconf.file(path.join(configPath, 'local.json'));

console.log('Start with this configuration:', nconf.stores.file.file);

module.exports = nconf;
