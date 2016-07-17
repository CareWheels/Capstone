angular.module('careWheels', [
  'ionic'
])
  .constant('BASE_URL', 'https://carebank.carewheels.org:8443')
  .run(function($ionicPlatform) {
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
  .factory('API', function(BASE_URL) {
    var api = {
      userAndGroupInfo:     BASE_URL + '/userandgroupinfo.php',
      userInfo:             BASE_URL + '/userinfo.php',
      updateUserReminders:  BASE_URL + '/updateuserreminders.php',
      groupMemberInfo:      BASE_URL + '/groupmemberinfo.php',
      updateLastOwnership:  BASE_URL + '/updatelastownershiptakentime.php',
      dailyTrxHist:         BASE_URL + '/dailytransactionhistory.php'
    };
    return api;
  })
  .factory('GroupInfo', function() {
    return [];
  })
  .factory('User', function(GroupInfo, BASE_URL, $http, API, $state) {
    var user = {};

    var credentials = angular.fromJson(window.localStorage['loginCredentials']);

    if (credentials)
      user.login(credentials.username, credentials.password);
    else
      $state.go('login');

    user.login = function(uname, passwd) {
      $http({
        url:API.userAndGroupInfo,
        method: 'POST',
        data: {
            username:uname,
            password:passwd,
            usernametofind:uname
        },
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function(response) {
        //store user info
        //store groupMember info
        //$state.go('overview')
      }, function(response) {
        //present login failed
      })
    };
    return user;
  });

