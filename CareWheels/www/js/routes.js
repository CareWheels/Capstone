angular.module('careWheels')

.config(function($stateProvider, $urlRouterProvider) { 
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'templates/login.html',
    controller: 'loginController'
  });

  $stateProvider.state('test', {
    url: '/test',
    templateUrl: 'templates/test.html',
  });

  $urlRouterProvider.otherwise('/login');
})