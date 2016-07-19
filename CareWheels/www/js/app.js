// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('careWheels', ['ionic', 'ngCordova', 'FredrikSandell.worker-pool'])

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

//Notifications Component, as defined in design document. To be used to generate User Reminders and Red Alert tray notifications on Android.
app.controller("NotificationController", function($scope, $log, $cordovaLocalNotification){
  var isAndroid = window.cordova!=undefined;    //checks to see if cordova is available on this platform; platform() erroneously returns 'android' on Chrome Canary so it won't work
  function Time() {this.hours=0; this.minutes=0; this.seconds=0; this.on=true;};
  window.localStorage['Reminders'] = null;    //Turning this on simulates starting from fresh storage every time controller is called by view change
  $scope.data = angular.fromJson(window.localStorage['Reminders']);   //needs to be called outside the functions so it persists for all of them

  //To be called during app startup after login; retrieves saved alert times (if they exist) or creates default alerts (if they don't) 
  //and calls Create_Notif for each of them
  $scope.Init_Notifs = function() {
    if($scope.data==null){   //have notifications been initialized before?
      $scope.data = [];    //data param needs to be initialized before indices can be added
      $scope.data[0] = new Time();
      $scope.data[1] = new Time();
      $scope.data[2] = new Time();
      $scope.Create_Notif(10,0,0,true,1);  //these correspond to the pre-chosen default alarm times
      $scope.Create_Notif(14,0,0,true,2);
      $scope.Create_Notif(19,0,0,true,3);
    } else {    //need to check if each reminder, as any/all of them could be deleted by user
      if($scope.data[0]) $scope.Create_Notif($scope.data[0].hours,$scope.data[0].minutes,$scope.data[0].seconds,$scope.data[0].on,1);
      if($scope.data[1]) $scope.Create_Notif($scope.data[1].hours,$scope.data[1].minutes,$scope.data[1].seconds,$scope.data[1].on,2);
      if($scope.data[2]) $scope.Create_Notif($scope.data[2].hours,$scope.data[2].minutes,$scope.data[2].seconds,$scope.data[2].on,3);
    }
    $log.log("Notifications initialized");
  }

  //Schedules a local notification and, if it is a reminder, saves a record of it to local storage. reminderNum must be <4
  //or it will log an error and schedule no notifications.
  $scope.Create_Notif = function(hours=0, minutes=0, seconds=0, isOn=true, reminderNum=0){
    if(reminderNum==0){   //is notif a red alert?
      if(isAndroid){
        $cordovaLocalNotification.schedule({    //omitting 'at' and 'every' params means it occurs once, immediately
          id: reminderNum,
          message: "There are red alert(s) on your CareWheel!",
          title: "CareWheels",
          sound: null   //should be updated to freeware sound
        }).then(function() {
          $log.log("Alert notification has been set");
        });        
      } else $log.warn("Plugin disabled");
    } else if(reminderNum <4){    //is notif a user reminder?
      var time = new Date();    //defaults to current date/time
      time.setHours(hours);     //update 
      $scope.data[reminderNum-1].hours = hours;
      time.setMinutes(minutes);
      $scope.data[reminderNum-1].minutes = minutes;
      time.setSeconds(seconds);
      $scope.data[reminderNum-1].seconds = seconds;
      $scope.data[reminderNum-1].on = isOn;
      window.localStorage['Reminders'] = angular.toJson($scope.data);   //save $scope.data so new reminder is stored

      if(isAndroid){
        $cordovaLocalNotification.schedule({
          id: reminderNum,
          firstAt: time,
          every: "day",
          message: "Reminder " + reminderNum + ": Please check in with your CareWheel!",
          title: "CareWheels",
          sound: null   //same, hopefully a different sound than red alerts
        }).then(function() {
          $log.log("Notification" + reminderNum + "has been scheduled for " + time.getUTCTime() + ", daily");
        });    
      } else $log.warn("Plugin disabled"); 
    } else $log.warn("Incorrect attempt to create notification for id #" + reminderNum);
  };

  //Unschedules a local notification; clears its index if it is a user reminder (id 1-3). If id is invalid clear() will not
  //throw errors. Delete_Notif(0) is technically valid but Red Alerts are one-time and instant so unscheduling them is unnecessary.
  $scope.Delete_Notif = function(id){   //NOTE: id corresponds to $scope.data array indices so it is off by one
    if(isAndroid){
      $cordovaLocalNotification.clear(id, function() {
        $log.log(id + " is cleared");
      });
    } else $log.warn("Plugin disabled"); 
    if(id==1||id==2||id==3){    //if deleted notif is a user reminder
      $scope.data[id] = null;   //clear its index
      window.localStorage['Reminders'] = angular.toJson($scope.data);   //and save $scope.data so deletiion is remembered
    }
  }

  //Unschedules a local notification as per Delete_Notif but does NOT clear storage or data index; to be used by User Reminder's Toggle()
  $scope.Toggle_Off_Notif = function(id){
    if(id==1||id==2||id==3){
      $scope.data[id-1].on = false;
      window.localStorage['Reminders'] = angular.toJson($scope.data);   //and save $scope.data so toggle is remembered
    } 
    if(isAndroid){
      $cordovaLocalNotification.clear(id, function() {
        $log.log(id + " is cleared");
      });
    } else $log.warn("Plugin disabled"); 
  }

  //prints the in-memory and scheduled status of Reminders, for testing purposes
  $scope.Notifs_Status = function(){
    $scope.data = angular.fromJson(window.localStorage['Reminders']);
    alert("In memory: \nReminder 1= (" +$scope.data[0].on +") "+ $scope.data[0].hours + ":" + $scope.data[0].minutes + ":" + $scope.data[0].seconds +
      "\nReminder 2= (" +$scope.data[0].on +") "+ $scope.data[1].hours + ":" + $scope.data[1].minutes + ":" + $scope.data[1].seconds +
      "\nReminder 3= (" +$scope.data[0].on +") "+ $scope.data[2].hours + ":" + $scope.data[2].minutes + ":" + $scope.data[2].seconds);
    if(isAndroid){
      cordova.plugins.notification.local.get([1, 2, 3], function (notifications) {
        alert("Scheduled: " + notifications);
      });      
    } else $log.warn("Plugin disabled");
  }
});

