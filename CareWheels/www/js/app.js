// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('careWheels', ['ionic'])

app.run(function($ionicPlatform) {
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

app.controller("UserRestController", function($scope, $http, $log, $httpParamSerializerJQLike){
  $scope.url = 'http://carebank.carewheels.org:8080/userinfo.php';
  $scope.fetch = function(userIn, passIn, tofindIn) {
    $scope.code = null;
    $scope.response = null;
    $http({
      url:$scope.url, 
      method:'POST',
      data: $httpParamSerializerJQLike({
        username:userIn, 
        password:passIn, 
        usernametofind:tofindIn        
      }), 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function(response) {
        $scope.status = response.status;
        $scope.data = response.data;
      }, function(response) {
        $scope.data = response.data || "Request failed";
        $scope.status = response.status;
    })
  };
});

app.controller("ReminderRestController", function($scope, $http, $log, $httpParamSerializerJQLike){
  $scope.url = 'http://carebank.carewheels.org:8080/updateuserreminders.php';
  $scope.fetch = function(userIn, passIn, toUpdate, rem1, rem2, rem3) {
    $scope.code = null;
    $scope.response = null;
    $http({
      url:$scope.url, 
      method:'POST',
      data: $httpParamSerializerJQLike({
        username:userIn, 
        password:passIn, 
        usernametoupdate:toUpdate,
        reminder1:rem1,
        reminder2:rem2,
        reminder3:rem3        
      }), 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function(response) {
        $scope.status = response.status;
        $scope.data = response.data;
      }, function(response) {
        $scope.data = response.data || "Request failed";
        $scope.status = response.status;
    })
  };
});