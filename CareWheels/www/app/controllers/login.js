/**
 * CareWheels - Login Controller
 *
 */
angular.module('careWheels', [])

.controller('loginController', ['loginService', function($scope, loginService, $ionicPopup, $state){

  $scope.data = angular.fromJson(window.localStorage['loginCredentials'] || { remember : true });


  // If sucessfully loaded from local storage, call the login function (submit)
  if($scope.data.username && $scope.data.password) {
    $scope.login();
  }
  
  //This function will be called when submit button is pressed.
  $scope.login = function() {
    //Call a loginUser from loginServices
    loginService.loginUser($scope.data.username, $scope.data.password).success(function(data) {

      //Check if remember is true. If so, save credentials to local storage.
      if($scope.data.remember) {
          window.localStorage['loginCredentials'] = angular.toJson($scope.data); 
      }

      var alertPopup = $ionicPopup.alert({
        title: 'Login Success!',
        template: 'Welcome!'
      });

    //TODO If login sucess, then navigate to test screen.
      $state.go('test');
    }).error(function(data) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: 'Please check your credentials!'
      });
    });
  }
}]);
