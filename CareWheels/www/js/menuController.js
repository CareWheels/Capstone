angular.module('careWheels')

.controller('menu', function ($scope, $state, $ionicPopup) {

    $scope.versionNumber = VERSION_NUMBER;


    $scope.navHistory = function() {

      if($ionicHistory.backView() != null) {
        return true;
      }

      return false;
    };
    
    // Functions for controlling the side menu buttons.  
    //

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

    $scope.openSense = function () { 
        document.addEventListener("deviceready", 
            startApp.set({
                "action": "ACTION_MAIN",
                "category": "CATEGORY_DEFAULT",
                "package":"sen.se.pocketmother",
                "flags": ["FLAG_ACTIVITY_CLEAR_TOP", "FLAG_ACTIVITY_CLEAR_TASK"],
                "component": ["sen.se.pocketmother"],
                "intentstart": "startActivity"
            })
            .start(function() {
                console.log("OK");
            }, function(error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Sen.se application not available"
                });       
            })
        , false);
    };

    $scope.openCyclos = function () {
        document.addEventListener("deviceready", 
            startApp.set({
                "application": "org.cyclos.mobile",
                "action": "ACTION_MAIN",
                "category": "CATEGORY_DEFAULT",
                "package":"org.cyclos.mobile",
                "flags": ["FLAG_ACTIVITY_CLEAR_TOP", "FLAG_ACTIVITY_CLEAR_TASK"],
                "component": ["org.cyclos.mobile"],
                "intentstart": "startActivity"
            })
            .start(function() {
                console.log("OK");
            }, function(error) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Error',
                    template: "Cyclos application not available"
                });            
            })
        , false);
    };
});