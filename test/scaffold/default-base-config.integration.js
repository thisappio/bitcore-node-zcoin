'use strict';

var should = require('chai').should();
var path = require('path');
var defaultBaseConfig = require('../../lib/scaffold/default-base-config');

describe('#defaultBaseConfig', function() {
  it('will return expected configuration', function() {
    var cwd = process.cwd();
    var home = process.env.HOME;
    
    var config = { datadir: cwd };

    var info = defaultBaseConfig(config);
    info.path.should.equal(cwd);
    info.config.network.should.equal('livenet');
    info.config.port.should.equal(3881);
    info.config.services.should.deep.equal(['bitcoind', 'web']);
    var bitcoind = info.config.servicesConfig.bitcoind;
    bitcoind.spawn.datadir.should.equal(path.resolve(config.datadir, './bin'));
    bitcoind.spawn.exec.should.equal(path.resolve(__dirname, '../../bin/zcoind'));
    //bitcoind.spawn.exec.should.equal(path.resolve(__dirname, './.bitcore/data/zcoind'));
  });
  it('be able to specify a network', function() {
    var info = defaultBaseConfig({network: 'testnet', datadir: process.cwd() });
    info.config.network.should.equal('testnet');
  });
  it('be able to specify a datadir', function() {
    var info = defaultBaseConfig({datadir: './data2', network: 'testnet'});
    info.config.servicesConfig.bitcoind.spawn.datadir.should.equal('data2/bin');
  });
});
