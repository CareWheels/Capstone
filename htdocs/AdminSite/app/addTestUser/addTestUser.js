'use strict';

angular.module('myApp.addTestUser', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/addTestUser', {
    templateUrl: 'addTestUser/addTestUser.html',
    controller: 'addTestUserCtrl'
  });
}])

.controller('addTestUserCtrl', ['$http', '$scope', function($http, $scope) {

        // create a blank object to handle form data.
        $scope.user = {};
        // calling our submit function.
        $scope.submitForm = function() {
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
