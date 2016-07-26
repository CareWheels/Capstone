// Ionic Starter App


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('careWheels', [
  'ionic',
  'ui.router',
  'ngCordova',
  'FredrikSandell.worker-pool'
])

  //contant definition for endpoint base url
  .constant('BASE_URL', 'https://carebank.carewheels.org:8443')

  .run(function($ionicPlatform, $ionicHistory, $state) {

//    window.localStorage['loginCredentials'] = null;


    $ionicPlatform.registerBackButtonAction(function(event) {
      console.log("in registerbackbutton");
      $state.go($ionicHistory.backTitle());
    }, 100);

    $ionicPlatform.ready(function() {
      if(window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);
      }
      if(window.StatusBar) {
        StatusBar.styleDefault();
      }
    });

  })

  // API factory for making all php endpoints globally accessible.
  .factory('API', function(BASE_URL) {
    var api = {
      userAndGroupInfo:     BASE_URL + '/userandgroupmemberinfo.php',
      userInfo:             BASE_URL + '/userinfo.php',
      updateUserReminders:  BASE_URL + '/updateuserreminders.php',
      groupMemberInfo:      BASE_URL + '/groupmemberinfo.php',
      updateLastOwnership:  BASE_URL + '/updatelastownershiptakentime.php',
      dailyTrxHist:         BASE_URL + '/dailytransactionhistory.php'
    };
    return api;
  })

  // GroupInfo factory for global GroupInfo
  .factory('GroupInfo', function() {
    return [];
  })

  // User factory
  .factory('User', function(GroupInfo, BASE_URL, $http, API, $state, $httpParamSerializerJQLike, $ionicPopup) {
    var user = {};
    //window.localStorage['loginCredentials'] = null;

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
//TODO: Inject 'GroupInfo' service to access groupmemberinfo object (to obtain sen.se credentials)
//Will be manually entering credentials in GET/POST requests during testing
/////////////////////////////////////////////////////////////////////////////////////////
app.controller('DownloadCtrl', function($scope, $http, WorkerService, DataService, GroupInfo) {


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


    var presenceUids = [];//this will be used to store all of the uids for all feed objects, so we can access events urls later
    var fridgeUids = [];
    var medUids = [];
    var alertUids = [];
    var presenceEvents = [];//this will store all events gathered from each presence UID
    var fridgeEvents = [];
    var medEvents = [];
    var alertEvents = [];
    var sensorData = {//this will be the object sent to analysis
      "Presence": [],
      "Fridge": [],
      "Meds": [],
      "Alert": []
    };
    var count = 1;//this will be used in constructing the page urls
    var downloadFunc = function(){

    var dataUrl = "https://apis.sen.se/v2/feeds/";
    $http({
      url:dataUrl, 
      method:'GET',    
      headers: {
        'Authorization': 'Bearer '+input['accesstoken']
      }
    }).then(function(response) {   

        //received response, send to main thread
        //NOTE: need to JSON.parse + stringify the response
        //or else there will be an error as we attempt to 
        //pass the response back to main thread
        

        var feeds = response.data;
        var objects = feeds.objects;
        var objectsLength = objects.length;
        for (var i = 0; i < objectsLength; i++){
          console.log("CHECKING UID...");
          if (objects[i].label == "Presence"){
            console.log("added presence uid");
            presenceUids.push(objects[i].uid);
          }
          if (objects[i].label == "Motion"){
            console.log("added fridge uid");
            fridgeUids.push(objects[i].uid);
          }
          if (objects[i].label == "Motion-medsxxxxtest"){
            console.log("added med uid");
            medUids.push(objects[i].uid);
          }
          if (objects[i].label == "xxxxtest"){
            console.log("added alert uid");
            alertUids.push(objects[i].uid);
          }
          else{
            continue;
          }
        };
/*
          
          if (feeds.links.next != null){ //this is to handle multiple pages of feed objects returned from sense api
            count++;//for url construction

            $http({
              url: "https://apis.sen.se/v2/feeds/?page="+count, //get url of next page
              method:'GET',
              headers: {
                'Authorization': 'Bearer '+input['accesstoken']
              }
            }).then(function(response) {
                //TODO 
                console.log("don't go here yet");
                
            }, function(response) {

                if (response.status === 403){
                refreshFunc();
                //FINISH//////
                //try to download from sense, but limit after n attempts
                //to prevent infinite re-attempts
                }       
            
              console.log("download func fail on next page", response);
              }
            )
          }
          
          //return uids;
        }
*/
        var presenceLength = presenceUids.length;
        var fridgeLength = fridgeUids.length;
        var medLength = medUids.length;
        var alertLength = alertUids.length;


/////////////////LOOP TO COLLECT PRESENCE OBJECTS AND PUSH TO APPROPRIATE       
        for (var i = 0; i < presenceLength; i++){//for each uid in uids array
            $http({
              url:"https://apis.sen.se/v2/feeds/"+presenceUids[i]+"/events/", //get url of next page
              method:'GET',
              headers: {
                'Authorization': 'Bearer '+input['accesstoken']
              }
            }).then(function(response) {
                var presenceEventList = response.data;
                for (var i = 0; i < presenceEventList.totalObjects; i++){
                  console.log("pushing presence event to array...");
                  sensorData.Presence.push(presenceEventList.objects[i]);
                };

                //output.notify(JSON.parse(JSON.stringify(events)));
                //return events;
                
            }, function(response) {

                if (response.status === 403){
                refreshFunc();
                //try to download from sense, but limit after n attempts
                //to prevent infinite re-attempts
                }       
            
              console.log("get event fail", response);
              }
            )
        };

/////////////////LOOP TO COLLECT FRIDGE OBJECTS AND PUSH TO APPROPRIATE
        for (var i = 0; i < fridgeLength; i++){//for each uid in uids array
            $http({
              url:"https://apis.sen.se/v2/feeds/"+fridgeUids[i]+"/events/", //get url of next page
              method:'GET',
              headers: {
                'Authorization': 'Bearer '+input['accesstoken']
              }
            }).then(function(response) {
                var fridgeEventList = response.data;
                for (var i = 0; i < fridgeEventList.totalObjects; i++){
                  console.log("pushing fridge event to array");
                  sensorData.Fridge.push(fridgeEventList.objects[i]);
                };

                //output.notify(JSON.parse(JSON.stringify(events)));
                //return events;
                
            }, function(response) {

                if (response.status === 403){
                refreshFunc();
                //try to download from sense, but limit after n attempts
                //to prevent infinite re-attempts
                }       
            
              console.log("get event fail", response);
              }
            )
        };

/////////////////LOOP TO COLLECT MED OBJECTS AND PUSH TO APPROPRIATE
        for (var i = 0; i < medLength; i++){//for each uid in uids array
            $http({
              url:"https://apis.sen.se/v2/feeds/"+medUids[i]+"/events/", //get url of next page
              method:'GET',
              headers: {
                'Authorization': 'Bearer '+input['accesstoken']
              }
            }).then(function(response) {
                var medEventList = response.data;
                for (var i = 0; i < medEventList.totalObjects; i++){
                  console.log("pushing med event to array...");
                  sensorData.Meds.push(medsEventList.objects[i]);
                };

                //output.notify(JSON.parse(JSON.stringify(events)));
                //return events;
                
            }, function(response) {

                if (response.status === 403){
                refreshFunc();
                //try to download from sense, but limit after n attempts
                //to prevent infinite re-attempts
                }       
            
              console.log("get event fail", response);
              }
            )
        };

/////////////////LOOP TO COLLECT ALERT OBJECTS AND PUSH TO APPROPRIATE
        for (var i = 0; i < alertLength; i++){//for each uid in uids array
            $http({
              url:"https://apis.sen.se/v2/feeds/"+alertUids[i]+"/events/", //get url of next page
              method:'GET',
              headers: {
                'Authorization': 'Bearer '+input['accesstoken']
              }
            }).then(function(response) {
                var alertEventList = response.data;
                for (var i = 0; i < alertEventList.totalObjects; i++){
                  console.log("pushing alert event to array...");
                  sensorData.Alert.push(alertEventList.objects[i]);
                };

                //output.notify(JSON.parse(JSON.stringify(events)));
                //return events;
                
            }, function(response) {

                if (response.status === 403){
                refreshFunc();
                //try to download from sense, but limit after n attempts
                //to prevent infinite re-attempts
                }       
            
              console.log("get event fail", response);
              }
            )
        };

        //This is the end of the ".then" promise from the intital http GET call to /feeds/ endpoint
        //output.notify(JSON.parse(JSON.stringify(events)));//this will be the successful response of events being sent to main thread
        //console.log("these are the event objects -being sent to main thread.  Victory!", events);
        
      }, function(response) {//This is the beginning of the "error" promise from the intital http GET call to /feeds/ endpoint
        //if we fail the request to a 403 expired token error
        //call refresh function
        if (response.status === 403){
          refreshFunc();
          //try to download from sense, but limit after n attempts
          //to prevent infinite re-attempts
        }       
        //output.notify(JSON.parse(JSON.stringify(response)));//for testing, DELETE AFTER TESTING
        console.log("download func fail", response);
        //EXIT PROMISE
        })
        //END OF ORIGINAL HTTP PROMISE
   
        setTimeout(function(){ //This is a bad solution.  Need to develop a promise to return sensorData once all events have been acquired
        console.log("RETURNING SENSORDATA OBJECT after timeout");
        output.notify(JSON.parse(JSON.stringify(sensorData)));
        }, 10000);
        
      //output event notify
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
        'Authorization': 'Bearer '+input['refreshtoken']
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
    //output.notify(JSON.parse(JSON.stringify(events)));
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

      //bill = access-A0RegyQMErQ7DgqS1a9f8KxcnAsjt5, refresh-PjBiwFdKyXwDsfm82FfVVK6IGWLLk0
      //claude = access-XGDy6rcjvQgBnQbY40fS9p1w1bWqBc, refresh-UMogAOAGq6nUzTEqJovINFjjxAzyMK
      return angularWorker.run({refreshtoken:"UMogAOAGq6nUzTEqJovINFjjxAzyMK", accesstoken:"XGDy6rcjvQgBnQbY40fS9p1w1bWqBc"});
      
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
        console.log('notify');
        var mem = {
          "name": "xyzTest", //will be pulled from groupInfo service
          "sensorData": update
        };
        DataService.addToGroup(mem); //COMMENTED OUT DURING TESTING, ADD LATER

      });
  };
});


