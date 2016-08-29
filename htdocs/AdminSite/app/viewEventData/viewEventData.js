'use strict';

angular.module('myApp.viewEventData', ['ngRoute', 'ngLoadingSpinner'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/viewEventData', {
    templateUrl: 'viewEventData/viewEventData.html',
    controller: 'viewEventDataCtrl'
  });
}])

.controller('viewEventDataCtrl', ['$http', '$scope', function($http, $scope) {


        // create a blank object to handle form data.
        $scope.user = {};
        // calling our submit function.
        $scope.submitForm = function() {
            // Posting data to php file
            $http({
                method  : 'POST',
                url     : 'http://carewheels.cecs.pdx.edu:8080/admin/listEventData.php',
                data    :  $scope.user, //forms user object
                headers : {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function(data) {
                    if (data.errors) {
                        // Showing errors.
                        $scope.errorSenseUsername = data.errors.senseUsername;
                    } else {
                        $scope.data = data;
                        $scope.formSubmitted = true;
                        console.log(data);
                    }
                });
        };
}]);
