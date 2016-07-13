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
/////////////////////////////////////////////////////////////////////////////////////////
//NOTE: the startDownload function in the myWorker factory is attempting to use the $http service
//acces the sen.se /feeds/ endpoint.  The error I am getting, which I can't yet resolve, is
//"referenceError - $http is undefined".  Even though $http is injected into the myWorker factory.
//It might have something to do with its inclusion in the downloadFunction function. I do not yet know
//how to allow the use of $http within this function (or an alternate worker.js file if I were to create one)
/////////////////////////////////////////////////////////////////////////////////////////
//On the other hand, the startRefresh function uses the xmlHTTPRequest service, and appears to be functioning well
//(i.e. the worker thread is making a request to the appropriate sen.se endpoint)
/////////////////////////////////////////////////////////////////////////////////////////


app.factory("myWorker", ["$q", "$http", function($q, $http) {
    var worker = undefined;
    return {
        /////////////////////////////////////////////////////////////////////////////////////////
        //this is the function which is referenced in the the controller
        //it receives downloadInput as postData, which will contain params for GET request
        /////////////////////////////////////////////////////////////////////////////////////////
        startDownload: function(postData) {
            var defer = $q.defer();
            if (worker) {
                worker.terminate();
            }

            ////////////////////////////////////
            // worker function for 
            // making http GET call to sense api
            // (attempting to use $http)
            ////////////////////////////////////
            function downloadFunction() {
                var self = this;
                self.onmessage = function(event) {
                    var feedUrl = event.data.feedUrl;
                    //TODO:
                    //add other vars from controller object
                    if (feedUrl) {
                    console.log('Notifications - feed URL: ' + feedUrl);
                    //$http is unable to be recognized within the downloadFunction function
                    $http({
                      url:feedUrl, 
                      method:'GET',
                      //data: 
                      //clientID ?
                      //accessToken: ?      
                    //, 
                    headers: {
                      'Content-Type': 'application/x-www-form-urlencoded',
                      'Authentication': 'Bearer access-token'
                    }
                    }).then(function(response) {
                      //TODO:
                      //If response is successful, we pass the 
                      //response (as javascript object) back to main thread
                      //where it can be handled appropriately
                    }, function(response) {
                        //TODO:
                      //If response fails with 403 "token expired" error,
                      //we post message to main thread, and we create worker
                      //to refresh the expired token
                    })
                    }
                }
            }
            // end worker function

            //we create dataObj and blob to bypass the need for creating a separate js file for the worker
            var dataObj = '(' + downloadFunction + ')();'; // here is the trick to convert the above function to string
            var blob = new Blob([dataObj.replace('"use strict";', '')]); // firefox adds user strict to any function which was blocking might block worker execution so knock it off

            var blobURL = (window.URL ? URL : webkitURL).createObjectURL(blob, {
                type: 'application/javascript; charset=utf-8'
            });

            //this is where the worker will be created,
            //and the response data will be passed back
            //to main thread
            worker = new Worker(blobURL);
            worker.onmessage = function(e) {
                console.log('Download Worker said: ', e.data);
                defer.notify(e.data);
            };
            worker.postMessage(postData); // Send data to our worker.
            return defer.promise;
        },
        /////////////////////////////////////////////////////////////////////////////////////////
        //stop the download worker thread
        /////////////////////////////////////////////////////////////////////////////////////////
        stopDownload: function() {
            if (worker) {
                worker.terminate();
            }
        },
        /////////////////////////////////////////////////////////////////////////////////////////
        //function for refreshing expired tokens
        //Reminder: This function utilizes xmlHTTPRequest instead of $http
        /////////////////////////////////////////////////////////////////////////////////////////
        startRefresh: function(postData) {
            var defer = $q.defer();
            if (worker) {
                worker.terminate();
            }

            ////////////////////////////////////
            // worker function for 
            // making http POST call to sense api
            // using xmlHTTPrequest
            ////////////////////////////////////
            function refreshFunction() {
                var self = this;
                self.onmessage = function(event) {
                    var refreshUrl = event.data.refreshUrl;
                    if (refreshUrl) {
                        console.log('Notifications - refresh URL: ' + refreshUrl);           
                        (function refreshFunc() {
                                var xmlhttp = new XMLHttpRequest();
                                xmlhttp.onreadystatechange = function() {
                                    if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                                        var response = JSON.parse(xmlhttp.responseText);
                                        self.postMessage(response.id);
                                        refreshFunc();
                                    }
                                };
                                xmlhttp.open('POST', refreshUrl, true);
                                //add xml request headers here
                                xmlhttp.send();
                        
                        })();
                    }
                }
            }
            // end worker function

            //we create dataObj and blob to bypass the need for creating a separate js file for the worker
            var dataObj = '(' + refreshFunction + ')();'; // here is the trick to convert the above fucntion to string
            var blob = new Blob([dataObj.replace('"use strict";', '')]); // firefox adds user strict to any function which was blocking might block worker execution so knock it off

            var blobURL = (window.URL ? URL : webkitURL).createObjectURL(blob, {
                type: 'application/javascript; charset=utf-8'
            });

            //TODO: handle response from worker
            //and save refreshed access token and refresh token
            //to localStorage from main thread

            //create worker thread for refreshing tokens
            worker = new Worker(blobURL);
            worker.onmessage = function(e) {
                console.log('Refresh Worker said: ', e.data);
                defer.notify(e.data);
            };
            worker.postMessage(postData); // Send data to our worker.
            return defer.promise;
        },
        /////////////////////////////////////////////////////////////////////////////////////////
        //stop refresh worker thread
        /////////////////////////////////////////////////////////////////////////////////////////
        stopRefresh: function() {
            if (worker) {
                worker.terminate();
            }
        }
    }
}]);



