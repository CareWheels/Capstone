/**
 * CareWheels - Login Service
 *
 */
angular.module('careWheels')

.service('loginService', function($q){
  console.log("in loginservice");
  return {
    loginUser: function(name, pw) {
      var deferred = $q.defer();
      var promise = deferred.promise;
      //TODO - send REST to authenticate username and password
      if (name == 'admin' && pw == 'admin') {
        deferred.resolve('Welcome ' + name + '!');
      } else {
        deferred.reject('Wrong credentials.');
      }
      promise.success = function(fn) {
        promise.then(fn);
        return promise;
      }
      promise.error = function(fn) {
        promise.then(null, fn);
        return promise;
      }
      return promise;
    }
  }
});