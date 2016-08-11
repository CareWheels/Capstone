/**
 * Created by asakawa on 8/11/16.
 */
describe('Controller: Group Status -', function () {

  beforeEach(angular.mock.module('careWheels'));

  var $controller;

  beforeEach(angular.mock.inject(function(_$controller_){
    $controller = _$controller_;
  }));


  /**
   * checks that the color alerts are being set properly
   * */
  describe('getAlertColor():', function () {
    it('check red', function () {
      var $scope = {};
      $controller('groupStatusController', { $scope: $scope });

      // calls a function that sets the alert color
      $scope.group[1].status = $scope.getAlertColor(2, 0);
      // assert that the status color is set to red
      expect($scope.group[1].status).toBe('red');
      // todo: check other combinations for different colors
    });

  });

  // todo: complete unit tests for all the functions
  describe('checkGroupHealth():', function () {
    it('group status success', function () {
      //assert success
    });
    it('group status fail', function () {
      //assert fail
    });

  });
  describe('displayError():', function () {
  });

  //todo add button press function test blocks here



  });
