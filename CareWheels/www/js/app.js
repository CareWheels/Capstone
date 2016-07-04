// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('careWheels', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller("UserRestController", function($scope, $http, $log, $httpParamSerializerJQLike){
  $scope.url = 'http://carebank.carewheels.org:8080/userinfo.php';
  $scope.fetch = function() {
    $scope.code = null;
    $scope.response = null;
    $scope.params = {
      username:'test', 
      password:'test123', 
      usernametofind:'test7'
    };
    $http({
      url:$scope.url, 
      method:'POST',
      params: $scope.params
      /*Looking over the documentation more, I do not believe this service is needed, but I'm leaving it in so
      we have it if I'm wrong...
      
      , params: $httpParamSerializerJQLike({username: 'test', password: 'test123', usernametofind: 'test7'}), 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }*/
    }).then(function(response) {
        $scope.status = response.status;
        $scope.data = response.data;
      }, function(response) {
        $scope.data = response.data || "Request failed";
        $scope.status = response.status;
    })
  };
});