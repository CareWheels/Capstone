// Ionic Starter App

angular.module('careWheels', [
  'ionic',
  'ui.router',
  'ngCordova',
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
    return [];
  })

  // User factory
  .factory('User', function(GroupInfo, BASE_URL, $http, API, $state, $httpParamSerializerJQLike, $ionicPopup) {
    var user = {};
    //window.localStorage['loginCredentials'] = null;

    user.login = function(uname, passwd, rmbr) {

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
        GroupInfo = response.data;
        $state.go('groupStatus')
      }, function(response) {
        //present login failed
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      })
    };

    return user;
  });
