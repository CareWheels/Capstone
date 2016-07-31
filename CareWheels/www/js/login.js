/**
 * CareWheels - Login Controller
 *
 */
angular.module('careWheels')

    .controller('loginController', function($rootScope, $scope, User, GroupInfo){
        $scope.rememberMe = false;
        $rootScope.user = User;
        $rootScope.groupInfo = GroupInfo;

        $scope.logoImage = 'img/CareWheelsLogo.png';

    });
