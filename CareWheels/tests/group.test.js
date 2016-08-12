/**
 * Created by asakawa on 8/11/16.
 */
describe('Controller: Group Status -', function () {

  beforeEach(angular.mock.module('careWheels'));

  var $controller;
  var $state;

  beforeEach(inject(function ($injector){
    $controller = $injector.get('$controller');
    $state = $injector.get('$state');

  }));

  /**
   * checks that the color alerts are being set properly
   * */
  describe('getAlertColor():', function () {
    it('check red', function () {
      var $scope = {};
      $controller('groupStatusController', {$scope: $scope});
      // calls a function that sets the alert color
      // then assert that the status color is set to red
      $scope.group[1].status = $scope.getAlertColor(2, 2);
      $scope.group[2].status = $scope.getAlertColor(2, 1);
      $scope.group[3].status = $scope.getAlertColor(1, 2);
      $scope.group[4].status = $scope.getAlertColor(2, 0);
      expect($scope.group[1].status).toBe('red');
      expect($scope.group[2].status).toBe('red');
      expect($scope.group[3].status).toBe('red');
      expect($scope.group[4].status).toBe('red');
    });

    it('check yellow', function () {
      var $scope = {};
      $controller('groupStatusController', {$scope: $scope});
      // calls a function that sets the alert color
      // then assert that the status color is set to red
      $scope.group[1].status = $scope.getAlertColor(1, 0);
      $scope.group[2].status = $scope.getAlertColor(0, 1);
      $scope.group[3].status = $scope.getAlertColor(1, 0);
      $scope.group[4].status = $scope.getAlertColor(1, 1);
      expect($scope.group[1].status).toBe('yellow');
      expect($scope.group[2].status).toBe('yellow');
      expect($scope.group[3].status).toBe('yellow');
      expect($scope.group[4].status).toBe('yellow');
    });

    it('check blue', function () {
      var $scope = {};
      $controller('groupStatusController', {$scope: $scope});
      // calls a function that sets the alert color
      // then assert that the status color is set to red
      $scope.group[1].status = $scope.getAlertColor(0, 0);
      expect($scope.group[1].status).toBe('blue');
    });

    it('check error', function () {
      var $scope = {};
      $controller('groupStatusController', {$scope: $scope});
      // calls a function that sets the alert color
      // then assert that the status color is set to red
      $scope.group[1].status = $scope.getAlertColor(-1, 0);
      $scope.group[2].status = $scope.getAlertColor(2, null);
      $scope.group[3].status = $scope.getAlertColor(3, 1);
      $scope.group[4].status = $scope.getAlertColor(2, 99999);
      expect($scope.group[1].status).toBe('');
      expect($scope.group[2].status).toBe('');
      expect($scope.group[3].status).toBe('');
      expect($scope.group[4].status).toBe('');

    });

  });

  describe('checkGroupHealth():', function () {
    it('group status success', function () {
      var $scope = {};
      $controller('groupStatusController', {$scope: $scope});
      $scope.checkGroupHealth();
      expect($scope.group[0].displayedError).toBe(false);
    });
    it('group status fail', function () {
      var $scope = {};
      $controller('groupStatusController', {$scope: $scope});
      $scope.group[4].error = true;
      $scope.checkGroupHealth();
      expect($scope.group[0].displayedError).toBe(true);
    });

  });
  describe('click users:', function () {
    it('clickTopLeft()', function(){
      var $scope = {};
      $controller('groupStatusController', {$scope: $scope});
      $scope.group[1].name = 'luke';
      $scope.clickTopLeft();
      expect($scope.group[0].userSelected).toBe('luke');
    });
    it('clickTopRight()', function(){
      var $scope = {};
      $controller('groupStatusController', {$scope: $scope});
      $scope.group[2].name = 'obiwan';
      $scope.clickTopRight();
      expect($scope.group[0].userSelected).toBe('obiwan');
    });
    it('clickBottomLeft()', function(){
      var $scope = {};
      $controller('groupStatusController', {$scope: $scope});
      $scope.group[3].name = 'mace windu';
      $scope.clickBottomLeft();
      expect($scope.group[0].userSelected).toBe('mace windu');
    });
    it('clickBottomRight()', function(){
      var $scope = {};
      $controller('groupStatusController', {$scope: $scope});
      $scope.group[4].name = 'yoda';
      $scope.clickBottomRight();
      expect($scope.group[0].userSelected).toBe('yoda');
    });

  });


});
