/**
 * CareWheels - Login Controller
 *
 */
angular.module('careWheels')

    .controller('loginController', function($scope, User, GroupInfo){
        $scope.rememberMe = true;
        $scope.user = User;
        $scope.groupInfo = GroupInfo;
    });
