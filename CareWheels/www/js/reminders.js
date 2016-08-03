/**
 * CareWheels - Reminders Controller
 * For Reminders component, as defined by Design Document. Used for Reminders view (reminders.html) to manage 3 User Reminders.
 * Each Reminder is held in live memory in $scope.reminders[], static memory via NotificationController.data[], in custom fields on the
 * Cyclos server, and in the Notifications Tray (handled by the Notifications component).
 */

angular.module('careWheels')

  .controller('remindersController', ['$scope', '$controller', '$ionicPopup', '$state', function($scope, $controller, $ionicPopup, $state, User){

    var notifViewModel = $scope.$new();   //to access Notifications functions
    var restViewModel = $scope.$new();    //to access Reminder REST controller

    $controller('NotificationController',{$scope : notifViewModel });
    $controller('ReminderRestController',{$scope : restViewModel });

    $scope.reminders = [    //array of live definitions; to be displayed to user
      {/* Reminder 0 */
        hour: notifViewModel.data[0].hours,
        min: notifViewModel.data[0].minutes, // leading zeros will automatically be added
        isPM: false,                          // make sure these two values match
        amOrPm: 'AM',                        // ng-change will update this value
        isOn: notifViewModel.data[0].on
      },
      {/* Reminder 1 */
        hour: notifViewModel.data[1].hours,
        min: notifViewModel.data[1].minutes,
        isPM: true,
        amOrPm: 'PM',
        isOn: notifViewModel.data[1].on

      },
      {/* Reminder 2 */
        hour: notifViewModel.data[2].hours,
        min: notifViewModel.data[2].minutes,
        isPM: true,
        amOrPm: 'PM',
        isOn: notifViewModel.data[2].on
      }
    ];

    for(i=0; i<3; ++i){   //need to convert each from military to conventional time
      if($scope.reminders[i].hour>12){
        $scope.reminders[i].hour -= 12;
        $scope.reminders[i].amOrPm = 'PM';
      }
    }


    /**
     *  the following two functions are for the toggles, they dynamically
     *  update the scope variables. by triggering by angular's 'ng-change'
     *  */
    $scope.toggleOnOff = function(index){
      $scope.reminders[index].isOn = $scope.reminders[index].isOn != false;
      console.log("Toggled: " + $scope.reminders[index].isOn); ////////////// testing
    };
    $scope.toggleAmPm = function(index){
      if ($scope.reminders[index].isPM == false) {
        $scope.reminders[index].isPM = false;
        $scope.reminders[index].amOrPm = 'AM';
      } else{
        $scope.reminders[index].isPM = true;
        $scope.reminders[index].amOrPm = 'PM';
      }
      console.log("Toggled: " + $scope.reminders[index].amOrPm); ////////////// testing
    };


    /**
     *  this function is used to one leading zero
     *  onto minutes that are less than 10
     * */
    $scope.padZero = function(input) {
      if (input < 10)
        return '0' + input;
      else
        return input
    };

    //creates a popup to verify user wants to reset to default Reminder times
    $scope.confirmReset = function() {
      var confirmPopup = $ionicPopup.confirm({
        title: 'Reset',
        template: 'Are you sure you want to reset all Reminders to their default times?'
      });

      confirmPopup.then(function(res) {
        if(res) {    //if yes button was pressed
          notifViewModel.Delete_Reminders();  //Delete old reminder files and
          notifViewModel.Init_Notifs();       //reset to default

          //Reset Cyclos custom fields to default
          var myUser = User.retrieveLocal();   //retrieve user credentials
          if(myUser!=undefined){
            var rem1 = notifViewModel.Reminder_As_String(0);
            var rem2 = notifViewModel.Reminder_As_String(1);
            var rem3 = notifViewModel.Reminder_As_String(2);

            restViewModel.fetch(myUser.username, myUser.password, myUser.username, rem1, rem2, rem3);   //will handle generating error if necessary
          } else console.error("Cannot contact server because user credentials are undefined.");
          $state.go($state.current, {}, {reload: true});    //reset view so changes are immediately visible
        } else {
          console.log('Reset canceled!');
        }
      });
    };

    //Push live Reminder values to all other locations
    $scope.saveReminders = function() {
      //update Notification component's memory and local reminder times
      for(var i=0; i<3; ++i){
        var myHours = $scope.reminders[i].hour;
        if($scope.reminders[i].amOrPm == 'PM') myHours = parseInt(myHours)+12;    //convert to military time
        notifViewModel.Create_Notif(myHours, $scope.reminders[i].min, 0, $scope.reminders[i].isOn, i+1);    //this creates Tray notification and also updates Notification file
        console.log(myHours + ":" + $scope.reminders[i].min + ":" + 0 + " " + $scope.reminders[i].isOn + i);
      }
      var myUser = User.retrieveLocal();   //retrieve user credentials
      if(myUser!=undefined){    //do we have user credentials?
        //update Cyclos server's reminder fields
        if($scope.reminders[0].isOn){
          var rem1 = notifViewModel.Reminder_As_String(0);
        } else rem1 = '';
        if($scope.reminders[1].isOn){
          var rem2 = notifViewModel.Reminder_As_String(1);
        } else rem2 = '';
        if($scope.reminders[2].isOn){
          var rem3 = notifViewModel.Reminder_As_String(2);
        } else rem3 = '';

        console.log("rem1="+rem1+" rem2="+rem2+" rem3="+rem3);
        restViewModel.fetch(myUser.username, myUser.password, myUser.username, rem1, rem2, rem3);
      } else console.warn("Cannot contact server because user credentials are undefined.");
    }
  }])

  //Notifications Component, as defined in design document. To be used to generate User Reminders and Red Alert tray notifications on Android.
  .controller("NotificationController", function($scope, $log, $cordovaLocalNotification){

    var isAndroid = window.cordova!=undefined;    //checks to see if cordova is available on this platform; platform() erroneously returns 'android' on Chrome Canary so it won't work
    function Time() {this.hours=0; this.minutes=0; this.seconds=0; this.on=true;};
    //window.localStorage['Reminders'] = null;    //Turning this on simulates starting from fresh storage every time controller is called by view change
    $scope.data = angular.fromJson(window.localStorage['Reminders']);   //needs to be called outside the functions so it persists for all of them

    //To be called during app startup after login; retrieves saved alert times (if they exist) or creates default alerts (if they don't)
    //and calls Create_Notif for each of them
    $scope.Init_Notifs = function() {
      //$scope.data = angular.fromJson(window.localStorage['Reminders']);
      if($scope.data==null){   //have notifications been initialized before?
        $log.log("Initializing Notifications from default");
        $scope.data = [];    //data param needs to be initialized before indices can be added
        $scope.data[0] = new Time();
        $scope.data[1] = new Time();
        $scope.data[2] = new Time();
        $scope.Create_Notif(10,0,0,true,1);  //these correspond to the pre-chosen default alarm times
        $scope.Create_Notif(14,0,0,true,2);
        $scope.Create_Notif(19,0,0,true,3);
      } else {    //need to check if each reminder, as any/all of them could be deleted by user
        $log.log("Initializing Notifications from memory");
        if($scope.data[0]) $scope.Create_Notif($scope.data[0].hours,$scope.data[0].minutes,$scope.data[0].seconds,$scope.data[0].on,1);
        if($scope.data[1]) $scope.Create_Notif($scope.data[1].hours,$scope.data[1].minutes,$scope.data[1].seconds,$scope.data[1].on,2);
        if($scope.data[2]) $scope.Create_Notif($scope.data[2].hours,$scope.data[2].minutes,$scope.data[2].seconds,$scope.data[2].on,3);
      }
    }

    //Schedules a local notification and, if it is a reminder, saves a record of it to local storage. reminderNum must be <4
    //or it will log an error and schedule no notifications.
    $scope.Create_Notif = function(hours, minutes, seconds, isOn, reminderNum){
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
      } if(reminderNum>0 && reminderNum <4){    //is notif a user reminder?
        var time = new Date($scope.data[0].hours + ":" + $scope.data[0].minutes);    //defaults to current date/time
        time.setHours(hours);     //update
        $scope.data[reminderNum-1].hours = hours;
        time.setMinutes(minutes);
        $scope.data[reminderNum-1].minutes = minutes;
        time.setSeconds(seconds);
        $scope.data[reminderNum-1].seconds = seconds;
        $scope.data[reminderNum-1].on = isOn;
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
      } else if(reminderNum >=4) $log.warn("Incorrect attempt to create notification for id #" + reminderNum);
    };

    //Unschedules all local reminders; clears its index if it is a user reminder (id 1-3).
    $scope.Delete_Reminders = function(){   //NOTE: id corresponds to $scope.data array indices so it is off by one
                                            //$scope.data = angular.fromJson(window.localStorage['Reminders']);
      if(isAndroid){
        for(i=1; i<4; ++i){
          $cordovaLocalNotification.clear(i, function() {
            $log.log(i + " is cleared");
          });
        }
      } else $log.warn("Plugin disabled");

      window.localStorage['Reminders'] = null;   //and delete Reminders array
      $scope.data = null;
    }

    //Unschedules a local notification as per Delete_Notif but does NOT clear storage or data index; to be used by User Reminder's Toggle()
    $scope.Toggle_Off_Notif = function(id){
      $scope.data = angular.fromJson(window.localStorage['Reminders']);
      if(id==1||id==2||id==3){
        $scope.data[id-1].on = false;
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
      //$scope.data = angular.fromJson(window.localStorage['Reminders']);
      alert("In memory: \nReminder 1= (" +$scope.data[0].on +") "+ $scope.data[0].hours + ":" + $scope.data[0].minutes + ":" + $scope.data[0].seconds +
        "\nReminder 2= (" +$scope.data[0].on +") "+ $scope.data[1].hours + ":" + $scope.data[1].minutes + ":" + $scope.data[1].seconds +
        "\nReminder 3= (" +$scope.data[0].on +") "+ $scope.data[2].hours + ":" + $scope.data[2].minutes + ":" + $scope.data[2].seconds);
      if(isAndroid){
        cordova.plugins.notification.local.get([1, 2, 3], function (notifications) {
          alert("Scheduled: " + notifications);
        });
      } else $log.warn("Plugin disabled");
    }

    //returns a reminder (id # = 0,1, or 2) as a string in the format HH:MM:SS
    $scope.Reminder_As_String = function(id){
      if(id>2){
        $log.error("Attempted to print Reminder id " + id + ", but there are only 3 reminders!");
      } else {
        var hour = $scope.data[id].hours;
        if(hour<10) hour = 0 + String(hour);
        var minute = $scope.data[id].minutes;
        if(minute<10) minute = 0 + String(minute);
        //var second = $scope.data[id].minutes;   //seconds can only be 00 currently
        //if(second<10) second = 0 + String(second);
        return hour + ":" + minute + ":00"; //+ second;
      }
    }
  });
