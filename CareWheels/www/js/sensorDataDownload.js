angular.module('careWheels')

/////////////////////////////////////////////////////////////////////////////////////////
//Using angular-workers module
/////////////////////////////////////////////////////////////////////////////////////////

.controller('DownloadCtrl', function($scope, $http, WorkerService, GroupInfo, User) {

// The URL must be absolute because of the URL blob specification
WorkerService.setAngularUrl("https://ajax.googleapis.com/ajax/libs/angularjs/1.5.6/angular.min.js");

  /////////////////////////////////////////////////////////////////////////////////////////
  //DATA DOWNLOAD FUNCTION
  /////////////////////////////////////////////////////////////////////////////////////////

//this is the main function called after login
$scope.DownloadData = function () {

//this function spans the life one single worker thread (from input, to output back to main thread)
//we need to wrap it in this function, or else worker threads cannot be created for each group member
var workerCreation = function(member) {//input to workerCreation is a single group member

  //this is the creation of the worker thread promise (returned to main thread below)
  var workerPromise = WorkerService.createAngularWorker(['input', 'output', '$http', '$httpParamSerializerJQLike', function (input, output, $http, $httpParamSerializerJQLike) {

  var prevDay = input['time'];
  var presenceUids = [];//this will be used to store all of the uids for all feed objects, so we can access events urls later
  var fridgeUids = [];
  var medUids = [];
  var alertUids = [];
  var presenceEvents = [];//this will store all events gathered from each presence UID
  var fridgeEvents = [];
  var medEvents = [];
  var alertEvents = [];
  var sensorData = {//this will attach to each member and be sent to analysis
    "Presence": [],
    "Fridge": [],
    "Meds": [],
    "Alert": []
  };

  //This function explores the response received from /nodes/
  //and finds the appropriate uid's within the publishes array
  //of the node object with the desired label (presence, med, fridge)
  var getUids = function(arg){

    var nodes = arg.data;
    var objects = nodes.objects;
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

  var getPages = function(res, sensorArray){
    var url = res.data.links.next;
    console.log("downloading next page...");
        $http({
          url: url,
          method:'GET',
          headers: {
            'Authorization': 'Bearer '+input["accesstoken"]
          }
        }).then(function(response) {
          if (response.data.links.next == null){
            console.log("download last page of data for this uid...");
            var objectCount = response.data.objects.length;
            for (var j = 0; j < objectCount; j++){
              sensorArray.push(response.data.objects[j]);
              return sensorArray;
            };
          }
          else{ // >100 event objects implies more than one page of data
            for (var k = 0; k < 100; k++){//add the 100 events on first page
              sensorArray.push(response.data.objects[k]);
            };
            return getPages(response, sensorArray);
          }
          //return sensorData.Presence;
          
        }, function error(response) {
          console.log("request failed at /events/", response);
          //log appropriate error
        })
  };

  var getEvents = function(uidArray, sensorArray){//use appropriate uid array to make http request to /events/ endpoint
    var uidLength = uidArray.length;
    for (var i = 0; i < uidLength; i++){//for each uid in uids array
      var currentUid = uidArray[i];
      $http({
        url:"https://apis.sen.se/v2/feeds/"+currentUid+"/events/"+"?gt="+prevDay,
        method:'GET',
        headers: {
          'Authorization': 'Bearer '+input["accesstoken"]
        }
      }).then(function(response) {
        if (response.data.links.next == null){
          var objectCount = response.data.objects.length;
          for (var j = 0; j < objectCount; j++){
            sensorArray.push(response.data.objects[j]);
          };
        }
        else{ // >100 event objects implies more than one page of data
          for (var k = 0; k < 100; k++){//add the 100 events on first page
            sensorArray.push(response.data.objects[k]);
          };
          return getPages(response, sensorArray);
        }
        //return sensorData.Presence;
        
      }, function error(response) {
        console.log("request failed at /events/", response);
        //log appropriate error
      })
    }
  };

  var refreshFunc = function(){//For when http request is denied due to 403 expired token
  var refreshUrl = "https://apis.sen.se/v2/oauth2/refresh/";
  $http({
    url:refreshUrl,
    method:'POST',
    headers: {
      'Authorization': 'Bearer '+refreshtoken
    }
  }).then(function(response) {
      console.log("sen.se refresh request success", response);
    }, function(response) {
      console.log("sen.se refresh request fail", response);
      }
    )
  };

  //initial http request.  subsequent request will be chained as ".then()" callbacks
  var dataUrl = "https://apis.sen.se/v2/nodes/";//get page of nodes for this user
    $http({
      url:dataUrl,
      method:'GET',
      headers: {
        'Authorization': 'Bearer '+ input["accesstoken"]
      }
    }).then(function(response) {//STAGE 1, get uids from all specified sensors
        console.log("/nodes/", response);
        //GET UIDS FOR EACH 
        return getUids(response);

      }, function error(response) {
        console.log("request failed at /nodes/", response);
        //log appropriate error

    }).then(function(response) {//STAGE 2, presence events

        //GET EVENTS FOR EACH 
        return getEvents(presenceUids, sensorData.Presence);
        //console.log(response);

      }, function error(response) {
        console.log("request failed at presence /events/", response);
        //log appropriate error

      }).then(function(response) {//STAGE 3, med events

        return getEvents(medUids, sensorData.Meds);
        //GET EVENTS FOR EACH 
        //console.log(response);

      }, function error(response) {
        console.log("request failed at Med /events/", response);
        //log appropriate error
      }).then(function(response) {//STAGE 4, fridge events

        return getEvents(fridgeUids, sensorData.Fridge);
        //GET EVENTS FOR EACH 
        //console.log(response);

      }, function error(response) {
        console.log("request failed at Fridge /events/", response);
        //log appropriate error

      }).then(function(response) {//STAGE 5, alert events

        return getEvents(alertUids, sensorData.Alert);
        //GET EVENTS FOR EACH 
        //console.log(response);

      }, function error(response) {
        console.log("request failed at Alert /events/", response);
        //log appropriate error

      }).then(function(response) {//STAGE 6, send data back to main thread
        var thisMember = input["thisMember"];
        thisMember.sensorData = sensorData;
        console.log(sensorData);

        setTimeout(function(){//this timeout is to allow time for download to finish/return before it is called by analysis
        output.notify(JSON.parse(JSON.stringify(thisMember)));
        }, 6000);
        //OUTPUT.NOTIFY groupmember + sensorData back to main thread
        //where it is added back into groupInfo()

      }, function error(response) {
        console.log("request failed while outputting data back to main thread", response);
        //log appropriate error
      })

//Use uids to make requests to appropriate /events/ endpoints

//chain .then() for additional pages

//save /events/ in appropriate arrays

//return member object with sensorData via output.notify to main thread

}]); //end of each worker thread promise

    workerPromise//this is where we give our inputs to the worker thread
      .then(function success(angularWorker) {

        var date = new Date();//create new data object
        date.setDate(date.getDate()-2); //roll back date 48 hours (-2 days)
        var userTime = date.toISOString();

        //make input object as arg for run()
        //we will need to include all properties which will be needed as params
        //when making refresh/post and download/get requests to sense

        //input to worker thread will accept "thesemembers" array variable, which contains token credentials for user's
        //group members within his/her carewheel
        //theseMembers[i].index = i;
        console.log("inputting values into worker thread ", member);
        //theseMembers[i].customValues[1].stringValue, theseMembers[i].customValues[2].stringValue;
        var accesstoken = member.customValues[1].stringValue;
        var refreshtoken = member.customValues[2].stringValue;
        
        return angularWorker.run({thisMember: member, time: userTime, accesstoken: accesstoken, refreshtoken: refreshtoken});

      }, function error(reason) {//this is where the worker thread returns

          console.log('callback error');
          console.log(reason);

          //for some reason the worker failed to initialize
          //not all browsers support the HTML5 tech that is required, see below.
        }).then(function success(result) {

          console.log('success', result);

        //handle result
      }, function error(reason) {
          //handle error
          console.log('error');
          console.log(reason);

        }, function notify(update) {//this is where we will receive our data once the worker thread has finished downloading
          //handle update
          $scope.data = update.data;
          $scope.status = update.status;
          //$scope.update = update;
          console.log('Download Complete', update);
          $scope.msg = "Download Complete";

          GroupInfo.addDataToGroup(update, update.index); //COMMENTED OUT DURING TESTING, ADD LATER
          console.log("group info check after sensor download", GroupInfo.groupInfo());
      });
}

var theseMembers = GroupInfo.groupInfo();//returns all five group members with carebank data after login

for (var i = 0; i < theseMembers.length; i++){//this is where we loop over each group member, check for keys, and create worker thread
  theseMembers[i].index = i;
  if (theseMembers[i].customValues[1].stringValue == "000" || theseMembers[i].customValues[1].stringValue == "" ||
    theseMembers[i].customValues[2].stringValue == "000" || theseMembers[i].customValues[2].stringValue == "")
    {
      theseMembers[i].sensorData = null;
      console.log("error, please obtain valid sen.se keys!");
    }
  else{
    console.log("creating new worker thread and download data...");
    workerCreation(theseMembers[i]);
    };
}
}});
