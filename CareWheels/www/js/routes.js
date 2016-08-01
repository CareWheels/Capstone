angular.module('careWheels')

.config(function($stateProvider, $urlRouterProvider) { 

  //$urlRouterProvider.otherwise('/');
  $stateProvider

    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'views/menu.html',
      controller: 'loginController'
    })

    // .state('app.login', {
    //   url: '/login',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'views/login.html',
    //       controller: 'loginController'
    //     },
    //     resolve: {
    //       "auth": function($state, User) {
    //         var credentials = angular.fromJson(window.localStorage['loginCredentials']);

    //         if (credentials)
    //           return User.login(credentials.username, credentials.password, true);
    //       }
    //     }
    //   }
    // })

    .state('app.groupStatus', {
      url: '/groupStatus',
     	views: {
         'menuContent': {
           templateUrl: 'views/groupStatus.html',
           controller: 'groupStatusController'
         }
       }
    })

    .state('individualStatus', {
      url: '/individualStatus',
      views: {
        'menuContent': {
          templateUrl: 'views/individualStatus.html',
          controller: 'individualStatusController'
        }
      }
    })

    .state('app.reminders', {
      url: '/reminders',
      views: {
        'menuContent': {
          templateUrl: 'views/reminders.html',
          controller: 'remindersController'
        }
      }
    });
    
    // .state('app.tests', {
    //   url: '/tests',
    //   views: {
    //     'menuContent': {
    //       templateUrl: 'views/tests.html'
    //     }
    //   }
    // });

  $urlRouterProvider.otherwise('/app/groupStatus');
})
