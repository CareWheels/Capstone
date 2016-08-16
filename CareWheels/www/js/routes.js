angular.module('careWheels')

  .config(function ($stateProvider, $urlRouterProvider) {

    //$urlRouterProvider.otherwise('/');
    $stateProvider

      .state('login', {
        url: '/login',
        templateUrl: 'views/login.html',
        controller: 'loginController'
      })

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'views/menu.html',
        controller: 'menu'
      })

      .state('app.groupStatus', {
        url: '/groupStatus',
        views: {
          'menuContent': {
            templateUrl: 'views/groupStatus.html',
            controller: 'groupStatusController'
          }
        }
      })

      .state('app.individualStatus', {
        cache:false,
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
      })
      .state('app.settings', {
        url: '/settings',
        views: {
          'menuContent': {
            templateUrl: 'views/settings.html',
            controller: 'settingsController'
          }
        }
      })
      .state('app.tests', {
        url: '/tests',
        views: {
          'menuContent': {
            templateUrl: 'views/tests.html'
          }
        }
      });

      $urlRouterProvider.otherwise(function ($injector, $location) {
        var $state = $injector.get("$state");
        $state.go("app.groupStatus");
      });
  })

  .controller('goBackController', function($scope, $ionicHistory){

    /* go back button */
    $scope.goBack = function () {
      $ionicHistory.goBack();
    };
  });
