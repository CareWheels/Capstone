angular.module('careWheels')

.config(function($stateProvider, $urlRouterProvider) { 
    
  //$urlRouterProvider.otherwise('/login');
  $stateProvider

  .state('login', {
    url: '/login',
    templateUrl: 'app/views/login.html',
    controller: 'loginController'
  })

  .state('groupStatus', {
      url: '/groupStatus',
      templateUrl: 'app/views/groupStatus.html',
      controller: 'groupStatusController'
  })

  .state('test', {
    url: '/test',
    templateUrl: '../../templates/test.html',
  });

})