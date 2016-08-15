// Ionic Starter App


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('careWheels', [
  'ionic',
  'ui.router',
  'ngCordova',
  'FredrikSandell.worker-pool',
  'angularMoment',
  'fileloggermodule'
]);


//contant definition for endpoint base url
app.constant('BASE_URL', 'https://carewheels.cecs.pdx.edu:8443');

app.run(function ($rootScope, $ionicPlatform, $ionicHistory, $state, User) {

//    window.localStorage['loginCredentials'] = null;

  $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
    console.log('state change');
    if (User.credentials() === null) {
      if (next.name !== 'login') {
        event.preventDefault();
        $state.go('login');
      }
    }
  });


  $ionicPlatform.registerBackButtonAction(function (event) {
    console.log("in registerbackbutton");
    console.log($ionicHistory.backTitle());
    $state.go($ionicHistory.backTitle());
  }, 100);

  $ionicPlatform.ready(function () {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

});

// API factory for making all php endpoints globally accessible.
app.factory('API', function (BASE_URL) {
  var api = {
    userAndGroupInfo: BASE_URL + '/userandgroupmemberinfo.php',
    userInfo: BASE_URL + '/userinfo.php',
    updateUserReminders: BASE_URL + '/updateuserreminders.php',
    groupMemberInfo: BASE_URL + '/groupmemberinfo.php',
    updateLastOwnership: BASE_URL + '/updatelastownershiptakentime.php',
    dailyTrxHist: BASE_URL + '/dailytransactionhistory.php',
    creditUser: BASE_URL + '/credituser.php'
  };
  return api;
});

// GroupInfo factory for global GroupInfo

app.factory('GroupInfo', function () {
  var groupInfoService = {};
  var groupInfo = [];
  var memberSelected;

  groupInfoService.initGroupInfo = function (data) {
    return groupInfo = data;
  };

  //this function is used at the end of Data Download and Data Analysis
  //it will replace each group members position in the groupInfo array with a newly updated member containing
  //a sensorData object (after Data Download), or a sensorAnalysis object (after Data Analysis)
  groupInfoService.addDataToGroup = function (member, index) {
    groupInfo[index] = member;
  };

  //this function will return the current contents of groupinfo.
  //will be called at the beginning of Data Download, Data Analysis, and group / ind. member summary
  groupInfoService.groupInfo = function () {
    return groupInfo;
  };

  groupInfoService.getMember_new = function () {
    return groupInfo[memberSelected];
  };

  groupInfoService.setMember_new = function (Username) {
    for (var i = 0; i < groupInfo.length; i++) {
      if (groupInfo[i].username == Username)
        memberSelected = i;
    }
    return true;
  };


  groupInfoService.getMember = function (Username) {       // Returns the groupInfo member array index object that contains the same username as the username parameter.
    for (i = 0; i < 5; ++i) {
      if (groupInfo[i].username == Username) {
        console.log("Found " + Username + "==" + groupInfo[i].username);
        return groupInfo[i];
      }

    }

    console.error("In getMember(): Could not find username " + Username);
  };

  groupInfoService.setMember = function (Username, groupInfoMember) {     // Sets the groupInfo array index that contains the same username as the username parameter to the value of the groupInfoMember paramemter.
    for (i = 0; i < 5; ++i) {
      if (groupInfo[i].username == Username) {
        console.log("Found " + Username + "==" + groupInfo[i].username);
        groupInfo[i] = groupInfoMember;
        return true;
      }

    }

    console.error("In setMember(): Could not find username " + Username);
    return false;
  };

  return groupInfoService;

});

// User factory

