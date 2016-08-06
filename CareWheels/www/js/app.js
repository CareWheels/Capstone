// Ionic Starter App


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('careWheels', [
  'ionic',
  'ui.router',
  'ngCordova',
  'FredrikSandell.worker-pool',
  'angularMoment'
])


  //contant definition for endpoint base url
  app.constant('BASE_URL', 'https://carebank.carewheels.org:8443')

  app.run(function($ionicPlatform, $ionicHistory, $state) {

//    window.localStorage['loginCredentials'] = null;


    $ionicPlatform.registerBackButtonAction(function(event) {
      console.log("in registerbackbutton");
      $state.go($ionicHistory.backTitle());
    }, 100);

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
  app.factory('API', function(BASE_URL) {
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

  app.factory('GroupInfo', function() {
    var groupInfoService = {};
    //var currentGroup = [];
    //var analyzedGroup = [];
    var groupInfo = [];

    groupInfoService.initGroupInfo = function(data) {
      groupInfo = data;
    };

    //this function is used at the end of sensorDataDownload
    //and adds each group member object to the currentGroup array after sensorData is added to it

    //TRY
    //have 'update' return only the sensorData, then have this function attach that sensorData
    //to the corresponding group member object

    groupInfoService.addSensorDataToGroup = function(id) {
      groupInfo.push(id);
    };

    //this function is used at the end of sensorDataAnalysis
    //and adds each group member object to the analyzedGroup array after analysisData is added to it
    groupInfoService.addAnalysisToGroup = function(member){
      groupInfo.push(member);
    };

    groupInfoService.groupInfo = function() {
      return groupInfo;
    };

    //called at the beginning of sensorDataAnalysis
    //will return the currentGroup array
    //after sensor data download is completed, currentGroup will contain all 5 group members, each with
    //sensorData objects attached to them
    //groupInfoService.retrieveGroupAfterDownload = function(){
    //  return currentGroup;
    //};

    //called by group member summary (and maybe ind. summary)
    //will return the analyzedGroup array
    //after sensor data analysis is completed, analyzedGroup will contain all 5 group members, each with
    //sensorAnalysis objects attached to them
    //groupInfoService.retrieveAnalyzedGroup = function(){
    //  return analyzedGroup;
    //};

    return groupInfoService;

  })

  // User factory

  app.factory('User', function(GroupInfo, BASE_URL, $http, API, $state, $httpParamSerializerJQLike, $ionicPopup, $ionicLoading) {
    var user = {};
    var userService = {};
    //window.localStorage['loginCredentials'] = null;

    userService.login = function(uname, passwd, rmbr, callback) {
      $ionicLoading.show({      //pull up loading overlay so user knows App hasn't frozen
        template: '<ion-spinner></ion-spinner>'+
                  '<p>Contacting Server...</p>'
      });

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

        user = {username:uname, password:passwd};

        GroupInfo.initGroupInfo(response.data);
        $ionicLoading.hide();   //make sure to hide loading screen
        callback();
      }, function(response) {
        //present login failed
        $ionicLoading.hide();
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      })
    };
    
    userService.credentials = function() {
      return user;
    };

    return userService;
  });