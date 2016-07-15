/**
 * CareWheels - Reminders Controller
 *
 */

angular.module('careWheels', ['ionic']).controller('remindersController', function($scope){
  $scope.reminders = {
    hour: '0',
    min: '00',
    amOrPm: 'AM'
  }

});
