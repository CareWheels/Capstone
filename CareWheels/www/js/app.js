// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('careWheels', ['ionic', 'FredrikSandell.worker-pool'])

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
//Using angular-workers module
//(also added to angular.module at top of app.js)
//and added the angular-workers related js files in index.html
/////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////
//controller
/////////////////////////////////////////////////////////////////////////////////////////
app.controller('WorkerCtrl', function($scope, WorkerService) {

// The URL must be absolute because of the URL blob specification  
WorkerService.setAngularUrl("https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js");


  //TODO:
  //create "downloadData" and "refreshToken" functions (in the same manner as $scope.test)
  $scope.test = function (arg) {

      /**
      // This contains the worker body.
      // The function must be self contained.
      // The function body will be converted to source and passed to the worker.
      // The input parameter is what will be passed to the worker when it is executed. It must be a serializable object.
      // The output parameter is a promise and is what the worker will return to the main thread.
      // All communication from the worker to the main thread is performed by resolving, rejecting or notifying the output promise.
      // We may optionally depend on other angular services. These services can be used just as in the main thread.
      // But be aware that no state changes in the angular services in the worker are propagates to the main thread. Workers run in fully isolated contexts.
      // All communication must be performed through the output parameter.
   */
  var workerPromise = WorkerService.createAngularWorker(['input', 'output', '$http', function (input, output, $http) {

    //TODO:
    //Pass appropriate params into angular worker $http request
   var url = "http://jsonplaceholder.typicode.com/posts/1";
    //access from server
    var callback = function(){
    //console.log(“url=”+input[‘url’]);
    $http.get(url)
    .success(function(response){
    //received response, send to main thread
    output.notify(response);
    });
    };

    callback();

  }]);


/////////////////////////////////////////////////////////////////////////////////////////
//This is where we run our worker thread
//and handle the returned promise (this will be a javascript object containing
//sensor download data)
/////////////////////////////////////////////////////////////////////////////////////////
    workerPromise
      .then(function success(angularWorker) {
      //The input must be serializable
      return angularWorker.run();
    }, function error(reason) {

        console.log('callback error');
        console.log(reason);

        //for some reason the worker failed to initialize
        //not all browsers support the HTML5 tech that is required, see below.
      }).then(function success(result) {

        console.log('success');
        console.log(result);

      //handle result
    }, function error(reason) {
        //handle error
        console.log('error');
        console.log(reason);

      }, function notify(update) {
        //handle update

        $scope.data = update.data;
        $scope.status = update.status;
        $scope.update = update;
        console.log(update);
      });

  };
});
