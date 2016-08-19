angular.module('careWheels')

.controller('menu', function ($scope, $state, $ionicPopup) {

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
                alert(error);
            }), false);
    };

    $scope.openCyclos = function () {
        startApp.set({
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
            alert(error);
        });            
    };
});