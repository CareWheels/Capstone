angular.module('careWheels')

.config(function($stateProvider, $urlRouterProvider) { 

  //$urlRouterProvider.otherwise('/login');
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: '../views/login.html',
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
      templateUrl: '../views/groupStatus.html',
      controller: 'groupStatusController'
    })

    .state('individualStatus', {
      url: '/individualStatus',
      templateUrl: '../views/individualStatus.html',
      controller: 'individualStatusController'
    })

    .state('reminders', {
      url: '/reminders',
      templateUrl: '../views/reminders.html',
      controller: 'NotificationController'
    })

    .state('test', {
      url: '/test',
      templateUrl: '../templates/test.html',
    });

  //$urlRouterProvider.otherwise('/groupStatus');
})
