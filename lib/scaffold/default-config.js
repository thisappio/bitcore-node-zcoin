'use strict';

var path = require('path');
var mkdirp = require('mkdirp');
var fs = require('fs');

/**
 * Will return the path and default bitcore-node-zcoin configuration. It will search for the
 * configuration file in the "~/.bitcore" directory, and if it doesn't exist, it will create one
 * based on default settings.
 * @param {Object} [options]
 * @param {Array} [options.additionalServices] - An optional array of services.
 */
function getDefaultConfig(options) {
    /* jshint maxstatements: 40 */
    if (!options) {
        options = {};
    }

    if (!options.basedir)
        throw new Error('Options must contain the base installation dir.');

    var defaultPath = options.basedir;
    var defaultConfigFile = path.join(defaultPath, 'bin/bitcore-node-zcoin.json');

    if (!fs.existsSync(defaultPath)) {
        mkdirp.sync(defaultPath);
    }

    var defaultServices = ['bitcoind', 'web'];
    if (options.additionalServices) {
        defaultServices = defaultServices.concat(options.additionalServices);
    }

    if (!fs.existsSync(defaultConfigFile)) {
        var defaultConfig = {
            network: 'livenet',
            port: 3881,
            services: defaultServices,
            servicesConfig: {
                bitcoind: {
                    spawn: {
                        datadir: path.join(defaultPath, './bin'),
                        exec: path.join(defaultPath, './bin/zcoind')
                    }
                }
            }
        };
        fs.writeFileSync(defaultConfigFile, JSON.stringify(defaultConfig, null, 2));
    }

    var defaultDataDir = path.join(defaultPath, './bin');

    if (!fs.existsSync(defaultDataDir)) {
        mkdirp.sync(defaultDataDir);
    }

    var config = JSON.parse(fs.readFileSync(defaultConfigFile, 'utf-8'));

    return {
        path: defaultPath,
        config: config
    };

}

module.exports = getDefaultConfig;
