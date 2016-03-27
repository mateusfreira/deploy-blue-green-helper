var Q = require('q');
var _ = require('lodash')
var rp = require('request-promise');

const waitForSystemStart = function (url, retryCount, timeBetweenRetry, deferR, n) {
  var times = n || 0;
  var defer = deferR || Q.defer();
  if (times >= retryCount) {
    defer.reject("Gave up aftet : " + times + " times");
  } else {
    rp(url).then(function (r) {
      defer.resolve(true);
    }).catch(function () {
      setTimeout(function () {
        waitForSystemStart(url, retryCount, timeBetweenRetry, defer, ++times);
      }, timeBetweenRetry);
    });
  }
  return defer.promise;
};
module.exports = {
  waitForSystemStart: waitForSystemStart
}
