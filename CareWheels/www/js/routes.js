var app = angular.module('careWheels');

app.config(function($stateProvider, $urlRouterProvider) {

  //$urlRouterProvider.otherwise('/');
  $stateProvider

    .state('login', {
      url: '/login',
      templateUrl: 'views/login.html',
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
      templateUrl: 'views/groupStatus.html',
      controller: 'groupStatusController'
    })

    .state('individualStatus', {
      url: '/individualStatus',
      templateUrl: 'views/individualStatus.html',
      controller: 'individualStatusController'
    })

    .state('reminders', {
      url: '/reminders',
      templateUrl: 'views/reminders.html',
      controller: 'remindersController'
    })

    /* TESTING; TODO: for testing. dev buttons */
    .state('testButtons', {
      url: '/test',
      templateUrl: 'views/testButtons.html'
    });

  /* default view (should be login on production) */
  $urlRouterProvider.otherwise('/test');
});




