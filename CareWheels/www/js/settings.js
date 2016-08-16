/**
 * Settings controller
 */

angular.module('careWheels')

  .controller('settingsController', function($scope, $controller, GroupInfo, User) {

    $scope.groupData = GroupInfo.groupInfo();

    // Need a function to find current user, then search for the correct
    // custom value field of "onVacation" and assign the booleanValue
    $scope.value = $scope.groupData[0].customValues[10].booleanValue;

    console.log('Settings Controller started');

    $scope.toggleVacationMode = function () {

      var newValue;

      if ($scope.value == false) {
        $scope.value = true;
        newValue = 'True';
      } else {
        $scope.value = false;
        newValue = 'False';
      }

      // console.log('testToggle changed to ' + $scope.value);

      var creds = User.credentials();

      User.setOnVacation(creds.username, creds.password, newValue);
      // console.log("Successfully changed vacation mode!");
    };

  });
