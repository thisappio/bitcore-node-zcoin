'use strict';

var path = require('path');

/**
 * Will return the path and default bitcore-node-zcoin configuration on environment variables
 * or default locations.
 * @param {Object} options
 * @param {String} options.network - "testnet" or "livenet"
 * @param {String} options.datadir - Absolute path to bitcoin database directory
 */
function getDefaultBaseConfig(options) {
    if (!options) {
        options = {};
    }

    if(!options.datadir)
        throw new Error('Options must contain the base installation dir.');

    var datadir = options.datadir;

    return {
        path: datadir,
        config: {
            network: options.network || 'livenet',
            port: 3881,
            services: ['bitcoind', 'web'],
            servicesConfig: {
                bitcoind: {
                    spawn: {
                        datadir: path.join(datadir, './bin'),
                           exec: path.join(datadir, './bin/zcoind')
                    }
                }
            }
        }
    };
}

module.exports = getDefaultBaseConfig;
