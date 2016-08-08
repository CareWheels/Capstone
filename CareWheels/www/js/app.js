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
  'fileloggermodule'
])


  //contant definition for endpoint base url
  .constant('BASE_URL', 'https://carebank.carewheels.org:8443')

  .run(function($rootScope, $ionicPlatform, $ionicHistory, $state, User) {

//    window.localStorage['loginCredentials'] = null;

    $rootScope.$on('$stateChangeStart', function (event, next, nextParams, fromState) {
      console.log('state change');
      if (User.credentials() === null) {
        if (next.name !== 'login') {
          event.preventDefault();
          $state.go('login');
        }
      }
    })


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
    var groupInfoService = {};
    var currentGroup = [];
    var analyzedGroup = [];
    var groupInfo = [];

    groupInfoService.initGroupInfo = function(data) {
      return groupInfo = data;
    };

    groupInfoService.addSensorDataToGroup = function(id) {//this will add each individual group member into the currentGroup array. Their carebank data will have been added within the DataDownload function
      currentGroup.push(id);
    };

    groupInfoService.addAnalysisToGroup = function(member){
      analyzedGroup.push(member);
    };

    groupInfoService.groupInfo = function() {
      return groupInfo;
    };

    groupInfoService.retrieveGroupAfterDownload = function(){//currentGroup will contain all 5 groupmembers (with carebank data and sense data)
      return currentGroup;
    };

    groupInfoService.retrieveAnalyzedGroup = function(){
      return analyzedGroup;
    };

    return groupInfoService;

  })

  // User factory

  .factory('User', function(GroupInfo, BASE_URL, $http, API, $state, $httpParamSerializerJQLike, $ionicPopup, $ionicLoading) {
    var user = {};
    var userService = {};
    //window.localStorage['loginCredentials'] = null;

    userService.login = function(uname, passwd, rmbr) {
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
      }, function(response) {
        //present login failed
        $ionicLoading.hide();
        var errorMsg = "Unknown error.";
        
          //CHECKING TO FOR 404 ERRROR    
          //response.status = 404;        
          //response.data = "nothing";    
          //console.log(response.data);   
          //
          
        if(response.data === "Missing username / password" || response.data === "Invalid username / password")
          errorMsg = "Please check your credentials!";
        else if(response.data === "Your access is blocked by exceeding invalid login attempts")
          errorMsg = "Account got blocked by exceeding invalid login attempts. Please contact admin";
        else if(response.status == 404) 
          errorMsg = "Unable to reach the server"; 

        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: errorMsg
        });
      })
    };
    
    userService.credentials = function() {
      if (!user.username)
        return null;
      return user;
    };

    return userService;
  });