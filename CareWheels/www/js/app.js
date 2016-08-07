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

  .run(function($ionicPlatform, $ionicHistory, $state) {

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
    var groupInfo = [];

    groupInfoService.initGroupInfo = function(data) {
      groupInfo = data;
    };

    //this function is used at the end of Data Download and Data Analysis
    //it will replace each group members position in the groupInfo array with a newly updated member containing 
    //a sensorData object (after Data Download), or a sensorAnalysis object (after Data Analysis)
    groupInfoService.addDataToGroup = function(member, index) {
      groupInfo[index] = member;
    };

    //this function will return the current contents of groupinfo.
    //will be called at the beginning of Data Download, Data Analysis, and group / ind. member summary
    groupInfoService.groupInfo = function() {
      return groupInfo;
    };

    groupInfoService.getMember = function(Username){       // Returns the groupInfo member array index object that contains the same username as the username parameter.
      for(i=0; i<5; ++i){
        if(groupInfo[i].username==Username){
          console.log("Found " + Username + "==" + groupInfo[i].username);
          return groupInfo[i];
        };
      };
      console.error("In getMember(): Could not find username " + Username);
    };

    groupInfoService.setMember = function(Username, groupInfoMember){     // Sets the groupInfo array index that contains the same username as the username parameter to the value of the groupInfoMember paramemter.
      for(i=0; i<5; ++i){
        if(groupInfo[i].username==Username){
          console.log("Found " + Username + "==" + groupInfo[i].username);
          groupInfo[i] = groupInfoMember;
          return true;
        };
      };
      console.error("In setMember(): Could not find username " + Username);
      return false;
    };
    
    return groupInfoService;

  })

  // User factory

  .factory('User', function(GroupInfo, BASE_URL, $http, API, $state, $httpParamSerializerJQLike, $ionicPopup, $ionicLoading) {
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
      return user;
    };

    return userService;
  });