'use strict';

angular.module('myApp.viewFeeds', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/viewFeeds', {
            templateUrl: 'viewFeeds/viewFeeds.html',
            controller: 'ViewFeedsCtrl'
        });
    }])

    .controller('ViewFeedsCtrl', ['$http', '$scope', function($http, $scope) {

        $scope.$on('$routeChangeSuccess', function () {

            // create a blank object to handle form data.

            $scope.user = {};
            // calling our submit function.
            // Posting data to php file
            $http({
                method: 'POST',
                url: 'http://carewheels.cecs.pdx.edu:8080/admin/listFeedInfo.php',
                data: $scope.user, //forms user object
                headers: {'Content-Type': 'application/x-www-form-urlencoded'}
            })
                .success(function (data) {
                    if (data.errors) {
                        // Showing errors.
                        $scope.errorName = data.errors.name;
                        $scope.errorUserName = data.errors.username;
                        $scope.errorEmail = data.errors.email;
                    } else {
                        $scope.data = data;
                        console.log(data);
                    }
                });

        });
    }]);
