angular.module('careWheels')

.controller('menu', function ($scope, $state, $ionicHistory, $ionicPopup, VERSION_NUMBER) {

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

    $scope.clickPocketMother = function() {
        $ionicPopup.confirm({
            title: 'Open Pocketmother',
            subTitle: 'You are leaving CareWheels'
        })
        .then(function(res) {
            if (res)
                openSense();
        });
    };

    $scope.clickCyclos = function() {
        $ionicPopup.confirm({
            title: 'Open Cyclos',
            subTitle: 'You are leaving CareWheels'
        })
        .then(function(res) {
            if (res)
                openCyclos();
        });
    };

    var openSense = function () { 
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
                $ionicPopup.alert({
                    title: 'Error',
                    subTitle: "Sen.se application not available"
                });       
            })
        , false);
    };

    var openCyclos = function () {
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
                $ionicPopup.alert({
                    title: 'Error',
                    subTitle: "Cyclos application not available"
                });            
            })
        , false);
    };

});