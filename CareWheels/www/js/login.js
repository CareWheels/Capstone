/**
 * CareWheels - Login Controller
 *
 */
angular.module('careWheels')

    .controller('loginController', function($rootScope, $scope, $ionicModal, User, GroupInfo){

        $scope.rememberMe = false;
        $rootScope.user = User;
        $rootScope.groupInfo = GroupInfo;

        $ionicModal.fromTemplateUrl('views/login.html', {
            scope: $scope
        }).then(function(modal) {
            $scope.modal = modal;
        });

        $scope.logoImage = 'img/CareWheelsLogo.png';

        $scope.doLogin = function(username, password, rememberMe) {
            User.login(username, password, rememberMe, $scope.done);
        }

        $scope.login = function() {
            $scope.modal.show();
        };

        $scope.done = function() {
            $scope.modal.hide();
        }

    });
