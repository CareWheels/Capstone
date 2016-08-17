angular.module('careWheels')

/////////////////////////////////////////////////////////////////////////////////////////
//Using angular-workers module
//(also added to angular.module at top of app.js)
//and added the angular-workers related js files in index.html
/////////////////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////////////////
//Sensor Data Download controller
/////////////////////////////////////////////////////////////////////////////////////////
.controller('DownloadCtrl', function($scope, $http, WorkerService, GroupInfo, User) {


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
var theseMembers = GroupInfo.groupInfo();//returns all five group members with carebank data after login

for (var i = 0; i < theseMembers.length; i++){

  var workerPromise = WorkerService.createAngularWorker(['input', 'output', '$http', '$httpParamSerializerJQLike', function (input, output, $http, $httpParamSerializerJQLike) {
    console.log("check in worker", input["accesstoken"]);


  var dataUrl = "https://apis.sen.se/v2/nodes/";//get page of nodes for this user
    $http({
      url:dataUrl,
      method:'GET',
      headers: {
        'Authorization': 'Bearer '+accesstoken
      }
    }).then(function(response) {
      console.log("this is a thread for group member with accesstoken: ", accesstoken);

    })



/////////////////////////////////////////////////////////////////////////////////////////
//MAIN THREAD
/////////////////////////////////////////////////////////////////////////////////////////
//This is where we handle the returned promise by the worker thread
//(this will be a javascript object containing sensor download data)
/////////////////////////////////////////////////////////////////////////////////////////

    workerPromise
      .then(function success(angularWorker) {

        var date = new Date();//create new data object
        date.setDate(date.getDate()-2); //roll back date 48 hours (-2 days)
        var userTime = date.toISOString();

        //make input object as arg for run()
        //we will need to include all properties which will be needed as params
        //when making refresh/post and download/get requests to sense

        //input to worker thread will accept "thesemembers" array variable, which contains token credentials for user's
        //group members within his/her carewheel
        theseMembers[i].index = i;
        console.log("inputting values into worker thread ", theseMembers[i]);
        //theseMembers[i].customValues[1].stringValue, theseMembers[i].customValues[2].stringValue;
        
        return angularWorker.run({theseMembers: theseMembers, time: userTime, accesstoken: theseMembers[i].customValues[1].stringValue, refreshtoken: theseMembers[i].customValues[2].stringValue});

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

        GroupInfo.addDataToGroup(update, update.index); //COMMENTED OUT DURING TESTING, ADD LATER
        console.log("group info check after sensor download", GroupInfo.groupInfo());

      });
      ////end of for loop for each user
  } //end of each worker thread promise
]);
}//for each group member
}})
