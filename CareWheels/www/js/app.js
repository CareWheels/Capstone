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

//Call to the UserInfo custom rest endpoint, which logs user in and then returns all the field data of another user as $scope.data;
//or one of the following error messages: "Missing username / password", "Invalid username / password", "Your access is blocked by 
//exceeding invalid login attempts", or a default catch "Error while performing login: errorCode".
app.controller("UserRestController", function($scope, $http, $log, $httpParamSerializerJQLike){
  $scope.url = 'http://carebank.carewheels.org:8080/userinfo.php';
  $scope.fetch = function(userIn, passIn, tofindIn) {
    $scope.code = null;
    $scope.response = null;
    $http({
      url:$scope.url, 
      method:'POST',    //all our custom REST endpoints have been designed to use POST
      data: $httpParamSerializerJQLike({    //serialize the parameters in the way PHP expects 
        username:userIn, 
        password:passIn, 
        usernametofind:tofindIn        
      }), 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'   //make Angular use the same content-type header as PHP
      }
    }).then(function(response) {    //the old $http success/error methods have been depricated; this is the new format
        $scope.status = response.status;
        $scope.data = response.data;
      }, function(response) {
        $scope.data = response.data || "Request failed";
        $scope.status = response.status;
    })
  };
});

//Call to the UpdateUserReminders endpoint, which logs a user in and updates all three of a user's (does not have to be the same user)
//reminder slots in the format HH:MM:SS. Returns same login errors as UserRestController. The contents of a reminder slot 
//are cleared by passing in '' rather than a string of the correct format.
app.controller("ReminderRestController", function($scope, $http, $log, $httpParamSerializerJQLike){
  $scope.url = 'http://carebank.carewheels.org:8080/updateuserreminders.php';
  $scope.fetch = function(userIn, passIn, toUpdate, rem1, rem2, rem3) {
    $scope.code = null;
    $scope.response = null;
    $http({
      url:$scope.url, 
      method:'POST',    //all our custom REST endpoints have been designed to use POST
      data: $httpParamSerializerJQLike({    //serialize the parameters in the way PHP expects 
        username:userIn, 
        password:passIn, 
        usernametoupdate:toUpdate,
        reminder1:rem1,
        reminder2:rem2,
        reminder3:rem3        
      }), 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'   //make Angular use the same content-type header as PHP
      }
    }).then(function(response) {    //the old $http success/error methods have been depricated; this is the new format
        $scope.status = response.status;
        $scope.data = response.data;
      }, function(response) {
        $scope.data = response.data || "Request failed";
        $scope.status = response.status;
    })
  };
});

//Call to the Group Member Info custom rest endpoint
app.controller("GroupRestController", function($scope, $http, $log, $httpParamSerializerJQLike){
  $scope.url = 'http://carebank.carewheels.org:8080/groupmemberinfo.php';
  $scope.fetch = function(userIn, passIn, groupName) {
    $scope.code = null;
    $scope.response = null;
    $http({
      url:$scope.url, 
      method:'POST',    //all our custom REST endpoints have been designed to use POST
      data: $httpParamSerializerJQLike({    //serialize the parameters in the way PHP expects 
        username:userIn, 
        password:passIn, 
        groupInternalName:groupName
      }), 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'   //make Angular use the same content-type header as PHP
      }
    }).then(function(response) {    //the old $http success/error methods have been depricated; this is the new format
        $scope.status = response.status;
        $scope.data = response.data;
      }, function(response) {
        $scope.data = response.data || "Request failed";
        $scope.status = response.status;
    })
  };
});

//Call to the UpdateLastOwnershipTakenTime endpoint, which logs a user in and updates the LastOwnershipTakenTime field for
//the member has an alert. This field uses the format XXXX/XX/XX XX:XX:XX. This will report the following error messages upon 
//failure: "Missing username / password", "Invalid username / password", "Your access is blocked by exceeding invalid login
//attempts", or a default catch "Error while performing login: errorCode".

// Nothing seems to verify whether or not this is working. I don't know what more can be done.
app.controller("OwnershipRestController", function($scope, $http, $log, $httpParamSerializerJQLike){
  $scope.url = 'https://carebank.carewheels.org:8443/updatelastownershiptakentime.php';
  $scope.fetch = function(userIn, passIn, toUpdate, ownershipTime) {
    $scope.code = null;
    $scope.response = null;
    $http({
      url:$scope.url, 
      method:'POST',    //all our custom REST endpoints have been designed to use POST
      data: $httpParamSerializerJQLike({    //serialize the parameters in the way PHP expects 
        username:userIn, 
        password:passIn, 
        usernametoupdate:toUpdate,
        lastownershiptakentime:ownershipTime,        
      }), 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'   //make Angular use the same content-type header as PHP
      }
    }).then(function(response) {    //the old $http success/error methods have been depricated; this is the new format
        $scope.status = response.status;
        $scope.data = response.data;
      }, function(response) {
        $scope.data = response.data || "Request failed";
        $scope.status = response.status;
    })
  };

  $scope.test = function(userIn, passIn, toUpdate) {
    $scope.code = null;
    $scope.response = null;
    $scope.ownershipTime = "2016/07/09 15:30:00";
    $http({
      url:$scope.url,
      method:'POST',
      data:$httpParamSerializerJQLike({
        username:userIn,
        password:passIn,
        usernametoupdate:toUpdate,
        lastownershiptakentime:$scope.ownershipTime,
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function(response) {
      $scope.status = response.status;
      $scope.data = response.data;
      $scope.value = response.data.customValues[6].stringValue;
      $scope.pass = ($scope.value === $scope.ownershipTime);
    }, function(response) {
      $scope.data = response.data || "Request failed";
      $scope.status = response.status;
    })
  };

});


//This doesn't work at all. I don't know the solution. Looking at the JSON string that returns, there is no instance of 
//"LastOwnershipTakenTime":XXXX/XX/XX XX:XX:XX anywhere in the string. There are several instances of "id":xxx..xx, so I 
//tried using id to get something/anything to print out.

//Based on:
//    var json = '{"count":1, "LastOwnershipTakenTime":"2016/07/06 18:00:00", "count":2}',
//    obj = JSON.parse(json);
//    alert(obj.count);
//    
//    prints out: 2 ...

//...I figured that obj.id should print out the last instance of id in the string, but nothing printed. I am not sure
//why. However, since "LastOwnershipTakenTime":XXXX/XX/XX XX:XX:XX does not actually appear in the string, using
//JSON.parse is probably not the answer. 
app.controller("GetOwnershipRestController", function($scope, $http, $log, $httpParamSerializerJQLike){
  $scope.url = 'http://carebank.carewheels.org:8080/groupmemberinfo.php';
  $scope.fetch = function(userIn, passIn, groupNameIn) {
    $scope.code = null;
    $scope.response = null;
    $http({
      url:$scope.url, 
      method:'POST',   //all our custom REST endpoints have been designed to use POST
      data: $httpParamSerializerJQLike({    //serialize the parameters in the way PHP expects 
        username:userIn, 
        password:passIn, 
        groupInternalName:groupNameIn,        
      }), 
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'   //make Angular use the same content-type header as PHP
      }
    }).then(function(response) {    //the old $http success/error methods have been depricated; this is the new format
        $scope.status = response.status;
        $scope.data = response.data;
        //obj = JSON.parse(response.data);
        //$scope.data = obj.LastOwnershipTakenTime;      // What I hoped would work
        //$scope.data = obj.id;                          // Checking to see if anything works (should contain x of last "id":x)
      }, function(response) {
        $scope.data = response.data || "Request failed";
        $scope.status = response.status;
    })
  };
});