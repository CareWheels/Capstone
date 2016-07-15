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

  /////////////////////////////////////////////////////////////////////////////////////////
  //DATA DOWNLOAD FUNCTION
  /////////////////////////////////////////////////////////////////////////////////////////
  $scope.DownloadData = function () {

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
  var workerPromise = WorkerService.createAngularWorker(['input', 'output', '$http', '$httpParamSerializerJQLike', function (input, output, $http, $httpParamSerializerJQLike) {
    var uname = 'test';
    var pword = 'test123';
    //TODO:
    //Pass appropriate params into angular worker $http request

    /////////////////////////////////////////////////////////////////////////////////////////
    //GET ACCESS AND REFRESH TOKEN FOR GROUP MEMBER WITHIN CYCLOS SERVER
    //-before downloadFunc can run, we need to obtain the groupmembers' access-token and
    //refresh-token from cyclos
    //-this requires a request to the server
    //-we will return the refresh and access tokens, so that they may be used in the 
    //downloadFunc and (possibly) refreshFunc functions
    /////////////////////////////////////////////////////////////////////////////////////////
    var getTokens = function() {
    var gname = 'test';
    //var getTokenUrl = "http://jsonplaceholder.typicode.com/posts/1";
    var getTokenUrl = "https://carebank.carewheels.org:8443/groupmemberinfo.php";
    $http({
      url:getTokenUrl, 
      method:'POST',    
      data: $httpParamSerializerJQLike({   
      username: uname,
      password: pword,
      //usernametofind: gname
      groupinternalname: gname

      }), 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function(response) {   
        //
        console.log("getTokens func success", response);
          return response; 
      }, function(response) {
        //
        console.log("getTokens func fail", response);
        }
      )
    }


    ///////////////////////////////////////////////////////////////////////////
    //FUNCTION
    //Calls getTokens
    //Attempts sen.se download
    //if expired token error, calls refreshToken function
    //$http request to sen.se with access token to attempt to retrieve feed data
    ///////////////////////////////////////////////////////////////////////////
    var downloadFunc = function(){

    var getTokenResponse = getTokens(); //add parameters to getTokens()
    // var accessToken = JSON.parse(JSON.stringify(response.customField.accesstoken))
    // var refreshToken = JSON.parse(JSON.stringify(response.customField.refreshtoken))

    //var dataUrl = "http://jsonplaceholder.typicode.com/posts/1";
    var dataUrl = "https://apis.sen.se/v2/feeds/";
    $http({
      url:dataUrl, 
      method:'GET',    
      data: $httpParamSerializerJQLike({   
       //accesstoken:accessToken,
       //
      }), 
      headers: {
        //'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/JSON',
        'Authorization': 'Bearer access-token'
      }
    }).then(function(response) {   
        //
        //received response, send to main thread
        //NOTE: need to JSON.parse + stringify the response
        //or else there will be an error as we attempt to 
        //pass the response back to main thread

        //ideally, this is what we would like to have happen
        //the response object will be sent back to the main thread
        //where the feed data can be manipulated for analysis
        output.notify(JSON.parse(JSON.stringify(response)));
        console.log("download func success", response);

      }, function(response) {
        //
        //if we fail the request to a 403 expired token error
        //call refresh function
        /*
        if (response.status = '403'){
          refreshFunc();  //
            //if error, exit/display error msg
          downloadFunc(); //
        }
        else

        console.log("download func fail", response);
        */
        output.notify(JSON.parse(JSON.stringify(response)));
        console.log("download func fail", response);

        }
      )
    };

    ///////////////////////////////////////////////////////////////////////////
    //FUNCTION
    //$http request to cyclos to refresh expired access token
    //will use group members refresh token
    //both tokens have been retrieved from getTokens(groupMembername)
    //will return refreshed access token, and new refresh token within response
    ///////////////////////////////////////////////////////////////////////////
    var refreshFunc = function(){
    //var refreshUrl = "http://jsonplaceholder.typicode.com/posts/1";
    var refreshUrl = "https://apis.sen.se/v2/oauth2/refresh/";
    $http({
      url:refreshUrl, 
      method:'POST',    
      data: $httpParamSerializerJQLike({
       // send old tokens   
       //accesstoken: accessToken,
       //refreshtoken: refreshToken
      }), 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Bearer refresh-token'
      }
    }).then(function(response) {
        //parse success response and save new tokens
        //var newAccessToken = JSON.parse(JSON.stringify(response));
        //var newRefreshToken = JSON.parse(JSON.stringify(response));

        //var storeTokenUrl = "http://jsonplaceholder.typicode.com/posts/2";
        var storeTokenUrl = "https://carebank.carewheels.org:8443/groupmemberinfo.php";
        $http({
          url:storeTokenUrl, 
          method:'POST',    
          data: $httpParamSerializerJQLike({
          //attempt to send and save new tokens
          //username:username,
          //password:password,
          //accesstoken:newAccessToken,
          //refreshtoken:newRefreshToken
          }), 
          headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
          }
          }).then(function(response) {   
          //
          //output.notify(JSON.parse(JSON.stringify(response)));
          console.log("store token in cyclos success", response);

          }, function(response) {
          //
          //output.notify(JSON.parse(JSON.stringify(response)));
          console.log("store token in cyclos fail", response);
            return response; //exit function
          })
          //after cyclos http request
          //output.notify(JSON.parse(JSON.stringify(response)));
          console.log("sen.se refresh request success", response);

      }, function(response) {
        //

        //output.notify(JSON.parse(JSON.stringify(response)));
        console.log("sen.se refresh request fail", response);

        }
      )

    //received response, send to main thread
    //output.notify(response);
    };

/*
from design doc
    groupMembersInfo - array
    JSON.parse(
    member.customValues.
       SenseUserID: String
       SenseOAuthToken: String
       SenseOAuthRefreshToken: String
*/

    downloadFunc();
    //refreshFunc();
    //getTokens();
  }]);


/////////////////////////////////////////////////////////////////////////////////////////
//This is where we run our worker thread
//and handle the returned promise (this will be a javascript object containing
//sensor download data)
/////////////////////////////////////////////////////////////////////////////////////////
    workerPromise
      .then(function success(angularWorker) {
      //The input must be serializable
      //console.log('reached');
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
        console.log('reached notify');
      });
  };
});
