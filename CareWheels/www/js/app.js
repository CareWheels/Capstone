// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('careWheels', ['ionic', 'ngWebworker'])

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

/////////////////////////////////////////////////////////////////////////////////////////
//new controller/service/functions for ng-webworker plugin 
//(also added to angular.module at top of app.js)
//and added the ng-webWorker related js files in index.html
/////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////
// function which will tell the created worker thread what to do
// (i.e. worker thread function)
/////////////////////////////////////////////////////////////////////////////////////////
function workerFunction(n) {
    var testvar = 10;

    return testvar + n;
}

/////////////////////////////////////////////////////////////////////////////////////////
//factory service for worker threads
/////////////////////////////////////////////////////////////////////////////////////////
app.factory('myWorker', function ($http, Webworker) {

        var myWorker = Webworker.create(workerFunction);
        return {
            computeSum: function (n) {
                return myWorker.run(n);
            }
            /*,
            downloadData: function(){

                return  ;
            },
            refreshToken: function (){

                return  ;
            }
            */

        };
    })

/////////////////////////////////////////////////////////////////////////////////////////
//controller
/////////////////////////////////////////////////////////////////////////////////////////
app.controller('WorkerCtrl', function($scope, myWorker) {
  $scope.test = function(){
    myWorker.computeSum(140).then(function (numbers) {
        $scope.testresult = numbers;
    });
    }
});
