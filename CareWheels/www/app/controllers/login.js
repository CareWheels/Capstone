/**
 * CareWheels - Login Controller
 *
 */
angular.module('careWheels')

    .controller('loginController', function($scope, User){
        $scope.rememberMe = true;
        $scope.user = User;
    });