app.factory('User', function (GroupInfo, BASE_URL, $http, API, $state, $httpParamSerializerJQLike, $ionicPopup, $ionicLoading) {
  console.log('hit User factory');
  var user = {};
  var userService = {};
  var failCount = 0;
  //window.localStorage['loginCredentials'] = null;

  userService.login = function (uname, passwd, rmbr) {
    $ionicLoading.show({      //pull up loading overlay so user knows App hasn't frozen
      template: '<ion-spinner></ion-spinner>' +
      '<p>Contacting Server...</p>'
    });

    return $http({
      url: API.userAndGroupInfo,
      method: 'POST',
      data: $httpParamSerializerJQLike({
        username: uname,
        password: passwd,
        usernametofind: uname
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response) {
      if (rmbr)
        window.localStorage['loginCredentials'] = angular.toJson({"username": uname, "password": passwd});
      //store user info
      //store groupMember info

      user = {username: uname, password: passwd};

      GroupInfo.initGroupInfo(response.data);
      $ionicLoading.hide();   //make sure to hide loading screen
    }, function (response) {
      //present login failed
      $ionicLoading.hide();
      var errorMsg = "Unknown error.";

      //CHECKING TO FOR 404 ERRROR
      //response.status = 404;
      //response.data = "nothing";
      //console.log(response.data);
      //

      if (failCount >= 3)
        errorMsg = "Exceeding invalid login attempts. Please Contact admin";
      else if (response.data === "Missing username / password" || response.data === "Invalid username / password")
        errorMsg = "Please check your credentials!";
      else if (response.data === "Your access is blocked by exceeding invalid login attempts")
        errorMsg = "Account got blocked by exceeding invalid login attempts. Please contact admin";
      else if (response.status == 404)
        errorMsg = "Unable to reach the server";

      failCount++;
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errorMsg
      });
    })
  };

  userService.credentials = function () {
    if (!user.username)
      return null;
    return user;
  };

  return userService;
});

app.controller('menu', function ($scope, $state) {

  $scope.clickGroup = function () {
    $state.go('app.groupStatus');
  };

  $scope.clickReminders = function () {
    $state.go('app.reminders');
  };

  $scope.clickTests = function () {
    $state.go('app.tests');
  }
});








