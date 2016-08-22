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
  var today = input['yesttime'];
  var username = input['thisMember'].username;
  console.log("prevDay", prevDay);
  console.log("today", today);
  console.log("username", username);

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


  var getUids = function(arg){


    };

  var getPages = function(res, sensorArray){


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


  //initial http request.  subsequent request will be chained as ".then()" callbacks
  var dataUrl = "http://carewheels.cecs.pdx.edu:8080/getfeeds.php";//get page of nodes for this user
    $http({
      url:dataUrl, 
      method:'POST',    //all our custom REST endpoints have been designed to use POST
      data: $httpParamSerializerJQLike({    //serialize the parameters in the way PHP expects 
        usernametofind:username,
        gt:prevDay,
        lt:today        
      }), 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'   //make Angular use the same content-type header as PHP
      }
    }).then(function(response) {//STAGE 1, get uids from all specified sensors
        console.log("cecs data server", response);
        // 
        //return getEvents(response);

      }, function error(response) {
        console.log("request failed while outputting data back to main thread", response);
        //log appropriate error

      }).then(function(response) {//STAGE 6, send data back to main thread
        var thisMember = input["thisMember"];
        thisMember.sensorData = sensorData;
        console.log(sensorData);

        setTimeout(function(){//this timeout is to allow time for download to finish/return before it is called by analysis
        output.notify(JSON.parse(JSON.stringify(thisMember)));
        }, 5000);
        //OUTPUT.NOTIFY groupmember + sensorData back to main thread
        //where it is added back into groupInfo()

      }, function error(response) {
        console.log("request failed while outputting data back to main thread", response);
        //log appropriate error
      })


}]); //end of each worker thread promise

    workerPromise//this is where we give our inputs to the worker thread
      .then(function success(angularWorker) {

        var date = new Date();//create new data object
        date.setDate(date.getDate()); //roll back date 48 hours (-2 days)
        var userTime = date.toISOString();

        var yestdate = new Date();//create new data object
        yestdate.setDate(yestdate.getDate()-2); //roll back date 48 hours (-2 days)
        var yestTime = yestdate.toISOString();

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
        
        return angularWorker.run({thisMember: member, time: userTime, yesttime: yestTime, accesstoken: accesstoken, refreshtoken: refreshtoken});

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
