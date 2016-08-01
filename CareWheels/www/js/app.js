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
  app.constant('BASE_URL', 'https://carebank.carewheels.org:8443')

  app.run(function($ionicPlatform, $ionicHistory, $state) {

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
  app.factory('API', function(BASE_URL) {
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
  app.factory('GroupInfo', function() {
    return [];
  })

  // User factory

  app.factory('User', function(DownloadService, GroupInfo, BASE_URL, $http, API, $state, $httpParamSerializerJQLike, $ionicPopup, $ionicLoading) {
    var user = {};
    //window.localStorage['loginCredentials'] = null;

    user.login = function(uname, passwd, rmbr) {
      $ionicLoading.show({      //pull up loading overlay so user knows App hasn't frozen
        template: '<ion-spinner></ion-spinner>'+
                  '<p>Contacting Server...</p>'
      });
      return $http({
        url:API.userAndGroupInfo,
        method: 'POST',
        data: $httpParamSerializerJQLike({
            username:uname,
            password:passwd,
            usernametofind:uname
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function(response) {
        if (rmbr)
          window.localStorage['loginCredentials'] = angular.toJson({"username":uname, "password":passwd});
        //store user info
        //store groupMember info

        window.sessionStorage['user'] = angular.toJson({"username":uname, "password":passwd});
        GroupInfo = response.data;
        DownloadService.addGroupInfo(response.data);
        $ionicLoading.hide();   //make sure to hide loading screen
        $state.go('testButtons')
        //$state.go('groupStatus')

      }, function(response) {
        //present login failed
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      })
    };
    return user;
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
app.controller('DownloadCtrl', function($scope, $http, WorkerService, DataService, GroupInfo, DownloadService, User) {


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

    var carewheelMembers = input['carewheelMembers'];
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
    var downloadFunc = function(name, accesstoken, refreshtoken){

    var dataUrl = "https://apis.sen.se/v2/nodes/";//get page of nodes for this user
    $http({
      url:dataUrl, 
      method:'GET',    
      headers: {
        'Authorization': 'Bearer '+accesstoken
      }
    }).then(function(response) {   

        //This function explores the response received from /nodes/
        //and finds the appropriate uid's within the publishes array
        //of the node object with the desired label (presence, med, fridge)
        var getUids = function(arg){
        
        var feeds = arg.data;
        var objects = feeds.objects;
        var objectsLength = objects.length;
        for (var i = 0; i < objectsLength; i++){//iterate over all node objects on the returned page
          console.log("CHECKING NODES...");
          if (objects[i].label == "presenceDataAnalysisSensor"){//match label
            console.log("added presence uid");
            var presFeeds = objects[i].publishes
            var presLength = presFeeds.length;
            for (var j = 0; j < presLength; j++){//iterate over publishes[]
              if (presFeeds[j].label == "Presence"){
              presenceUids.push(presFeeds[j].uid);//add uid with the specified label "Presence" to array
              }
            }; 
          }
          if (objects[i].label == "fridgeDataAnalysisSensor"){
            console.log("added fridge uid");
            var fridgeFeeds = objects[i].publishes
            var fridgeLength = fridgeFeeds.length;
            for (var j = 0; j < fridgeLength; j++){
              if (fridgeFeeds[j].label == "Motion"){
              fridgeUids.push(fridgeFeeds[j].uid);
              }
            }; 
          }
          if (objects[i].label == "medicationDataAnalysisSensor"){
            console.log("added med uid");
            var medFeeds = objects[i].publishes
            var medLength = medFeeds.length;
            for (var j = 0; j < medLength; j++){
              if (medFeeds[j].label == "Motion"){
              medUids.push(medFeeds[j].uid);
              }
            }; 
          }
          if (objects[i].label == "testtesttest"){//added this in case we need to find an alert uid
            console.log("added alert uid");
            var alertFeeds = objects[i].publishes
            var alertLength = alertFeeds.length;
            for (var j = 0; j < alertLength; j++){
              if (alertFeeds[j].label == "Alert"){
              alertUids.push(alertFeeds[j].uid);
              }
            }; 
          }
          else{
            continue;
          }
        };
      };

      getUids(response);//adds all specified node objects (and their published uids) to appropriate arrays
                        //only for the first page (10 node objects) of response

/////////HANDLE > 1 pages from /nodes/ endpoint
/*
          if (feeds.links.next != null){
            var feedPages = Math.ceil(feeds.totalObjects / 10);
            for (var p = 2; p < feedPages + 1; p++){ //this is to handle multiple pages of feed objects returned from sense api
            $http({
              url: "https://apis.sen.se/v2/feeds/?page="+p, //get url of next page
              method:'GET',
              headers: {
                'Authorization': 'Bearer '+input['accesstoken']
              }
            }).then(function(response) {
                getUids(response);
            }, function(response) {
                if (response.status === 403){
                refreshFunc();
                console.log("refreshed while retrieving next page of feed objects ");
                //FINISH//////
                //try to download from sense, but limit after n attempts
                //to prevent infinite re-attempts
                }       
            
              console.log("failed while attempting to retrieve next page of feed objects", response);
              }
            )
            } 
          };
  */

        var presenceLength = presenceUids.length;
        var fridgeLength = fridgeUids.length;
        var medLength = medUids.length;
        var alertLength = alertUids.length;
        //use lt or gt at end of url to only return events occuring within the last 24 hours
        //1994-11-05T08:15:30-05:00 corresponds to November 5, 1994, 8:15:30 am, US Eastern Standard Time
        var date = new Date();
        date.setDate(date.getDate()-1);
        var prevDay = date.toISOString();
        
        ///////////////////
        //TODO
        //handle additional pages of event objects by constructing url for those pages
        //e.g. add &page=15 to get event objects on page 15 if available
        ///////////////////

/////////////////LOOP TO COLLECT PRESENCE OBJECTS AND PUSH TO APPROPRIATE       
        for (var i = 0; i < presenceLength; i++){//for each uid in uids array
            $http({
              url:"https://apis.sen.se/v2/feeds/"+presenceUids[i]+"/events/"+"?gt="+prevDay,
              method:'GET',
              headers: {
                'Authorization': 'Bearer '+accesstoken
              }
            }).then(function(response) {
                var presenceEventList = response.data;
                var eventsLeftToAdd = presenceEventList.totalObjects;
                if (eventsLeftToAdd < 100){
                  for (var j = 0; j < eventsLeftToAdd; j++){
                    console.log("pushing presence event to array in first if block...");
                    sensorData.Presence.push(presenceEventList.objects[j]);
                  };
                }
                else { // >100 event objects implies more than one page of data
                  for (var k = 0; k < 100; k++){
                    console.log("pushing presence event to array in first else block...");
                    sensorData.Presence.push(presenceEventList.objects[k]);
                    eventsLeftToAdd = eventsLeftToAdd - 100;
                  };
                  var pages = Math.ceil(presenceEventList.totalObjects / 100);
                  for (var m = 2; m < pages + 1; m++){
                    $http({
                      url:"https://apis.sen.se/v2/feeds/"+presenceUids[i]+"/events/"+"?gt="+prevDay+"&page="+m,
                      method:'GET',
                      headers: {
                        'Authorization': 'Bearer '+accesstoken
                      }
                    }).then(function(response) {
                        if (eventsLeftToAdd < 100){
                          for (var n = 0; n < eventsLeftToAdd; n++){
                          console.log("pushing presence event from next page to array (if block)...");
                          sensorData.Presence.push(presenceEventList.objects[n]);
                          };
                        }
                        else {
                          for (var n = 0; n < 100; n++){
                          console.log("pushing presence event from next page to array (else block)...");
                          sensorData.Presence.push(presenceEventList.objects[n]);
                          eventsLeftToAdd = eventsLeftToAdd - 100;
                          };
                        };

                    }, function(response) {

                        if (response.status === 403){
                        refreshFunc();
                        //try to download from sense, but limit after n attempts
                        //to prevent infinite re-attempts
                        }       
                      console.log("get event fail within inner for loop", response);
                      }
                      )
                  };
                };
     
            }, function(response) {

                if (response.status === 403){
                refreshFunc();
                //try to download from sense, but limit after n attempts
                //to prevent infinite re-attempts
                }       
            
              console.log("get event fail - Original http call", response);
              }
            )
        };

/////////////////LOOP TO COLLECT FRIDGE OBJECTS AND PUSH TO APPROPRIATE
        for (var i = 0; i < fridgeLength; i++){//for each uid in uids array
            $http({
              url:"https://apis.sen.se/v2/feeds/"+fridgeUids[i]+"/events/"+"?gt="+prevDay,
              method:'GET',
              headers: {
                'Authorization': 'Bearer '+accesstoken
              }
            }).then(function(response) {
                var fridgeEventList = response.data;
                var eventsLeftToAdd = fridgeEventList.totalObjects;
                if (eventsLeftToAdd < 100){
                  for (var j = 0; j < eventsLeftToAdd; j++){
                    console.log("pushing fridge event to array in first if block...");
                    sensorData.Fridge.push(fridgeEventList.objects[j]);
                  };
                }
                else { // >100 event objects implies more than one page of data
                  for (var k = 0; k < 100; k++){
                    console.log("pushing fridge event to array in first else block...");
                    sensorData.Fridge.push(fridgeEventList.objects[k]);
                    eventsLeftToAdd = eventsLeftToAdd - 100;
                  };
                  var pages = Math.ceil(fridgeEventList.totalObjects / 100);
                  for (var m = 2; m < pages + 1; m++){
                    $http({
                      url:"https://apis.sen.se/v2/feeds/"+fridgeUids[i]+"/events/"+"?gt="+prevDay+"&page="+m,
                      method:'GET',
                      headers: {
                        'Authorization': 'Bearer '+accesstoken
                      }
                    }).then(function(response) {
                        if (eventsLeftToAdd < 100){
                          for (var n = 0; n < eventsLeftToAdd; n++){
                          console.log("pushing fridge event from next page to array (if block)...");
                          sensorData.Fridge.push(fridgeEventList.objects[n]);
                          };
                        }
                        else {
                          for (var n = 0; n < 100; n++){
                          console.log("pushing fridge event from next page to array (else block)...");
                          sensorData.Fridge.push(fridgeEventList.objects[n]);
                          eventsLeftToAdd = eventsLeftToAdd - 100;
                          };
                        };

                    }, function(response) {

                        if (response.status === 403){
                        refreshFunc();
                        //try to download from sense, but limit after n attempts
                        //to prevent infinite re-attempts
                        }       
                      console.log("get event fail within inner for loop", response);
                      }
                      )
                  };
                };
     
            }, function(response) {

                if (response.status === 403){
                refreshFunc();
                //try to download from sense, but limit after n attempts
                //to prevent infinite re-attempts
                }       
            
              console.log("get event fail - Original http call", response);
              }
            )
        };

/////////////////LOOP TO COLLECT MED OBJECTS AND PUSH TO APPROPRIATE
        for (var i = 0; i < medLength; i++){//for each uid in uids array
            $http({
              url:"https://apis.sen.se/v2/feeds/"+medUids[i]+"/events/"+"?gt="+prevDay,
              method:'GET',
              headers: {
                'Authorization': 'Bearer '+accesstoken
              }
            }).then(function(response) {
                var medEventList = response.data;
                var eventsLeftToAdd = medEventList.totalObjects;
                if (eventsLeftToAdd < 100){
                  for (var j = 0; j < eventsLeftToAdd; j++){
                    console.log("pushing med event to array in first if block...");
                    sensorData.Meds.push(medEventList.objects[j]);
                  };
                }
                else { // >100 event objects implies more than one page of data
                  for (var k = 0; k < 100; k++){
                    console.log("pushing med event to array in first else block...");
                    sensorData.Meds.push(medEventList.objects[k]);
                    eventsLeftToAdd = eventsLeftToAdd - 100;
                  };
                  var pages = Math.ceil(medEventList.totalObjects / 100);
                  for (var m = 2; m < pages + 1; m++){
                    $http({
                      url:"https://apis.sen.se/v2/feeds/"+medUids[i]+"/events/"+"?gt="+prevDay+"&page="+m,
                      method:'GET',
                      headers: {
                        'Authorization': 'Bearer '+accesstoken
                      }
                    }).then(function(response) {
                        if (eventsLeftToAdd < 100){
                          for (var n = 0; n < eventsLeftToAdd; n++){
                          console.log("pushing med event from next page to array (if block)...");
                          sensorData.Meds.push(medEventList.objects[n]);
                          };
                        }
                        else {
                          for (var n = 0; n < 100; n++){
                          console.log("pushing med event from next page to array (else block)...");
                          sensorData.Meds.push(medEventList.objects[n]);
                          eventsLeftToAdd = eventsLeftToAdd - 100;
                          };
                        };

                    }, function(response) {

                        if (response.status === 403){
                        refreshFunc();
                        //try to download from sense, but limit after n attempts
                        //to prevent infinite re-attempts
                        }       
                      console.log("get event fail within inner for loop", response);
                      }
                      )
                  };
                };
     
            }, function(response) {

                if (response.status === 403){
                refreshFunc();
                //try to download from sense, but limit after n attempts
                //to prevent infinite re-attempts
                }       
            
              console.log("get event fail - Original http call", response);
              }
            )
        };

/////////////////LOOP TO COLLECT ALERT OBJECTS AND PUSH TO APPROPRIATE
        for (var i = 0; i < alertLength; i++){//for each uid in uids array
            $http({
              url:"https://apis.sen.se/v2/feeds/"+alertUids[i]+"/events/"+"?gt="+prevDay,
              method:'GET',
              headers: {
                'Authorization': 'Bearer '+accesstoken
              }
            }).then(function(response) {
                var alertEventList = response.data;
                var eventsLeftToAdd = alertEventList.totalObjects;
                if (eventsLeftToAdd < 100){
                  for (var j = 0; j < eventsLeftToAdd; j++){
                    console.log("pushing alert event to array in first if block...");
                    sensorData.Alert.push(alertEventList.objects[j]);
                  };
                }
                else { // >100 event objects implies more than one page of data
                  for (var k = 0; k < 100; k++){
                    console.log("pushing alert event to array in first else block...");
                    sensorData.Alert.push(alertEventList.objects[k]);
                    eventsLeftToAdd = eventsLeftToAdd - 100;
                  };
                  var pages = Math.ceil(alertEventList.totalObjects / 100);
                  for (var m = 2; m < pages + 1; m++){
                    $http({
                      url:"https://apis.sen.se/v2/feeds/"+alertUids[i]+"/events/"+"?gt="+prevDay+"&page="+m,
                      method:'GET',
                      headers: {
                        'Authorization': 'Bearer '+accesstoken
                      }
                    }).then(function(response) {
                        if (eventsLeftToAdd < 100){
                          for (var n = 0; n < eventsLeftToAdd; n++){
                          console.log("pushing alert event from next page to array (if block)...");
                          sensorData.Alert.push(alertEventList.objects[n]);
                          };
                        }
                        else {
                          for (var n = 0; n < 100; n++){
                          console.log("pushing alert event from next page to array (else block)...");
                          sensorData.Alert.push(alertEventList.objects[n]);
                          eventsLeftToAdd = eventsLeftToAdd - 100;
                          };
                        };

                    }, function(response) {

                        if (response.status === 403){
                        refreshFunc();
                        //try to download from sense, but limit after n attempts
                        //to prevent infinite re-attempts
                        }       
                      console.log("get event fail within inner for loop", response);
                      }
                      )
                  };
                };
     
            }, function(response) {

                if (response.status === 403){
                refreshFunc();
                //try to download from sense, but limit after n attempts
                //to prevent infinite re-attempts
                }       
            
              console.log("get event fail - Original http call", response);
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
        console.log("download func failed", response);
        //EXIT PROMISE
        })
        //END OF ORIGINAL HTTP PROMISE
   
        setTimeout(function(){ //This is a bad solution.  Need to develop a promise to return sensorData once all events have been acquired
        var mem = {
          "name": name,
          "sensorData": sensorData
        };
        console.log("RETURNING SENSORDATA OBJECT after timeout");
        output.notify(JSON.parse(JSON.stringify(mem)));
        }, 5000);
        
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
        'Authorization': 'Bearer '+refreshtoken
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

    console.log("about to download data for: ", carewheelMembers);
    for(z=0; z < carewheelMembers.length; z++ ){
            //return angularWorker.run({name: thesemembers[z].name, refreshtoken: thesemembers[z].customValues[2], accesstoken: thesemembers[z].customValues[1]});
 
    downloadFunc(carewheelMembers[z].name, carewheelMembers[z].customValues[1].stringValue, carewheelMembers[z].customValues[2].stringValue);
    };
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
      //
        //var thesemembers = DownloadService.getGroupInfo();

        //input to worker thread will accept "thesemembers" array variable, which contains token credentials for user's
        //group members within his/her carewheel
        //return angularWorker.run({name: thesemembers[z].name, refreshtoken: thesemembers[z].customValues[2], accesstoken: thesemembers[z].customValues[1]});
        var thesemembers = DownloadService.getGroupInfo();
        return angularWorker.run({carewheelMembers: thesemembers});


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
        //$scope.update = update;
        console.log('Download Complete');
        $scope.msg = "Download Complete";

        DataService.addToGroup(update); //COMMENTED OUT DURING TESTING, ADD LATER

      });
      ////end of for loop for each user
  };
});

/////////////////////////////////////////////////////////////////////////////////////////
//This factory 
//We inject this service into groupStatusController, so that it can tell us what group (which people)
//to download data for
/////////////////////////////////////////////////////////////////////////////////////////
app.factory('DownloadService', function() {

  var membersToDownload = [];
  // public API
  return {
    addGroupInfo: function (group) {
      var allGroupMembers = group;

    for (i=0; i < allGroupMembers.length; i++){
        if (allGroupMembers[i].group.name == "CareWheel 1") {
          membersToDownload.push(allGroupMembers[i]);
        };
      }
      console.log("group members in current users carewheel = ", membersToDownload);

    },
    getGroupInfo: function () {

      console.log('memberstodownload', membersToDownload);
      return membersToDownload;
    }
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

      // Excluding Medication analysis for now
      // since we don't know how we are going to handle it.


      // Create loop to analyze each members data.
      for(var z = 0; z < $scope.groupData.length; ++z ) {

        // Shortcuts to our data
        var presenceData = JSON.parse($scope.groupData[z].Presence);
        var fridgeData = JSON.parse($scope.groupData[z].Fridge);
        var medsData = JSON.parse($scope.groupData[z].Meds);

        // Setup our presence  and fridge matrices
        var w = 0;
        var presenceMatrix = [];
        var constantPresence = [];
        var presenceByHour = [];
        var fridgeMatrix = [];
        var fridgeHitsByHour = [];
        var fridgeInterval1StartHour = 6;
        var fridgeInterval2StartHour = 11;
        var fridgeInterval3StartHour = 16;
        var fridgeAlertInterval1 = true;
        var fridgeAlertInterval2 = true;
        var fridgeAlertInterval3 = true;
        var fridgeAlertPoints = 0;
        var fridgeAlertLevel = 0;
        var medsMatrix = [];
        var medsHitsByHour = [];
        var medsInterval1StartHour = 6;
        var medsInterval2StartHour = 11;
        var medsInterval3StartHour = 16;
        var medsAlertInterval1 = true;
        var medsAlertInterval2 = true;
        var medsAlertInterval3 = true;
        var medsAlertPoints = 0;
        var medsAlertLevel = 0;
        var now = new Date();
        var currentHour = now.getHours();
        var currentMin = now.getMinutes();
        var analysisData;

        // Initialize our matrices
        for(w = 0; w < 24; ++w) {
          presenceMatrix[w] = [];
          fridgeMatrix[w] = [];
          fridgeHitsByHour[w] = 0;
          medsMatrix[w] = [];
          medsHitsByHour[w] = 0;
          constantPresence[w] = true;
          presenceByHour[w] = false;

          for(var y = 0; y < 60; ++y) {
            presenceMatrix[w][y] = false;
            fridgeMatrix[w][y] = 0;
            medsMatrix[w][y] = 0;
          }

        }

        // Populate our matrices
        for(w = 0; w < presenceData.length; ++w) {
          var hour = new Date(presenceData[w].dateEvent).getHours();
          var min = new Date(presenceData[w].dateEvent).getMinutes();

          if(presenceData[w].data.code = 200) {
            presenceMatrix[hour][min] = true;
          }

          if(presenceData[w].data.code = 404) {
            constantPresence[hour] = false;
          }
        }

        for(w =0; w < fridgeData; ++w) {
          var hour = new Date(fridgeData[w].dateEvent).getHours();
          var min = new Date(fridgeData[w].dateEvent).getMinutes();

          fridgeMatrix[hour][min] += 1;
        }

        for(w =0; w < medsData; ++w) {
          var hour = new Date(medsData[w].dateEvent).getHours();
          var min = new Date(medsData[w].dateEvent).getMinutes();

          medsMatrix[hour][min] += 1;
        }

        //Presence of user pre-current hour: at end of hour, Displayed analysis as prescribed by
        // Claude should look at the status of the user "at the end of the hour"
        // Due to sensor timing this will need to be a bit fuzzy.
        for(w = 0; w < currentHour; ++w) {

          if(presenceMatrix[w][57] || presenceMatrix[w][58] || presenceMatrix[w][59] ) {
            presenceByHour[w] = true;
          }
        }

        // Display of presence for current hour, should be the "True" presence of the user.
        // Still need to go fuzzy, as we can't rely on a sensor ping to be in the current minute.
        for(w = 0; w < currentMin; ++w) {

          // Edge case of any hour between 0 to 3 min into that hour.
          if(currentMin < 3 && currentHour != 0) {
            if(presenceMatrix[currentHour - 1][57] || presenceMatrix[currentHour - 1][58] || presenceMatrix[currentHour - 1][59] ) {
              presenceByHour[currentHour] = true;
            }
          }
          // Very edge case of 12:00am to 12:03am
          if(currentMin < 3 && currentHour == 0) {
            presenceByHour[currentHour] = true;
          }

          // Normal case, do a fuzzy check for presence.
          if(presenceMatrix[currentHour][currentMin - 2] || presenceMatrix[currentHour][currentMin - 1] ||
            presenceMatrix[currentHour][currentMin] ) {
            presenceByHour[currentHour] = true;
          }
        }

        //Analyze the fridge for hits by hour
        for(w = 0; w < currentHour; ++w) {

          for(var y = 0; y < 60; ++y) {
            fridgeHitsByHour += fridgeMatrix[w][y];
          }
        }

        //Analyze the meds for hits by hour
        for(w = 0; w < currentHour; ++w) {

          for(var y = 0; y < 60; ++y) {
            medsHitsByHour += medsMatrix[w][y];
          }
        }

        // Begin clearing the fridgeAlertInterval's if we have criteria to do so.
        // If they opened their fridge during an interval OR
        //     If a person isn't constantly at home during an interval we will consider
        //     that they ate somewhere else during that interval
        // Interval 1: 6:00am to 10:59am
        for(w = 5; w < 10; ++w) {

          if(fridgeHitsByHour[w] > 0 || !constantPresence[w]) {
            fridgeAlertInterval1 = false;
          }
        }

        // Interval 2: 11:00am to 3:59pm
        for(w = 10; w < 15; ++w) {

          if(fridgeHitsByHour[w] > 0 || !constantPresence[w]) {
            fridgeAlertInterval2 = false;
          }
        }

        // Interval 3: 4:00pm to 9:59pm
        for(w = 15; w < 21; ++w) {

          if(fridgeHitsByHour[w] > 0 || !constantPresence[w]) {
            fridgeAlertInterval3 = false;
          }
        }

        // Begin clearing the medsAlertInterval's if we have criteria to do so.
        // If they moved their medication during an interval OR
        //     If a person isn't constantly at home during an interval we will consider
        //     that they ate somewhere else during that interval
        // Interval 1: 6:00am to 10:59am
        for(w = 5; w < 10; ++w) {

          if(medsHitsByHour[w] > 0 || !constantPresence[w]) {
            medsAlertInterval1 = false;
          }
        }

        // Interval 2: 11:00am to 3:59pm
        for(w = 10; w < 15; ++w) {

          if(medsHitsByHour[w] > 0 || !constantPresence[w]) {
            medsAlertInterval2 = false;
          }
        }

        // Interval 3: 4:00pm to 9:59pm
        for(w = 15; w < 21; ++w) {

          if(medsHitsByHour[w] > 0 || !constantPresence[w]) {
            medsAlertInterval3 = false;
          }
        }

        // Use this hard coded date until we can pull it from each member in currentGroup
        var lastOwnershipTimeTaken = new Date("2016-01-01T01:35:29.189");
        var lastOwnershipHour = lastOwnershipTimeTaken.getHours();

        // If the last ownership time taken was on the same day,
        // we will check to see when that time was, and if after or within an
        // interval we will set the fridge alert to false.
        if(now.toDateString() == lastOwnershipTimeTaken.toDateString()) {

          if(lastOwnershipHour >= fridgeInterval1StartHour) {
            fridgeAlertInterval1 = false;
          }

          if(lastOwnershipHour >= fridgeInterval2StartHour) {
            fridgeAlertInterval2 = false;
          }

          if(lastOwnershipHour >= fridgeInterval3StartHour) {
            fridgeAlertInterval3 = false;
          }

        }

        // If the last ownership time taken was on the same day,
        // we will check to see when that time was, and if after or within an
        // interval we will set the meds alert to false.
        if(now.toDateString() == lastOwnershipTimeTaken.toDateString()) {

          if(lastOwnershipHour >= fridgeInterval1StartHour) {
            medsAlertInterval1 = false;
          }

          if(lastOwnershipHour >= fridgeInterval2StartHour) {
            medsAlertInterval2 = false;
          }

          if(lastOwnershipHour >= fridgeInterval3StartHour) {
            medsAlertInterval3 = false;
          }

        }

        // We have finished processing all exceptions to fridge interval alerts
        // when there are no fridge hits. Begin adding up fridge alert points.
        if(fridgeAlertInterval1) {
          fridgeAlertPoints += 1;
        }

        if(fridgeAlertInterval2) {
          fridgeAlertPoints += 1;
        }

        if(fridgeAlertInterval3) {
          fridgeAlertPoints += 1;
        }

        // They've only missed one meal set
        // their alert level to 1 for yellow.
        if(fridgeAlertPoints = 1) {
          fridgeAlertLevel = 1;
        }

        if(fridgeAlertPoints >= 2) {

          // Set the users fridgeAlert level to 2 for red alert.
          fridgeAlertLevel = 2;

          // **************************
          // Call local notifications here to send a red alert out for this person.
          // **************************
        }

        // We have finished processing all exceptions to meds interval alerts
        // when there are no meds hits. Begin adding up meds alert points.
        if(medsAlertInterval1) {
          medsAlertPoints += 1;
        }

        if(medsAlertInterval2) {
          medsAlertPoints += 1;
        }

        if(medsAlertInterval3) {
          medsAlertPoints += 1;
        }

        // If they've missed any medications set
        // their alert level to red.
        if(medsAlertPoints > 0) {
          medsAlertLevel = 2;

          // **************************
          // Call local notifications here to send a red alert out for this person.
          // **************************
        }


        // presenceMatrix a [24][60] matrix containing true in a
        // second dimension element if there was a sensor ping recorded
        // in the corresponding minute, false otherwise.

        // constantPresence a 24 element array, an element contains true
        // if the user was present at all times, specifically if an "Absent"
        // status was sent, then an element will be false.

        // presenceByHour a 24 element array, previous to the current hour an element
        // is determined by the user's presence as described in the presenceMatrix according
        // to the end of that hour and nothing else.
        // for the current hour, the user's presence is determined by their presence at the current time
        // as a fuzzy calculation of the past few minutes, as described in the presenceMatrix.

        // fridgeMatrix a [24][60] matrix containing the number of fridge motion pings during each
        // minute described by the second dimension of the matrix.

        // fridgeHitsByHour a 24 element matrix, an element is true if the fridgeMatrix had a ping anytime
        // during that corresponding hour, false otherwise.

        // fridgeInterval1Starthour a hard coded hour for the time meal interval 1 begins.
        // fridgeInterval2StarHour a hard coded hour for the time meal interval 2 begins.
        // fridgeInterval3StartHour a hard coded hour for the time meal interval 3 begins.

        // fridgeAlertInterval1 a boolean indicating true if there was no refridgerator pings
        // during meal interval 1, false otherwise.
        // fridgeAlertInterval2 a boolean indicating true if there was no refridgerator pings
        // during meal interval 2, false otherwise.
        // fridgeAlertInterval3 a boolean indicating true if there was no refridgerator pings
        // during meal interval 3, false otherwise.

        // fridgeAlertPoints the internally calculated value of fridgeAlertIntervals that were true
        // and could not be set to false due to exceptions. Currently the same as fridgeAlertLevel.

        // fridgeAlertLevel a value set by the calculation of fridgeAlertPoints, should be used as to
        // what the user's current fridge alert level should be, 0 = blue, 1 = yellow, 2 = red. Currently
        // the same as fridgeAlertPoints, may change in the future as algroithm becomes more complex.
        //
        // medsMatrix a [24][60] matrix containing the number of meds motion pings during each
        // minute described by the second dimension of the matrix.

        // medsHitsByHour a 24 element matrix, an element is true if the medsMatrix had a ping anytime
        // during that corresponding hour, false otherwise.

        // medsInterval1Starthour a hard coded hour for the time meds interval 1 begins.
        // medsInterval2StarHour a hard coded hour for the time meds interval 2 begins.
        // medsInterval3StartHour a hard coded hour for the time meds interval 3 begins.

        // medsAlertInterval1 a boolean indicating true if there was no meds pings
        // during meds interval 1, false otherwise.
        // medsAlertInterval2 a boolean indicating true if there was no meds pings
        // during meds interval 2, false otherwise.
        // medsAlertInterval3 a boolean indicating true if there was no meds pings
        // during meds interval 3, false otherwise.

        // medsAlertPoints the internally calculated value of medsAlertIntervals that were true
        // and could not be set to false due to exceptions. Currently the same as medsAlertLevel.

        // medsAlertLevel a value set by the calculation of medsAlertPoints, should be used as to
        // what the user's current meds alert level should be, 0 = blue, 1 = yellow, 2 = red. Currently
        // the same as medsAlertPoints, may change in the future as algroithm becomes more complex.


        analysisData = {

          "presenceMatrix": presenceMatrix,
          "constantPresence": constantPresence,
          "presenceByHour": presenceByHour,
          "fridgeMatrix": fridgeMatrix,
          "fridgeHitsByHour": fridgeHitsByHour,
          "fridgeInterval1StartHour": fridgeInterval1StartHour,
          "fridgeInterval2StartHour": fridgeInterval2StartHour,
          "fridgeInterval3StartHour": fridgeInterval3StartHour,
          "fridgeAlertInterval1": fridgeAlertInterval1,
          "fridgeAlertInterval2": fridgeAlertInterval2,
          "fridgeAlertInterval3": fridgeAlertInterval3,
          "fridgeAlertPoints": fridgeAlertPoints,
          "fridgeAlertLevel": fridgeAlertLevel,
          "medsMatrix": medsMatrix,
          "medsHitsByHour": medsHitsByHour,
          "medsInterval1StartHour": medsInterval1StartHour,
          "medsInterval2StartHour": medsInterval2StartHour,
          "medsInterval3StartHour": medsInterval3StartHour,
          "medsAlertInterval1": medsAlertInterval1,
          "medsAlertInterval2": medsAlertInterval2,
          "medsAlertInterval3": medsAlertInterval3,
          "medsAlertPoints": medsAlertPoints,
          "medsAlertLevel": medsAlertLevel
        }

        // This is just a modification of what Zach has done.
        var memberObject = {
          "name": "test",
          "sensorData": $scope.groupData[i],
          "analysisData": analysisData
        };

        DataService.addToGroup(memberObject);

      }

      /*
       if ($scope.groupData.length < 4){
       console.log("group data array not yet ready for analysis");
       }
       */

    };
    testFunc();
    console.log('contents of $scope.groupData in Analysis', $scope.groupData);

  };

});