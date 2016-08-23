angular.module('careWheels')

.factory('Download', function($http, $httpParamSerializerJQLike, WorkerService, GroupInfo, User) {
  var DownloadService = {};

//this is the main function called after login
DownloadService.DownloadData = function () {

  var getData = function (member) {

  var date = new Date();//create new data object
  date.setDate(date.getDate()); 
  var today = date.toISOString();
  //today = "2016-08-22T23:59:59";//test data for http request. will delete later

  var yestdate = new Date();
  yestdate.setDate(yestdate.getDate()-1); //roll back date 24 hours (-1 days)
  var yest = yestdate.toISOString();
  //yest = "2016-08-21T00:00:00";//test data for http request. will delete later

  var usernametofind = member.username.toLowerCase();//for each group member
  var user = User.credentials();//from login
  var password = user.password;//credentials of logged in user
  var username = user.username;
  
  var sensorData = {//this will attach to each member and will be analyzed
    "Presence": [],
    "Fridge": [],
    "Meds": [],
    "Alert": []
  };

  var getEvents = function(res){//use appropriate uid array to make http request to /events/ endpoint
    for (var i = 0; i < res.data.length; i++){
      if (res.data[i].feedType == "presence"){
        sensorData.Presence.push(res.data[i]);
      }
      if (res.data[i].feedType == "meals"){
        sensorData.Fridge.push(res.data[i]);
      }
      if (res.data[i].feedType == "medication"){
        sensorData.Meds.push(res.data[i]);
      }
      else {
        continue;
      }
    };
  };

  //http request to carebank /getfeeds/ endpoint
  var dataUrl = "https://carewheels.cecs.pdx.edu:8443/getfeeds.php";//get page of nodes for this user
    return $http({
      url:dataUrl, 
      method:'POST',    
      data: $httpParamSerializerJQLike({    //serialize the parameters in the way PHP expects 
        usernametofind:usernametofind,
        username:username,
        password:password,
        gt:yest,
        lt:today        
      }), 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'   //make Angular use the same content-type header as PHP
      }
    }).then(function(response) {

        console.log("cecs data server", response);
        //run getevent function
        getEvents(response);

        var thisMember = member;//each group member
        thisMember.sensorData = sensorData;//add sensorData to group member object

        GroupInfo.addDataToGroup(thisMember, thisMember.index); //add back to group

      }, function error(response) {
        console.log("request failed ", response);
        //log appropriate error
      })
};

var theseMembers = GroupInfo.groupInfo();//returns all five group members with carebank data after login

for (var i = 0; i < theseMembers.length; i++){//this is where we loop over each group member, check for keys, and download data
  theseMembers[i].index = i;
  if (theseMembers[i].customValues[1].stringValue == "000" || theseMembers[i].customValues[1].stringValue == "" ||
    theseMembers[i].customValues[2].stringValue == "000" || theseMembers[i].customValues[2].stringValue == "")
    {
      theseMembers[i].sensorData = null;
      console.log("error, please obtain valid sen.se keys!");
    }
  else{
    getData(theseMembers[i]);
    };
};
};
return DownloadService;
});