/////////////////////////////////////////////////////////////////////////////////////////
//Factory for parsing feed data returned from promise in DownloadCtrl above
//We can then inject this service into AnalysisCtrl
/////////////////////////////////////////////////////////////////////////////////////////
app.factory('DataService', function() {

  var currentGroup = [];

  // public API
  return {
    getGroup: function () { 
      if (currentGroup == null){
          return console.error("Group data has not been parsed yet!");
        }
      return currentGroup; 
    },
    addToGroup: function ( id ) { 
      //will be called by data download.  This will be an object
      //which contains up to 5 members, with and array of 3 feeds each
      objectToAdd = id;
      console.log('object to add', objectToAdd);
      /////////////////////////////////////////////////////////////////////////////////////////
      //This is where i will parse the feed object, and save it to currentGroup
      /////////////////////////////////////////////////////////////////////////////////////////
      currentGroup.push(objectToAdd);
      console.log('check currentGroup contents', currentGroup);

    }
  };
  
});

/////////////////////////////////////////////////////////////////////////////////////////
//Controller for Sensor Data Analysis
//Will receive parsed feed data from the injected DataService factory
/////////////////////////////////////////////////////////////////////////////////////////
app.controller('AnalysisCtrl', function($scope, DataService) {
  
  $scope.AnalyzeData = function(){
    var testFunc = function(){
    
    $scope.groupData = DataService.getGroup();

/*
    if ($scope.groupData.length < 4){
      console.log("group data array not yet ready for analysis");
    }
*/


    }
    testFunc();
    console.log('contents of $scope.groupData in Analysis', $scope.groupData);  

  };

});
