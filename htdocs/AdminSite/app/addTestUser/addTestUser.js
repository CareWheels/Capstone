'use strict';

angular.module('myApp.addTestUser', ['ngRoute', 'ngLoadingSpinner'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addTestUser', {
    templateUrl: 'addTestUser/addTestUser.html',
    controller: 'addTestUserCtrl'
  });
}])

.controller('addTestUserCtrl', ['$http', '$scope', function($http, $scope) {

        $scope.getNumber = function (num) {
            return new Array(num);
        }

        // create a blank object to handle form data.
        $scope.user = {};

        $scope.user.previousDayPresence = [];
        $scope.user.previousDayMeds = [];
        $scope.user.previousDayMeal = [];
        $scope.user.currentDayPresence = [];
        $scope.user.currentDayMeds = [];
        $scope.user.currentDayMeal = [];

        for(var i = 0; i < 24; i++) {
            $scope.user.previousDayPresence[i] = false;
            $scope.user.currentDayPresence[i] = false;
            $scope.user.previousDayMeal[i] = 0;
            $scope.user.currentDayMeal[i] = 0;
            $scope.user.previousDayMeds[i] = 0;
            $scope.user.currentDayMeds[i] = 0;
        }

        // calling our submit function.
        $scope.submitForm = function() {

            parseInt("10")

            for(var i = 0; i < 24; i++) {
                $scope.user.previousDayMeal[i] = parseInt($scope.user.previousDayMeal[i]);
                $scope.user.currentDayMeal[i] = parseInt($scope.user.currentDayMeal[i]);
                $scope.user.previousDayMeds[i] = parseInt($scope.user.previousDayMeds[i]);
                $scope.user.currentDayMeds[i] = parseInt($scope.user.currentDayMeds[i]);
            }

            // Posting data to php file
            $http({
                method  : 'POST',
                url     : 'http://carewheels.cecs.pdx.edu:8080/admin/createTestUser.php',
                data    :  $scope.user, //forms user object
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function(data) {
                    if (data.errors) {
                        // Showing errors.
                        $scope.errorSenseUsername = data.errors.senseUsername;
                    } else {
                        $scope.message = data.message;
                        console.log(data);
                    }
                });
        };
}]);
