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

app.controller("NotificationController", function($scope, $log){
  //   $scope.Init_Notifs = function() {
  //   Notif_File = something;
  //   if(Notif_File==null){
  //     $scope.notif1 = 10:00:00;
  //     $scope.notif2 = 14:00:00;
  //     $scope.notif3 = 19:00:00;
  //     //make Notif_File
  //     //save notifs to file
  //   } else {
  //     //set notifs to file values
  //   }
  //   Create_Notif(notif1, 1);
  //   Create_Notif(notif2, 2);
  //   Create_Notif(notif3, 3);
  // }

  // $scope.Create_Notif = function(time = new Date(),  reminderNum = 0, $log) {
  //   $log.warn("in Create_Notif ");
  //   if(reminderNum==0){
  //     $log.warn("made it to correct state");
  //     $cordovaLocalNotification.add({
  //       id: reminderNum,
  //       message: "There are red alert(s) on your CareWheel!",
  //       title: "CareWheels",
  //       autoCancel: true,
  //       sound: null
  //     }).then(function() {
  //       console.log("The notification has been set");
  //     });
  //   }
  //   else if(reminderNum <= 3){
  //     $cordovaLocalNotification.add({
  //       id: reminderNum,
  //       firstAt: time,
  //       every: "day",
  //       message: "Reminder " + reminderNum + ": Please check in with your CareWheel!",
  //       title: "CareWheels",
  //       autoCancel: true,
  //       sound: null
  //     }).then(function() {
  //       console.log("The notification has been set");
  //     });      
  //   } else {
  //     console.log("Attempted to create notification for id #" + remindNum);
  //   }
  //     $log.warn("in else");
  //   }
  // }

  // $scope.Delete_Notif = function(id){
  //   $cordovaLocalNotification.clear(id, function() {
  //       alert(id + " is done");
  //   });
  // }
  $scope.Create_Notif = function(hours=0, minutes=0, seconds=0, reminderNum=0){
    if(reminderNum==0){
      $log.warn("Controller called!" + reminderNum);
    } else if(reminderNum <4){
      var time = new Date();
      time.setHours(hours);
      time.setMinutes(minutes);
      time.setSeconds(seconds);
      $log.warn(time.toUTCString());
    } else {
      $log.warn("Attempted to create notification for id #" + reminderNum);
    }
  };
});