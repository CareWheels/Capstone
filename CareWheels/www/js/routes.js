angular.module('careWheels')

.config(function($stateProvider, $urlRouterProvider) { 
    
  //$urlRouterProvider.otherwise('/login');
  $stateProvider.state('login', {
    url: '/login',
    templateUrl: 'login.html',
    controller: 'loginController'
  });

  $stateProvider.state('test', {
    url: '/test',
    templateUrl: '../../templates/test.html',
  });

})