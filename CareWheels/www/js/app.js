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

app.controller("NotificationController", function($scope, $log, $cordovaLocalNotification){
  //   $scope.Init_Notifs = function() {
  //   Notif_File = something;
  //   if(Notif_File==null){
  //     Create_Notif(10, 0, 0, 1);
  //     Create_Notif(14, 0, 0, 2);
  //     Create_Notif(19, 0, 0, 3);
  //     //make Notif_File
  //     //save notifs to file
  //   } else {
  //     //set notifs to file values
  //   }
  // }

  $scope.Create_Notif = function(hours=0, minutes=0, seconds=0, reminderNum=0){
    $log.warn("Successfully called");
    if(reminderNum==0){
      $cordovaLocalNotification.add({
        id: reminderNum,
        message: "There are red alert(s) on your CareWheel!",
        title: "CareWheels",
        autoCancel: true,
        sound: null
      }).then(function() {
        $log.warn("Alert notification has been set");
      });
    } else if(reminderNum <4){
      var time = new Date();
      time.setHours(hours);
      time.setMinutes(minutes);
      time.setSeconds(seconds);

      $cordovaLocalNotification.add({
        id: reminderNum,
        firstAt: time,
        every: "day",
        message: "Reminder " + reminderNum + ": Please check in with your CareWheel!",
        title: "CareWheels",
        autoCancel: true,
        sound: null
      }).then(function() {
        $log.warn("Notification" + reminderNum + "has been set to " + time.getUTCTime());
      });    
    } else {
      $log.warn("Attempted to create notification for id #" + reminderNum);
    }
  };

  // $scope.Delete_Notif = function(id){
  //   $cordovaLocalNotification.clear(id, function() {
  //       $log.warn(id + " is done");
  //   });
  // }
});