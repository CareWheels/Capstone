// Ionic Starter App

angular.module('careWheels', [
  'ionic',
  'ui.router',
  'ngCordova'
])

  //contant definition for endpoint base url
  .constant('BASE_URL', 'https://carebank.carewheels.org:8443')

  .run(function($ionicPlatform) {

//    window.localStorage['loginCredentials'] = null;

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

    user.login = function(uname, passwd, rmbr) {

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
        GroupInfo = response.data;
        $state.go('groupStatus')
      }, function(response) {
        //present login failed
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      })
    };

    return user;
  })

  //Notifications Component, as defined in design document. To be used to generate User Reminders and Red Alert tray notifications on Android.
  .controller("NotificationController", function($scope, $log, $cordovaLocalNotification){
      var isAndroid = window.cordova!=undefined;    //checks to see if cordova is available on this platform; platform() erroneously returns 'android' on Chrome Canary so it won't work
      function Time() {this.hours=0; this.minutes=0; this.seconds=0; this.on=true;};
      //window.localStorage['Reminders'] = null;    //Turning this on simulates starting from fresh storage every time controller is called by view change
      $scope.data = angular.fromJson(window.localStorage['Reminders']);   //needs to be called outside the functions so it persists for all of them

      //To be called during app startup after login; retrieves saved alert times (if they exist) or creates default alerts (if they don't) 
      //and calls Create_Notif for each of them
      $scope.Init_Notifs = function() {
        if($scope.data==null){   //have notifications been initialized before?
          $scope.data = [];    //data param needs to be initialized before indices can be added
          $scope.data[0] = new Time();
          alert($scope.data[0]);
          $scope.data[1] = new Time();
          $scope.data[2] = new Time();
          $scope.Create_Notif(10,0,0,1);  //these correspond to the pre-chosen default alarm times
          $scope.Create_Notif(14,0,0,2);
          $scope.Create_Notif(19,0,0,3);
        } else {    //need to check if each reminder, as any/all of them could be deleted by user
          if($scope.data[0]) $scope.Create_Notif($scope.data[0].hours,$scope.data[0].minutes,$scope.data[0].seconds,$scope.data[0].on,1);
          if($scope.data[1]) $scope.Create_Notif($scope.data[1].hours,$scope.data[1].minutes,$scope.data[1].seconds,$scope.data[0].on,2);
          if($scope.data[2]) $scope.Create_Notif($scope.data[2].hours,$scope.data[2].minutes,$scope.data[2].seconds,$scope.data[0].on,3);
        }
      }

      //Schedules a local notification and, if it is a reminder, saves a record of it to local storage. reminderNum must be <4
      //or it will log an error and schedule no notifications.
      $scope.Create_Notif = function(hours=0, minutes=0, seconds=0, on=true, reminderNum=0){
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
          $scope.data[reminderNum-1].on = on;
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
      $scope.Toggle_Off_Notif = function(id){   //NOTE: id corresponds to $scope.data array indices so it is off by one
        if(id==1||id==2||id==3){
          $scope.data[id].on = false;
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
        alert("In memory: \nReminder 1 " + $scope.data[0].hours + ":" + $scope.data[0].minutes + ":" + $scope.data[0].seconds +
          "\nReminder 2= " + $scope.data[1].hours + ":" + $scope.data[1].minutes + ":" + $scope.data[1].seconds +
          "\nReminder 3= " + $scope.data[2].hours + ":" + $scope.data[2].minutes + ":" + $scope.data[2].seconds);
        if(isAndroid){
          cordova.plugins.notification.local.get([1, 2, 3], function (notifications) {
            alert("Scheduled: " + notifications);
          });      
        } else $log.warn("Plugin disabled");
      }
    });
