/**
 * Created by asakawa on 8/15/16.
 */
describe('Controller: Group Status -', function () {

  beforeEach(angular.mock.module('careWheels'));

  var $controller;
  var $state;

  beforeEach(inject(function ($injector){
    $controller = $injector.get('$controller');
    $state = $injector.get('$state');

  }));

  describe('Toggles -', function(){
    it('toggleOnOff():', function(){
      var $scope = {};
      $controller('remindersController', {$scope: $scope});
      for (var i=0; i < 3; i++){
        $scope.reminders[i].isOn = false;
        $scope.toggleOnOff(i);
        expect($scope.reminders[i].isOn).toBe(true);
        $scope.toggleOnOff(i);
        expect($scope.reminders[i].isOn).toBe(false);
      }
    });

    it('toggleAmPm():', function(){
      var $scope = {};
      $controller('remindersController', {$scope: $scope});
      for (var i=0; i < 1; i++){
        $scope.reminders[i].isPM = true;
        $scope.reminders[i].amOrPm = 'PM';
        $scope.toggleAmPm(i);
        expect($scope.reminders[i].isPM).toBe(false);
        expect($scope.reminders[i].amOrPm).toBe('AM');
        $scope.toggleAmPm(i);
        expect($scope.reminders[i].isPM).toBe(true);
        expect($scope.reminders[i].amOrPm).toBe('PM');
      }
    });
  });



});
