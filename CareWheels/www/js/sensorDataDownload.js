angular.module('careWheels')

.factory('Download', function($http, $httpParamSerializerJQLike, WorkerService, GroupInfo, User) {
  var DownloadService = {};

//this is the main function called after login
DownloadService.DownloadData = function () {

  var getData = function (member) {


  var usernametofind = member.username.toLowerCase();//for each group member
  var user = User.credentials();//from login
  var password = user.password;//credentials of logged in user
  var username = user.username;
  
  //http request to carebank /getfeeds/ endpoint
  var dataUrl = "https://carewheels.cecs.pdx.edu:8443/analysis.php";//get page of nodes for this user
    return $http({
      url:dataUrl, 
      method:'POST',    
      data: $httpParamSerializerJQLike({    //serialize the parameters in the way PHP expects 
        usernametofind:usernametofind,
        username:username,
        password:password      
      }), 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'   //make Angular use the same content-type header as PHP
      }
    }).then(function(response) {

        console.log("cecs data server", response);

        var thisMember = member;//each group member
        thisMember.analysisData = response.data;//add sensorData to group member object
        GroupInfo.addDataToGroup(thisMember, thisMember.index); //add back to group

        if(response.data.newMedsRollingAlertLevel >= 2) { 
          notifications.Create_Notif(0, 0, 0, false, 0);
        }

        if(response.data.newFridgeRollingAlertLevel >= 2) {
          notifications.Create_Notif(0, 0, 0, false, 0);
        }

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
      //theseMembers[i].sensorData = null;
      console.log("error, please obtain valid sen.se keys!");
    }
  else{
    getData(theseMembers[i]);
    };
};
};
return DownloadService;
});