//Notifications Component, as defined in design document. To be used to generate User Reminders and Red Alert tray notifications on Android.
app.factory("notifications", function($log, $cordovaLocalNotification){
  console.log('hit notification factory');//////////////////////ttesting
  var isAndroid = window.cordova!=undefined;    //checks to see if cordova is available on this platform; platform() erroneously returns 'android' on Chrome Canary so it won't work
  var data;   //needs to be called outside the functions so it persists for all of them

  var notifications = {};


  notifications.getData = function(){
    console.log('hit getData');
    //data = angular.fromJson(window.localStorage['Reminders']);
    console.log('data:', data);
    return angular.fromJson(window.localStorage['Reminders']);
  };

  notifications.Time = function() {
    this.hours=0; this.minutes=0; this.seconds=0; this.on=true;
  };

  //To be called during app startup after login; retrieves saved alert times (if they exist) or creates default alerts (if they don't)
  //and calls Create_Notif for each of them
  notifications.Init_Notifs = function() {

    console.log('init notifs');

    data = angular.fromJson(window.localStorage['Reminders']);
    console.log(data);
    if(data==null){   //have notifications been initialized before?
      console.log("Initializing Notifications from default");
      data = [];    //data param needs to be initialized before indices can be added
      data[0] = new notifications.Time();
      data[1] = new notifications.Time();
      data[2] = new notifications.Time();
      notifications.Create_Notif(10,0,0,true,1);  //these correspond to the pre-chosen default alarm times
      notifications.Create_Notif(14,0,0,true,2);
      notifications.Create_Notif(19,0,0,true,3);
    } else {    //need to check if each reminder, as any/all of them could be deleted by user
      console.log("Initializing Notifications from memory");
      notifications.Create_Notif(data[0].hours,data[0].minutes,data[0].seconds,data[0].on,1);
      notifications.Create_Notif(data[1].hours,data[1].minutes,data[1].seconds,data[1].on,2);
      notifications.Create_Notif(data[2].hours,data[2].minutes,data[2].seconds,data[2].on,3);
    }
  };

  //Schedules a local notification and, if it is a reminder, saves a record of it to local storage. reminderNum must be <4
  //or it will log an error and schedule no notifications.
  notifications.Create_Notif = function(hours, minutes, seconds, isOn, reminderNum){
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
      var time = new Date();    //defaults to current date/time
      time.setHours(hours);     //update
      data[reminderNum-1].hours = hours;
      time.setMinutes(minutes);
      data[reminderNum-1].minutes = minutes;
      time.setSeconds(seconds);
      data[reminderNum-1].seconds = seconds;
      data[reminderNum-1].on = isOn;
      window.localStorage['Reminders'] = angular.toJson(data);   //save data so new reminder is stored
      if(isOn){
        if(isAndroid){
              $cordovaLocalNotification.schedule({
                id: reminderNum,
                at: time,
                every: "day",
                text: "Reminder " + reminderNum + ": Please check in with your CareWheel!",
                title: "CareWheels",
                sound: null   //same, hopefully a different sound than red alerts
              }).then(function() {
                $log.log("Notification" + reminderNum + "has been scheduled for " + time.toTimeString() + ", daily");
              });
          } else console.warn("Plugin disabled");
        } else {    //need to deschedule notification if it has been turned off
          if(isAndroid){
            $cordovaLocalNotification.cancel(reminderNum, function() {
              console.log("Reminder" + reminderNum + " has been descheduled.");
            });
          }
        }
    } else if(reminderNum >=4) $log.warn("Incorrect attempt to create notification for id #" + reminderNum);
  };

  //Unschedules all local reminders; clears its index if it is a user reminder (id 1-3).
  notifications.Delete_Reminders = function(){   //NOTE: id corresponds to data array indices so it is off by one
    //data = angular.fromJson(window.localStorage['Reminders']);
    console.log('hit delete reminders');
    if(isAndroid){
      for(i=1; i<4; ++i){
        $cordovaLocalNotification.clear(i, function() {
          console.log(i + " is cleared");
        });
      }
    } else console.warn("Plugin disabled");

    window.localStorage['Reminders'] = null;   //and delete Reminders array
    data = null;
  };

  //Unschedules a local notification as per Delete_Notif but does NOT clear storage or data index; to be used by User Reminder's Toggle()
  notifications.Toggle_Off_Notif = function(id){
    data = angular.fromJson(window.localStorage['Reminders']);
    if(id==1||id==2||id==3){
      data[id-1].on = false;
      window.localStorage['Reminders'] = angular.toJson(data);   //and save data so toggle is remembered
    }
    if(isAndroid){
      $cordovaLocalNotification.clear(id, function() {
        $log.log(id + " is cleared");
      });
    } else $log.warn("Plugin disabled");
  };

  //prints the in-memory and scheduled status of Reminders, for testing purposes
  notifications.Notifs_Status = function(){
    //data = angular.fromJson(window.localStorage['Reminders']);
    alert("In memory: \nReminder 1= (" +data[0].on +") "+ data[0].hours + ":" + data[0].minutes + ":" + data[0].seconds +
      "\nReminder 2= (" +data[0].on +") "+ data[1].hours + ":" + data[1].minutes + ":" + data[1].seconds +
      "\nReminder 3= (" +data[0].on +") "+ data[2].hours + ":" + data[2].minutes + ":" + data[2].seconds);
    if(isAndroid){
      cordova.plugins.notification.local.get([1, 2, 3], function (notifications) {
        alert("Scheduled: " + notifications);
      });
    } else $log.warn("Plugin disabled");
  };

  /**
   * returns a reminder (id # = 0,1, or 2) as a string in the format HH:MM:SS
   * @return {string}
   */
  notifications.Reminder_As_String = function(id){
    if(id>2){
      $log.error("Attempted to print Reminder id " + id + ", but there are only 3 reminders!");
    } else {
      var hour = data[id].hours;
      if(hour<10) hour = 0 + String(hour);
      var minute = data[id].minutes;
      if(minute<10) minute = 0 + String(minute);
      //var second = data[id].minutes;   //seconds can only be 00 currently
      //if(second<10) second = 0 + String(second);
      return hour + ":" + minute + ":00"; //+ second;
    }

  };

  return notifications;
});

