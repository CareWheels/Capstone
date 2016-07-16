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
  function Time() {this.hours=0; this.minutes=0; this.seconds=0;};
  $scope.data = angular.fromJson(window.localStorage['Reminders']);
  $scope.Init_Notifs = function() {
    if(!$scope.data){
      $scope.data;
      $scope.data[0] = new Time();
      $scope.data[1] = new Time();
      $scope.data[2] = new Time();
      $scope.Create_Notif(10,0,0,1);
      $scope.Create_Notif(14,0,0,2);
      $scope.Create_Notif(19,0,0,3);
    } else {
      if($scope.data[0]) $scope.Create_Notif($scope.data[0].hours,$scope.data[0].minutes,$scope.data[0].seconds,1);
      if($scope.data[1]) $scope.Create_Notif($scope.data[1].hours,$scope.data[1].minutes,$scope.data[1].seconds,2);
      if($scope.data[2]) $scope.Create_Notif($scope.data[2].hours,$scope.data[2].minutes,$scope.data[2].seconds,3);
    }
    $log.warn($scope.data[0]);
  }

  $scope.Create_Notif = function(hours=0, minutes=0, seconds=0, reminderNum=0){
    if(reminderNum==0){
      $cordovaLocalNotification.schedule({
        id: reminderNum,
        message: "There are red alert(s) on your CareWheel!",
        title: "CareWheels",
        sound: null
      }).then(function() {
        $log.warn("Alert notification has been set");
      });
    } else if(reminderNum <4){
      var time = new Date();
      time.setHours(hours);
      $scope.data[reminderNum-1].hours = hours;
      time.setMinutes(minutes);
      $scope.data[reminderNum-1].minutes = minutes;
      time.setSeconds(seconds);
      $scope.data[reminderNum-1].seconds = seconds;
      window.localStorage['Reminders'] = angular.toJson($scope.data);

      $cordovaLocalNotification.schedule({
        id: reminderNum,
        firstAt: time,
        every: "day",
        message: "Reminder " + reminderNum + ": Please check in with your CareWheel!",
        title: "CareWheels",
        sound: null
      }).then(function() {
        $log.warn("Notification" + reminderNum + "has been set to " + time.getUTCTime());
      });    
    } else {
      $log.warn("Incorrect attempt to create notification for id #" + reminderNum);
    }
  };

  $scope.Delete_Notif = function(id){
    $cordovaLocalNotification.clear(id, function() {
        $log.warn(id + " is deleted");
    });
    $scope.data[id] = null;
  }
});
