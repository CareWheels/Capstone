/**
 * CareWheels - Login Controller
 *
 */
angular.module('careWheels')

  .controller('loginController', function($scope, $controller, User, $state, $ionicLoading){

    var dataDownload = $scope.$new();
    var dataAnalysis = $scope.$new();
    $controller('DownloadCtrl', {$scope : dataDownload});
    $controller('AnalysisCtrl', {$scope : dataAnalysis});

    $scope.rememberMe = false;
    $scope.logoImage = 'img/CareWheelsLogo.png';

    $scope.login = function(uname, passwd, rmbr) {
      User.login(uname, passwd, rmbr).then(function(response) {

        if (User.credentials()) {
          $ionicLoading.show({      //pull up loading overlay so user knows App hasn't frozen
            template: '<ion-spinner></ion-spinner>'+
                  '<p>Contacting Server...</p>'
          });

          // do data download here
          
          $state.go('app.groupStatus');
          $ionicLoading.hide();   //make sure to hide loading screen
        }

      });
    };

    var credentials = angular.fromJson(window.localStorage['loginCredentials']);

    if (credentials)
      $scope.login(credentials.username, credentials.password, true);

    // $ionicModal.fromTemplateUrl('views/login.html', {
    //   scope: $scope
    // }).then(function(modal) {
    //   $scope.modal = modal;
    // });





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
