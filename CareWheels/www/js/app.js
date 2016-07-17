angular.module('careWheels', [
  'ionic',
  'ui.router'
])

  //contant definition for endpoint base url
  .constant('BASE_URL', 'https://carebank.carewheels.org:8443')

  //
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
  .factory('User', function(GroupInfo, BASE_URL, $http, API, $state, $httpParamSerializerJQLike) {
    var user = {};
    window.localStorage['loginCredentials'] = null;

    var credentials = angular.fromJson(window.localStorage['loginCredentials']);

    user.login = function(uname, passwd, rmbr) {
      if (rmbr)
        window.localStorage['loginCredentials'] = angular.toJson({"username":uname, "password":passwd});

      $http({
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
        //store user info
        //store groupMember info
        $state.go('groupStatus')
      }, function(response) {
        //present login failed
      })
    };

    if (credentials)
      user.login(credentials.username, credentials.password, true);
    else
      $state.go('login');

    return user;
  });

