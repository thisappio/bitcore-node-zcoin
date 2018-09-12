'use strict';

var path_module = require('path');
var should = require('chai').should();
var sinon = require('sinon');
var proxyquire = require('proxyquire');

describe('#defaultConfig', function() {
  var expectedExecPath = path_module.resolve(__dirname, '../../bin/zcoind');
  //var expectedExecPath = path.resolve(__dirname, './.bitcore/data/zcoind');
  
  it('will return expected configuration', function() {
    var config = JSON.stringify({
      network: 'livenet',
      port: 3881,
      services: [
        'bitcoind',
        'web'
      ],
      servicesConfig: {
        bitcoind: {
          spawn: {
            datadir: path_module.join(process.cwd(), 'bin'),
            exec: expectedExecPath
          }
        }
      }
    }, null, 2);
    var defaultConfig = proxyquire('../../lib/scaffold/default-config', {
      fs: {
        existsSync: sinon.stub().returns(false),
        writeFileSync: function(path, data) {
          path.should.equal(path_module.join(process.cwd(), 'bin/bitcore-node-zcoin.json'));
          data.should.equal(config);
        },
        readFileSync: function() {
          return config;
        }
      },
      mkdirp: {
        sync: sinon.stub()
      }
    });
    var info = defaultConfig({basedir: process.cwd()});
    info.path.should.equal(process.cwd());
    info.config.network.should.equal('livenet');
    info.config.port.should.equal(3881);
    info.config.services.should.deep.equal(['bitcoind', 'web']);
    var bitcoind = info.config.servicesConfig.bitcoind;
    should.exist(bitcoind);
    bitcoind.spawn.datadir.should.equal(path_module.join(process.cwd(), 'bin'));
    bitcoind.spawn.exec.should.equal(expectedExecPath);
  });
  it('will include additional services', function() {
    var config = JSON.stringify({
      network: 'livenet',
      port: 3001,
      services: [
        'bitcoind',
        'web',
        'insight-api',
        'insight-ui'
      ],
      servicesConfig: {
        bitcoind: {
          spawn: {
            datadir: process.env.HOME + '/.bitcore/data',
            exec: expectedExecPath
          }
        }
      }
    }, null, 2);
    var defaultConfig = proxyquire('../../lib/scaffold/default-config', {
      fs: {
        existsSync: sinon.stub().returns(false),
        writeFileSync: function(path, data) {
        },
        readFileSync: function() {
          return config;
        }
      },
      mkdirp: {
        sync: sinon.stub()
      }
    });
    var home = process.env.HOME;
    var info = defaultConfig({
      additionalServices: ['insight-api', 'insight-ui']
      , basedir: process.cwd()
    });
    info.config.network.should.equal('livenet');
    info.config.port.should.equal(3001);
    info.config.services.should.deep.equal([
      'bitcoind',
      'web',
      'insight-api',
      'insight-ui'
    ]);
    var bitcoind = info.config.servicesConfig.bitcoind;
    should.exist(bitcoind);
  });
});
