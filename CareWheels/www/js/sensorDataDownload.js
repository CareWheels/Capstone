var app = angular.module('careWheels')

/////////////////////////////////////////////////////////////////////////////////////////
//Using angular-workers module
//(also added to angular.module at top of app.js)
//and added the angular-workers related js files in index.html
/////////////////////////////////////////////////////////////////////////////////////////


/////////////////////////////////////////////////////////////////////////////////////////
//Sensor Data Download controller
/////////////////////////////////////////////////////////////////////////////////////////
app.controller('DownloadCtrl', function($scope, $http, WorkerService, GroupInfo, User) {


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



    //we save the value passed in as time to the prevDay variable
    //the time value will be 24 less than current user time, and adjusted for the offset of the sen.se server's timezone
    var prevDay = input['time'];

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
    var downloadFunc = function(thisMember, accesstoken, refreshtoken){
    if (accesstoken == "000" || refreshtoken == "000"){
        thisMember.sensorData = null;
        output.notify(JSON.parse(JSON.stringify(thisMember)));
        return console.log("error, please obtain valid sen.se keys!");
    };

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
          if (objects[i].label == "presenceCareBank"){//match label
            console.log("added presence uid");
            var presFeeds = objects[i].publishes
            var presLength = presFeeds.length;
            for (var j = 0; j < presLength; j++){//iterate over publishes[]
              if (presFeeds[j].label == "Presence"){
              presenceUids.push(presFeeds[j].uid);//add uid with the specified label "Presence" to array
              }
            }; 
          }
          if (objects[i].label == "fridgeCareBank"){
            console.log("added fridge uid");
            var fridgeFeeds = objects[i].publishes
            var fridgeLength = fridgeFeeds.length;
            for (var j = 0; j < fridgeLength; j++){
              if (fridgeFeeds[j].label == "Motion"){
              fridgeUids.push(fridgeFeeds[j].uid);
              }
            }; 
          }
          if (objects[i].label == "medsCareBank"){
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
        //var mem = {
        //  "sensorData": sensorData
        //};
        thisMember.sensorData = sensorData;
        console.log("RETURNING SENSORDATA OBJECT after timeout");
        output.notify(JSON.parse(JSON.stringify(thisMember)));
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
    
      downloadFunc(carewheelMembers[z], carewheelMembers[z].customValues[1].stringValue, carewheelMembers[z].customValues[2].stringValue);
      
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

//////////////////////////////////////////

//var user = moment();//current user time
//var sense = user.clone().tz("Europe/Berlin");//same moment in time, with sense server offset

//var userTime = sense;
//userTime = JSON.parse(JSON.stringify(userTime));
//console.log("inspect time variable", userTime);

var date = new Date();//create new data object
date.setDate(date.getDate()-1);
var prevDayLA = moment.tz( date.toISOString(), "America/Los_Angeles");
var prevDayParis = prevDayLA.clone().tz("Europe/Paris");
var userTime = prevDayParis.toISOString();
        //END TESTING        
//////////////////////////////////////////////////////////////

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
        var thesemembers = GroupInfo.retrieveLocal();
        return angularWorker.run({carewheelMembers: thesemembers, time: userTime});


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
        console.log('Download Complete', update);
        $scope.msg = "Download Complete";

        GroupInfo.addSensorDataToGroup(update); //COMMENTED OUT DURING TESTING, ADD LATER

      });
      ////end of for loop for each user
  };
});