// Ionic Starter App


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

angular.module('careWheels', [
  'ionic',
  'ui.router',
  'ngCordova',
  'FredrikSandell.worker-pool',
  'angularMoment',
  'careWheels.fileloggermodule'
])


//contant definition for endpoint base url
.constant('BASE_URL', 'https://carewheels.cecs.pdx.edu:8443')

// change the version number here
.constant('VERSION_NUMBER', '0.03')

.run(function ($rootScope, $ionicPlatform, $ionicHistory, $state, $window, User) {

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

})

// API factory for making all php endpoints globally accessible.
.factory('API', function (BASE_URL) {
  var api = {
    userAndGroupInfo: BASE_URL + '/userandgroupmemberinfo.php',
    userInfo: BASE_URL + '/userinfo.php',
    updateUserReminders: BASE_URL + '/updateuserreminders.php',
    groupMemberInfo: BASE_URL + '/groupmemberinfo.php',
    updateLastOwnership: BASE_URL + '/updatelastownershiptakentime.php',
    creditUser: BASE_URL + '/credituser.php',
    updateSettings:BASE_URL + '/updatesettings.php'
  };
  return api;
})

<<<<<<< HEAD
// GroupInfo factory for global GroupInfo

.factory('GroupInfo', function () {
  var groupInfoService = {};
  var groupInfo = [];
  var memberSelected;
  var sensorError = false;

  groupInfoService.setSensorError = function(boolean){
    sensorError = boolean;
  };
  groupInfoService.getSensorError = function(){
    return sensorError;
  };

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

})

// User factory
.factory('User', function (GroupInfo, BASE_URL, $http, API, $state, $httpParamSerializerJQLike, $ionicPopup, $ionicLoading, $fileLogger, fileloggerService) {
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

      // do the log upload
      // console.log(uname + " - " + passwd);
      fileloggerService.initLogComponent();
      fileloggerService.logUpload(uname, passwd);
      console.log("Done upload log file!");

      GroupInfo.initGroupInfo(response.data);
      $ionicLoading.hide();   //make sure to hide loading screen
    }, function (response) {
      //present login failed
      $ionicLoading.hide();
      var errorMsg = "Unknown error.";

      //CHECKING TO FOR 404 ERRROR
      //response.status = 404;
      //response.data = "nothing";
      //
      console.log(response.status);
      console.log(response.data);


      if (failCount >= 3)
        errorMsg = "Exceeding invalid login attempts. Please Contact admin";
      else if (response.status == 400)
        errorMsg = "Please check your credentials!";
      else if (response.status == 401)
        errorMsg = "The entered username is incorrect.";
      else if (response.status == 404)
        errorMsg = "Unable to reach the server";
      else if (response.data === "Your access is blocked by exceeding invalid login attempts")
        errorMsg = "Account got blocked by exceeding invalid login attempts. Please contact admin";

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

    userService.getVacationValue = function () {

      var creds = userService.credentials();
      var currentUserObject = GroupInfo.getMember(creds.username);
      // console.log("currentUserobject is: " + currentUserObject);

      for(var i = 0; i < currentUserObject.customValues.length; i++) {

        if (currentUserObject.customValues[i].field.internalName == "onVacation") {
          // console.log("Found custom field onVacation!");
          //console.log("Setting value to: " + currentUserObject.customValues[i].booleanValue);
           return currentUserObject.customValues[i].booleanValue;
        }
      }

      return null;
    };

    userService.setVacationValue = function (newValue) {

      var creds = userService.credentials();
      var currentUserObject = GroupInfo.getMember(creds.username);

      // console.log("currentUserobject is: " + currentUserObject);

      for(var i = 0; i < currentUserObject.customValues.length; i++) {

        if (currentUserObject.customValues[i].field.internalName == "onVacation") {
          // console.log("Found custom field onVacation!");
          // console.log("Setting local value to: " + currentUserObject.customValues[i].booleanValue);
          currentUserObject.customValues[i].booleanValue = newValue;
          //console.log("Local value is now: " + currentUserObject.customValues[i].booleanValue);
        }
      }
    };

    userService.setOnVacation = function (uname, passwd, onVacationSetting) {
      $ionicLoading.show({      //pull up loading overlay so user knows App hasn't frozen
        template: '<ion-spinner></ion-spinner>' +
        '<p>Contacting Server...</p>'
      });

      return $http({
        url: API.updateSettings,
        method: 'POST',
        data: $httpParamSerializerJQLike({
          username: uname,
          password: passwd,
          usernametoupdate: uname,
          onvacation: onVacationSetting
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function (response) {
        console.log("Successfully updated vacation setting!");
        $ionicLoading.hide();   //make sure to hide loading screen
      })
    };
=======
>>>>>>> refs/remotes/origin/master

  .controller('menu', function ($scope, $state, VERSION_NUMBER) {
    $scope.versionNumber = VERSION_NUMBER;

    $scope.clickGroup = function () {
      $state.go('app.groupStatus');
    };

    $scope.clickReminders = function () {
      $state.go('app.reminders');
    };

    $scope.clickSettings = function () {
      $state.go('app.settings');
    };

    $scope.clickTests = function () {
      $state.go('app.tests');
    };



});

