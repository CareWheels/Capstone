/**
 * CareWheels - Login Controller
 *
 */
angular.module('careWheels')

  .controller('loginController', function($scope, $controller, User, $state, $ionicLoading, GroupInfo, $interval){

    var DOWNLOAD_INTERVAL = 1000 * 60 * 5; // constant interval for download

    var dataDownload = $scope.$new();
    var dataAnalysis = $scope.$new();

    var credentials = angular.fromJson(window.localStorage['loginCredentials']);

    $controller('DownloadCtrl', {$scope : dataDownload});
    $controller('AnalysisCtrl', {$scope : dataAnalysis});

    $scope.rememberMe = false;
    $scope.logoImage = 'img/CareWheelsLogo.png';
    $scope.loginTimeout = false;
    $scope.loginAttempts = 0;

    $scope.login = function(uname, passwd, rmbr) {
      User.login(uname, passwd, rmbr).then(function(response) {

        setTimeout(function(){
          $scope.loginTimeout = true;
        }, 1000 * 3);

        if (User.credentials()) {
          $ionicLoading.show({      //pull up loading overlay so user knows App hasn't frozen
            template: '<ion-spinner></ion-spinner>' + '<p>Contacting Server...</p>'
          });
          // do data download here
          dataDownload.DownloadData();

          // store the interval promise in this variable
          var intervalPromise;

          // stops the interval
          $scope.stopInterval = function() { $interval.cancel(intervalPromise); };
          // starts the interval
          $scope.startInterval = function() {
            // store the interval promise
            intervalPromise = $interval( analyzeData, 100 );
          };

          // starting the interval by default
          $scope.startInterval();


        }

      });
    };

    /**
     * This logic probably does not belong here, but by doing it this way
     * it only starts this interval once the initial download and analyze
     * finish. async issues here.. so i took the easy way out.
     *      1. download data
     *      2. wait
     *      3. analyze data
     * */
    function scheduleDownload(){
      $interval(function(){
        dataDownload.DownloadData();
        setTimeout(function(){
          dataAnalysis.AnalyzeData();
        }, 1000 * 60 * 2); // give the download two mins before analyze
      }, DOWNLOAD_INTERVAL ); // 5 min interval
    }


    function analyzeData() {
      var info = GroupInfo.groupInfo();
      try {
        dataAnalysis.AnalyzeData();
      }
      catch (Exception){
        console.log('waiting for download to finish')
      }
      // sweet we got data, lets break out of this interval
      if (info[4].analysisData !== null){
        $state.go('app.groupStatus');
        $scope.stopInterval();
        $ionicLoading.hide();   //make sure to hide loading screen
        scheduleDownload();
      }
    }


    if (credentials)
      $scope.login(credentials.username, credentials.password, true);

    // $ionicModal.fromTemplateUrl('views/login.html', {
    //   scope: $scope
    // }).then(function(modal) {
    //   $scope.modal = modal;
    // });





    // $scope.doLogin = function(username, password, rememberMe) {
    //   User.login(username, password, rememberMe, $scope.done);
    // }

    // $scope.login = function() {
    //   $scope.modal.show();
    // };

    // $scope.done = function() {
    //   $scope.modal.hide();
    // }

  });
