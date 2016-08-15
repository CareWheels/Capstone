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
      $scope.toggleOnOff(0);
      expect($scope.reminders[0].isOn).toBe(true);
      $scope.toggleOnOff(0);
      expect($scope.reminders[0].isOn).toBe(false);
    });

    it('toggleAmPm():', function(){
      var $scope = {};
      $controller('remindersController', {$scope: $scope});

    });


  });



});
