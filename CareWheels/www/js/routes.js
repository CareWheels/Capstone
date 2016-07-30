var app = angular.module('careWheels');

app.config(function($stateProvider, $urlRouterProvider) {

  //$urlRouterProvider.otherwise('/');
  $stateProvider

    
    .state('home', {
      url: '/',
      templateUrl: 'index.html',
      controller: 'DownloadCtrl'
    })

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
    });

  //$urlRouterProvider.otherwise('/home');
})
app.controller('goBackController', function($scope, $ionicHistory){
  /* go back button */
  $scope.goBack = function () { $ionicHistory.goBack(); };
});