/////////////////////////////////////////////////////////////////////////////////////////
//Using angular-workers module
//(also added to angular.module at top of app.js)
//and added the angular-workers related js files in index.html
/////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////
//controller
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////
//TODO: Inject 'GroupInfo' service to access groupmemberinfo object
/////////////////////////////////////////////////////////////////////////////////////////
app.controller('DownloadCtrl', function($scope, WorkerService, DataService) {

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

    ///////////////////////////////////////////////////////////////////////////
    //FUNCTION
    //Attempts sen.se download
    //if expired token error, calls refreshToken function
    //$http request to sen.se with access token to attempt to retrieve feed data
    ///////////////////////////////////////////////////////////////////////////
    var downloadFunc = function(){
    //var dataUrl = "http://jsonplaceholder.typicode.com/posts/1";
    var dataUrl = "https://apis.sen.se/v2/feeds/";
    $http({
      url:dataUrl, 
      method:'GET',    
      data: $httpParamSerializerJQLike({   
       //accesstoken:input['accesstoken']
       
      }), 
      headers: {
        //'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Type': 'application/JSON',
        //'Authorization': 'Bearer access-token'
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
        
        if (response.status === 403){
          refreshFunc();
          //try to download from sense, but limit after n attempts
          //to prevent infinite re-attempts
        }       
        
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
        //refreshtoken:input['refreshtoken']
      }), 
      headers: {
        //'Content-Type': 'application/x-www-form-urlencoded',
        //'Authorization': 'Bearer refresh-token'
      }
    }).then(function(response) {

        //output.notify(JSON.parse(JSON.stringify(response)));
        console.log("sen.se refresh request success", response);

      }, function(response) {
        //

        //output.notify(JSON.parse(JSON.stringify(response)));
        console.log("sen.se refresh request fail", response);

        }
      )
    };


    downloadFunc();
    //refreshFunc();

  }]);


/////////////////////////////////////////////////////////////////////////////////////////
//MAIN THREAD
/////////////////////////////////////////////////////////////////////////////////////////
//This is where we handle the returned promise by the worker thread
//(this will be a javascript object containing sensor download data)
/////////////////////////////////////////////////////////////////////////////////////////

    workerPromise
      .then(function success(angularWorker) {
      //The input must be serializable
      //console.log('reached');

      //make input object as arg for run()
      //we will need to include all properties which will be needed as params
      //when making refresh/post and download/get requests to sense

      //currently testing with bill's access/refresh tokens
      return angularWorker.run({refreshtoken:"PjBiwFdKyXwDsfm82FfVVK6IGWLLk0", accesstoken:"A0RegyQMErQ7DgqS1a9f8KxcnAsjt5"});
      
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
        //*******************************************
        //TODO:
        //Save successful response object 
        //Will be used/parsed in DataService factory
        //*******************************************
      });
  };
});


/////////////////////////////////////////////////////////////////////////////////////////
//Factory for parsing feed data returned from promise in DownloadCtrl above
//We can then inject this service into AnalysisCtrl
/////////////////////////////////////////////////////////////////////////////////////////
app.factory('DataService', function() {


    return [];//return object, containing an array of group members, each with 3 feed objects
  
});

/////////////////////////////////////////////////////////////////////////////////////////
//Controller for Sensor Data Analysis
//Will receive parsed feed data from the injected DataService factory
/////////////////////////////////////////////////////////////////////////////////////////
app.controller('AnalysisCtrl', function($scope, DataService) {





});

