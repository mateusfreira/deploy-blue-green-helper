const Q = require('q'),
  URL_TO_TEST = "https://www.google.com";
describe('DeployManager', function () {
  const DeployManager = require('../index.js'),
    assert = require('assert'),
    sucessFactory = function (value, done) {
      return function () {
        if (done) {
          done();
        }
        return Q.when(value);
      };
    },
    failFactory = function (message) {
      return function () {
        assert.fail(message);
        return Q.when(false);
      };
    };

  it('if blueOptions is ruinning should call the green run', function (done) {
    var blueOptions = {
      deployer: {
        run: failFactory('blueOptions run should not be called'),
        isRuning: sucessFactory(true)
      }
    };
    var greenOptions = {
      deployer: {
        run: sucessFactory(true, done),
        isRuning: sucessFactory(false)
      }
    };
    DeployManager.deploy(blueOptions, greenOptions);
  });

  it('if blueOptions is not ruinning should call the green run', function (done) {
    var blueOptions = {
      deployer: {
        run: sucessFactory(true, done),
        isRuning: sucessFactory(false)
      }
    };
    var greenOptions = {
      deployer: {
        run: failFactory('blueOptions run should not be called'),
        isRuning: sucessFactory(true)
      }
    };
    DeployManager.deploy(blueOptions, greenOptions);
  });

  it('if blueOptions is ruinning should call the green run, when green start responding, it should stop the blue', function (done) {
    var blueOptions = {
      deployer: {
        url: URL_TO_TEST,
        run: failFactory('blueOptions run should not be called'),
        stop: sucessFactory(true, done),
        isRuning: sucessFactory(true)
      }
    };
    var greenOptions = {
      url: URL_TO_TEST,
      deployer: {
        stop: failFactory('blueOptions run should not be called'),
        run: sucessFactory(true),
        isRuning: sucessFactory(true)
      }
    };
    DeployManager.deploy(blueOptions, greenOptions).catch(function () {

    });
  });

  it('if blueOptions is not ruinning should call the green run, when green start responding, it should stop the green', function (done) {
    var blueOptions = {
      deployer: {
        url: URL_TO_TEST,
        run: sucessFactory(true, done),
        stop: sucessFactory(true),
        isRuning: sucessFactory(false)
      }
    };
    var greenOptions = {
      url: URL_TO_TEST,
      deployer: {
        stop: sucessFactory(true, done),
        run: failFactory('greenOptions run should not be called'),
        isRuning: sucessFactory(true)
      }
    };
    DeployManager.deploy(blueOptions, greenOptions);
  });

});
