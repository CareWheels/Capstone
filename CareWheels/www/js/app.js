// Ionic Starter App


// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('careWheels', [
  'ionic',
  'ui.router',
  'ngCordova',
  'FredrikSandell.worker-pool'
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

  app.factory('User', function(DownloadService, GroupInfo, BASE_URL, $http, API, $state, $httpParamSerializerJQLike, $ionicPopup, $ionicLoading) {
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
        var alertPopup = $ionicPopup.alert({
          title: 'Login failed!',
          template: 'Please check your credentials!'
        });
      })
    };
    user.retrieveLocal = function() {

      return angular.fromJson(window.sessionStorage['user']);
    };
    return user;
  });


/////////////////////////////////////////////////////////////////////////////////////////

//This factory
//We inject this service into groupStatusController, so that it can tell us what group (which people)
//to download data for
/////////////////////////////////////////////////////////////////////////////////////////
app.factory('DownloadService', function() {

  var membersToDownload = [];
  // public API
  return {
    addGroupInfo: function (group) {
      var allGroupMembers = group;

    for (i=0; i < allGroupMembers.length; i++){
        if (allGroupMembers[i].group.name == "CareWheel 1") {//Need to determine if we need to download users sen.se data
          membersToDownload.push(allGroupMembers[i]);
        };
      }
      console.log("group members in current users carewheel = ", membersToDownload);

    },
    getGroupInfo: function () {
      return membersToDownload;
    }
  };

});


/////////////////////////////////////////////////////////////////////////////////////////
//Factory for parsing feed data returned from promise in DownloadCtrl above
//We can then inject this service into AnalysisCtrl
/////////////////////////////////////////////////////////////////////////////////////////
app.factory('DataService', function() {

  var currentGroup = [];
  var analyzedData = [];

  // public API
  return {
    getGroup: function () {
      if (currentGroup == null){
          return console.error("Group data has not been parsed yet!");
        }
      return currentGroup;
    },
    addToGroup: function ( id ) {
      //will be called by data download.  This will be an object
      //which contains up to 5 members, with and array of 3 feeds each
      objectToAdd = id;
      //if (currentGroup.length < 4){
      currentGroup.push(objectToAdd);
      //}

    },
    addAnalyzedData: function (dataAfterAnalysis) {//called after analysis is finished
       analyzedData.push(dataAfterAnalysis);
       console.log('check analyzed data contents', analyzedData);
    },
    getAnalyzedData: function () {//called by groupmember summary screen
      return analyzedData;
    }
  };

});

