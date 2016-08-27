'use strict';

angular.module('myApp.cleanEventDataTable', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/cleanEventDataTable', {
    templateUrl: 'cleanEventDataTable/cleanEventDataTable.html',
    controller: 'cleanEventDataTableCtrl'
  });
}])

.controller('cleanEventDataTableCtrl', ['$http', '$scope', function($http, $scope) {


        // create a blank object to handle form data.
        $scope.user = {};
        // calling our submit function.
        $scope.submitForm = function() {
            // Posting data to php file
            $http({
                method  : 'POST',
                url     : 'http://carewheels.cecs.pdx.edu:8080/admin/cleanEventDataTable.php',
                data    :  $scope.user, //forms user object
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function(data) {
                    if (data.errors) {
                        // Showing errors.
                    } else {
                        $scope.message = data.message;
                        console.log(data);
                    }
                });
        };
}]);