/**
   Parameters
   username: username for login.
   password: password for login.
   usernametocredit: username of the user to credit.
   usernametodebt: username of the user to debt, only needed for a transaction
                   between two users.
   credits as float: Number of credits to credit the user.
   alertlevel as string: Any string to record the alert level of the monitored member,
                         such as "Blue", "Yellow", or "Red".
   callpayment a boolean as String: Records whether or not the crediting is occuring due to
                         a call to a group member. Must be "True" or "False"!
   sensordataviewpayment a boolean as String: Records whether or not the crediting is occuring due to
                         a detailed sensor screen viewing or not. Must be "True" or "False"!
   membersummarypayment a boolean as String: Records whether or not the crediting is occuring due to
                                             a member summary screen viewing or not. Must be "True"
                                             or "False"!
*/
app.factory("PaymentService", function($http, $httpParamSerializerJQLike, User, API){
  console.log("Hit PaymentService factory");

  var PaymentService = {};


  PaymentService.call = function(userToDebtAsString, creditsAsFloat, alertlevelAsString) {
    var myUser = User.credentials();
    console.log(myUser);
    if (myUser != undefined) {
      var status = null;
      var response = null;
      $http({
        url: API.creditUser,
        method: 'POST',    //all our custom REST endpoints have been designed to use POST
        data: $httpParamSerializerJQLike({    //serialize the parameters in the way PHP expects
          username: myUser.username,
          password: myUser.password,
          usernametodebt: userToDebtAsString,
          usernametocredit: myUser.username,
          credits: creditsAsFloat,
          alertlevel: alertlevelAsString,
          callpayment: 'True',
          sensordataviewpayment: 'False',
          membersummarypayment: 'False'
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'   //make Angular use the same content-type header as PHP
        }
      }).then(function (response) {    //the old $http success/error methods have been depricated; this is the new format
        status = response.status;
        data = response.data;
        console.log('Rest Status = ' + status);
      }, function (response) {
        var data = response.data || "Request failed";
        status = response.status;
        if (response.status != 200) {
          console.error(data);
        } else console.log('Success: ' + data);
      })
    } else console.error("Cannot make REST call for Call  Payment because user credentials are undefined.");
  };

  PaymentService.sensorDataView = function(creditsAsFloat, alertlevelAsString) {
    var myUser = User.credentials();
    if (myUser != undefined) {
      var status = null;
      var response = null;
      $http({
        url: API.creditUser,
        method: 'POST',    //all our custom REST endpoints have been designed to use POST
        data: $httpParamSerializerJQLike({    //serialize the parameters in the way PHP expects
          username: myUser.username,
          password: myUser.password,
          usernametodebt: '',
          usernametocredit: myUser.username,
          credits: creditsAsFloat,
          alertlevel: alertlevelAsString,
          callpayment: 'False',
          sensordataviewpayment: 'True',
          membersummarypayment: 'False'
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'   //make Angular use the same content-type header as PHP
        }
      }).then(function (response) {    //the old $http success/error methods have been depricated; this is the new format
        status = response.status;
        data = response.data;
        console.log('Rest Status = ' + status);
      }, function (response) {
        var data = response.data || "Request failed";
        status = response.status;
        if (response.status != 200) {
          console.error(data);
        } else console.log('Success: ' + data);
      })
    } else console.error("Cannot make REST call for sensorDataView Payment because user credentials are undefined.");
  };

  PaymentService.memberSummary = function(creditsAsFloat) {
    var myUser = User.credentials();
    if (myUser != undefined) {
      var status = null;
      var response = null;
      $http({
        url: API.creditUser,
        method: 'POST',    //all our custom REST endpoints have been designed to use POST
        data: $httpParamSerializerJQLike({    //serialize the parameters in the way PHP expects
          username: myUser.username,
          password: myUser.password,
          usernametodebt: '',
          usernametocredit: myUser.username,
          credits: creditsAsFloat,
          alertlevel: 'na',
          callpayment: 'False',
          sensordataviewpayment: 'False',
          membersummarypayment: 'True'
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'   //make Angular use the same content-type header as PHP
        }
      }).then(function (response) {    //the old $http success/error methods have been depricated; this is the new format
        status = response.status;
        data = response.data;
        console.log('Rest Status = ' + status);
      }, function (response) {
        var data = response.data || "Request failed";
        status = response.status;
        if (response.status != 200) {
          console.error(data);
        } else console.log('Success: ' + data);
      })
    } else console.error("Cannot make REST call for memberSummary Payment because user credentials are undefined.");
  };
  return PaymentService;
});
