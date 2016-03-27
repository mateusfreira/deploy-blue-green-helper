const Q = require('q'),
  _ = require('lodash'),
  rp = require('request-promise'),
  util = require('./lib/util.js');

var DeployInfo = function (userOptions) {
  const DEFAULT_OPTIONS = {
      retryCount: 180,
      timeBetweenRetry: 180,
      deployer: {
        run: function () {
          throw new Error("Needs to return a promise, that will be resolved when the build starts!");
        },
        run: function () {
          throw new Error("Needs to return a promise, that will be resolved when the build starts!");
        },
        isRuning: function () {
          throw new Error("Needs to return a promise! When true if the service is running, false if not!");
        }
      }
    },
    options = _.assignIn(DEFAULT_OPTIONS, userOptions),
    self = this;

  const waitToHttpSeriveIsRuning = function () {
    return util.waitForSystemStart(options.url, options.retryCount, options.timeBetweenRetry);
  };

  this.isRuning = function () {
    return options.deployer.isRuning(options);
  };

  this.stop = function () {
    return options.deployer.stop(options);
  };

  this.run = function () {
    return options.deployer.run(options).then(function () {
      return waitToHttpSeriveIsRuning();
    });
  };

}

const DeployManager = {
  deploy: function (blueOptions, greenOptions) {
    const blueDeployer = new DeployInfo(blueOptions);
    const greenDeployer = new DeployInfo(greenOptions);
    console.log("Checking if blue is running!");
    return blueDeployer.isRuning().then(function (isBlueRunning) {
      if (isBlueRunning) {
        console.log("Blue is running, so starting the green!");
        return greenDeployer.run().then(function () {
          console.log("Green has already been reponding, so stoping blue!");
          return blueDeployer.stop();
        });
      } else {
        console.log("Blue is not running, so starting its!");
        return blueDeployer.run().then(function () {
          console.log("Blue  already been reponding, so stoping trying to stop green!");
          return greenDeployer.stop();
        });
      }
    });
  }
};

module.exports = DeployManager
