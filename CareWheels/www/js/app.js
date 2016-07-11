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

/*
The object (saved to local storage) will contain sen.se token data in the format of:
{
  "access_token": "access-token",
  "refresh_token": "refresh-token",
  "token_type": "Bearer",
  "expires_in": 31536000,
  "scope": "feeds.write profile"
}
*/

app.controller("DownloadController", function($scope, $http, $log, $httpParamSerializerJQLike){
  
  //called by group member summary status subsystem
  //will attempt to make GET request to sen.se api /feeds/ endpoint
  $scope.RequestData = function() {
  var url = 'https://apis.sen.se/v2/feeds/';  
  //console.log("test", url);
  $http({
    url:url, 
    method:'GET',
    data: $httpParamSerializerJQLike({
      //clientID ?
      //accessToken: ?      
    }), 
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authentication': 'Bearer access-token'
    }
  }).then(function(response) {
    $scope.status = response.status;
    $scope.data = response.data;
    //TODO:
    //Save feed data to local storage

    
    }, function(response) {
      $scope.data = response.data || "Request failed";
      $scope.status = response.status;
      //TODO:
      //If response fails with 403 "token expired" error,
      //we call RefreshExpiredToken and pass in
      //(refreshToken, )
    })
  }

    //function which makes POST request to sen.se api
    //to refresh an expired access token using our refresh token in local storage
    $scope.RefreshExpiredToken = function() {
    var refreshUrl = 'https://sen.se/api/v2/oauth2/refresh';
    $http({
      url:refreshUrl, 
      method:'POST',
      data: $httpParamSerializerJQLike({
        //refresh_token: JSON.parse(localStorage.getItem(‘member.customField.SenseOAuthRefreshToken’)), 
        //grant_type: refresh_token
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function(response2) {
      $scope.status2 = response2.status;
      $scope.data2 = response2.data;
      //TODO:
      //save refreshed accesstoken to local storage
      //save new refresh token to local storage

    }, function(response2) {
      $scope.data2= response2.data || "Request failed";
      $scope.status2 = response2.status;
    })
  } //;
})
;
