/**
 * Settings controller
 */

angular.module('careWheels')

  .controller('settingsController', function($scope, $controller, GroupInfo, User) {

    $scope.value = User.getVacationValue();

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

      User.setVacationValue($scope.value);
    };

  });