app.controller("DownloadController", ["$scope", "myWorker", function($scope, myWorker){
/////////////////////////////////////////////////////////////////////////////////////////
//function which creates worker thread and attempts to download feed data for specified group member
/////////////////////////////////////////////////////////////////////////////////////////
$scope.getData = function(){

var downloadInput = {
    feedUrl: "https://apis.sen.se/v2/feeds/", // feed endpoint
    //TODO:
    //determine params we need to pass to worker
};

    $scope.downloadResult = myWorker.startDownload(downloadInput).then(function(response) {
    // complete
    $scope.status = response.status;
    $scope.data = response.data;
}, function(error) {
    // error
    console.log("Notification download worker RESPONSE: " + error);
}, function(response) {
    // notify 
    $scope.status = response.status;
    $scope.data = response.data;
    console.log("Notification download worker RESPONSE: " + response);
});
}
/////////////////////////////////////////////////////////////////////////////////////////
//function which stops download worker thread
/////////////////////////////////////////////////////////////////////////////////////////
$scope.stopData = function(){

    $scope.downloadStopResult = myWorker.stopDownload()
    // notify 
    console.log("Notification download worker STOPPED");
}
/////////////////////////////////////////////////////////////////////////////////////////
//function which creates worker thread to make http POST request to token refresh endpoint
/////////////////////////////////////////////////////////////////////////////////////////
$scope.refreshExpiredToken = function(){
var refreshInput = {
    //refreshUrl: "http://jsonplaceholder.typicode.com/posts/1",
    refreshUrl: "https://sen.se/api/v2/oauth2/refresh", // refresh endpoint
    //TODO:
    //determine params we need to pass to worker

};

    $scope.refreshResult = myWorker.startRefresh(refreshInput).then(function(response) {
    // complete
    $scope.refreshStatus = response.status;
    $scope.refreshData = response.data;
}, function(error) {
   console.log("Notification refresh worker RESPONSE: " + error);
    // error
}, function(response) {
    // notify 
    $scope.refreshStatus = response.status;
    $scope.refreshData = response.data;
    console.log("Notification refresh worker RESPONSE: " + response);
});
}
/////////////////////////////////////////////////////////////////////////////////////////
//function to stop refresh worker 
/////////////////////////////////////////////////////////////////////////////////////////
$scope.stopExpiredToken = function(){

$scope.stopResult = myWorker.stopRefresh()
    // notify
    console.log("Notification refresh worker STOPPED");
}

}]);



/*

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

*/
