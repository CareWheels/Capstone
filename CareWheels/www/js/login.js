/**
 * CareWheels - Login Controller
 *
 */
angular.module('careWheels')

  .controller('loginController', function($rootScope, $scope, User){

    $scope.rememberMe = false;
    $scope.user = User;

    var credentials = angular.fromJson(window.localStorage['loginCredentials']);

    if (credentials)
      User.login(credentials.username, credentials.password, true);

    // $ionicModal.fromTemplateUrl('views/login.html', {
    //   scope: $scope
    // }).then(function(modal) {
    //   $scope.modal = modal;
    // });

    $scope.logoImage = 'img/CareWheelsLogo.png';

    // $scope.doLogin = function(username, password, rememberMe) {
    //   User.login(username, password, rememberMe, $scope.done);
    // }

    // $scope.login = function() {
    //   $scope.modal.show();
    // };

    // $scope.done = function() {
    //   $scope.modal.hide();
    // }

  });
