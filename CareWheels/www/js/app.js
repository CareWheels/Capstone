var app = angular.module('careWheels', ['ionic', 'loginController', 'loginService'])

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

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
});

