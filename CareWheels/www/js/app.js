// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
var app = angular.module('careWheels', ['ionic', 'ngCordova'])

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

//Notifications Component, as defined in design document. To be used to generate User Reminders and Red Alert tray notifications on Android.
app.controller("NotificationController", function($scope, $log, $cordovaLocalNotification){
  var isAndroid = window.cordova!=undefined;    //checks to see if cordova is available on this platform; platform() erroneously returns 'android' on Chrome Canary so it won't work
  function Time() {this.hours=0; this.minutes=0; this.seconds=0; this.on=true;};
  $scope.data = angular.fromJson(window.localStorage['Reminders']);   //needs to be called outside the functions so it persists for all of them

  //To be called during app startup after login; retrieves saved alert times (if they exist) or creates default alerts (if they don't) 
  //and calls Create_Notif for each of them
  $scope.Init_Notifs = function() {
    if(!$scope.data){   //have notifications been initialized before?
      $scope.data;    //data param needs to be initialized before indices can be added
      $scope.data[0] = new Time();
      $scope.data[1] = new Time();
      $scope.data[2] = new Time();
      $scope.Create_Notif(10,0,0,1);  //these correspond to the pre-chosen default alarm times
      $scope.Create_Notif(14,0,0,2);
      $scope.Create_Notif(19,0,0,3);
    } else {    //need to check if each reminder, as any/all of them could be deleted by user
      if($scope.data[0]) $scope.Create_Notif($scope.data[0].hours,$scope.data[0].minutes,$scope.data[0].seconds,1);
      if($scope.data[1]) $scope.Create_Notif($scope.data[1].hours,$scope.data[1].minutes,$scope.data[1].seconds,2);
      if($scope.data[2]) $scope.Create_Notif($scope.data[2].hours,$scope.data[2].minutes,$scope.data[2].seconds,3);
    }
    $log.log("Notifications initialized");
  }

  //Schedules a local notification and, if it is a reminder, saves a record of it to local storage. reminderNum must be <4
  //or it will log an error and schedule no notifications.
  $scope.Create_Notif = function(hours=0, minutes=0, seconds=0, reminderNum=0){
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
      $scope.data[reminderNum-1].on = true;
      window.localStorage['Reminders'] = angular.toJson($scope.data);   //save $scope.data so new reminder is remembered

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
  $scope.Delete_Notif = function(id){
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
  $scope.Toggle_Off_Notif = function(id){
    if(id==1||id==2||id==3) $scope.data[id].on = false;
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
