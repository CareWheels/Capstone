angular.module('careWheels')

.config(function($stateProvider, $urlRouterProvider) { 

  //$urlRouterProvider.otherwise('/login');
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'app/views/login.html',
      controller: 'loginController',
      resolve: {
        "auth": function($state, User) {
          var credentials = angular.fromJson(window.localStorage['loginCredentials']);

          if (credentials)
            return User.login(credentials.username, credentials.password, true);
          else
            $state.go('login');
        }
      }
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

  //$urlRouterProvider.otherwise('/groupStatus');
})
