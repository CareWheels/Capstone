/**
 * CareWheels - Login Controller
 *
 */
angular.module('careWheels')

  .controller('loginController', function($scope, $controller, User, $state, $ionicLoading, GroupInfo, $interval){

    var DOWNLOAD_INTERVAL = 1000 * 60 * 5; // constant interval for download, 5mins
    var dataDownload = $scope.$new();
    var dataAnalysis = $scope.$new();
    var loginTimeout = false;
    var loginIntervalSteps = 0;

    var credentials = angular.fromJson(window.localStorage['loginCredentials']);

    $controller('DownloadCtrl', {$scope : dataDownload});
    $controller('AnalysisCtrl', {$scope : dataAnalysis});

    $scope.rememberMe = false;
    $scope.logoImage = 'img/CareWheelsLogo.png';

    $scope.login = function(uname, passwd, rmbr) {
      User.login(uname, passwd, rmbr).then(function(response) {

        if (User.credentials()) {
          $ionicLoading.show({      //pull up loading overlay so user knows App hasn't frozen
            template: '<ion-spinner></ion-spinner>' + '<p>Contacting Server...</p>'
          });
          // do data download here
          dataDownload.DownloadData();

          // store the interval promise in this variable
          var intervalPromise = $interval( function(){

            if (loginIntervalSteps > 120) // 120 * 500 = 1min timeout
              loginTimeout = true;

            // keep track of how many times we step through the interval
            loginIntervalSteps++;

            var info = GroupInfo.groupInfo();
            try {
              dataAnalysis.AnalyzeData();
            }
            catch (Exception){
              console.log('waiting for download to finish')
            }
            // sweet we got data, lets break out of this interval
            if (info[4].analysisData !== null || loginTimeout){
              $interval.cancel(intervalPromise);
              $ionicLoading.hide();   //make sure to hide loading screen
              scheduleDownload();
              $state.go('app.groupStatus');
            }
          }, 500 );
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


    if (credentials)
      $scope.login(credentials.username, credentials.password, true);

  });
