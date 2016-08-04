// Ionic Starter App

angular.module('careWheels', [
  'ionic',
  'ui.router',
  'ngCordova'
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
    var groupInfo = {};

    groupInfo.saveLocal = function(data) {

      return window.sessionStorage['groupInfo'] = angular.toJson(data);
    };

    groupInfo.retrieveLocal = function() {

      return angular.fromJson(window.sessionStorage['groupInfo']);
    };

    return groupInfo;
  })

  // User factory
  .factory('User', function(GroupInfo, BASE_URL, $http, API, $state, $httpParamSerializerJQLike, $ionicPopup, $ionicLoading) {
    var user = {};
    //window.localStorage['loginCredentials'] = null;

    user.login = function(uname, passwd, rmbr, callback) {
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
        window.sessionStorage['user'] = angular.toJson({"username":uname, "password":passwd});
        GroupInfo.saveLocal(response.data);
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

    user.retrieveLocal = function() {

      return angular.fromJson(window.sessionStorage['user']);
    };

    return user;
  });
