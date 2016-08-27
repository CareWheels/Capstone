'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
    'ngRoute',
    'myApp.viewUsers',
    'myApp.viewFeeds',
    'myApp.deleteUser',
    'myApp.cleanEventDataTable',
    'myApp.addUserToDB',
    'myApp.addTestUser',
    'myApp.version'
]).
config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
  $locationProvider.hashPrefix('!');

  $routeProvider.otherwise({redirectTo: '/viewUsers'});
}]);
