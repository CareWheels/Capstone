/**
 * CareWheels - Login Controller
 *
 */
angular.module('careWheels')
  .controller('loginController',
    function($scope, $controller, User, $state, $ionicLoading, $ionicHistory, $ionicPopup, GroupInfo, $interval, notifications, onlineStatus, VERSION_NUMBER, Download){

    var DOWNLOAD_INTERVAL = 1000 * 60 * 5; // constant interval for download, 5 mins
    //var dataDownload = $scope.$new();
    //var dataAnalysis = $scope.$new();
    var loginTimeout = false;
    var loginIntervalSteps = 0;
    var popupTemplate = '<ion-spinner></ion-spinner>' + '<p>Contacting Server...</p>';
    var info = '';

    var credentials = angular.fromJson(window.localStorage['loginCredentials']);

    $ionicHistory.nextViewOptions({disableBack: true});

    //$controller('DownloadCtrl', {$scope : dataDownload});
    //$controller('AnalysisCtrl', {$scope : dataAnalysis});

    $scope.rememberMe = false;
    $scope.logoImage = 'img/CareWheelsLogo.png';
    $scope.connectionError = false;
    $scope.versionNumber = VERSION_NUMBER;


    /**
     * Login function is called from app.js. This method
     * goes through the following steps
     *
     *      1. login into the carebank
     *      2. download data from sen.se
     *      3. analyze the data
     *      4. if success - redirect to group view, otherwise
     *         reload the login controller, and try again.
     *         (user will have to manually input credentials at this point)
     * */
    $scope.login = function(uname, passwd, rmbr) {
      User.login(uname, passwd, rmbr).then(function(response) {

        if (User.credentials()) {
          //pull up loading overlay so user knows App hasn't frozen
          $ionicLoading.show({ template: popupTemplate });

          // do the data download
          Download.DownloadData();

          // store the interval promise in this variable
          var intervalPromise = $interval( function(){
            // keep track of how many times we step through the interval
            loginIntervalSteps++;
            info = GroupInfo.groupInfo();

            // its taking to long, timeout of the interval
            if (loginIntervalSteps > 120) // 120 * 500 = 1.5 min timeout
              loginTimeout = true;

            // alright, lets try to analyze the data
            // only run analyze if sensor data is present
            //if (info[4].sensorData != null){
            //    dataAnalysis.AnalyzeData();
            //}

            // were taking way to long, ABORT
            if (loginTimeout){
              loginTimeout = false;               // reset timeout flag
              loginIntervalSteps = 0;             // reset step count
              $interval.cancel(intervalPromise);  // break out of interval
              $ionicLoading.hide();               // kill the loading screen
              $state.reload();                    // reload the view (try again)
              displayError(0);                    // pop-up error
            }

            // sweet we got data, lets break out of this interval
            if (info[4].analysisData != null){
              $interval.cancel(intervalPromise);  // break out of interval
              notifications.Init_Notifs();        // initialize notifications
              scheduleDownload();                 // spin up a download/analyze scheduler
              $state.go('app.groupStatus');       // go to group view
              $ionicLoading.hide();               // hide loading screen
            }
          }, 500 );
        }
      });
    };


    /**
     * Interval to check for internet connection.
     * */
    $interval(function(){
      if (!onlineStatus.isOnline() && !$scope.connectionError){
        $scope.connectionError = true;
        displayError(1);
      }
    }, 100);

    /**
     * Schedule a download every on an interval:
     *      1. download data
     *      2. wait
     *      3. analyze data
     * */
    function scheduleDownload(){

        $interval(function(){
          //if(onlineStatus.isOnline()){
            Download.DownloadData();
            //setTimeout(function(){
            //  dataAnalysis.AnalyzeData();
            //}, DOWNLOAD_INTERVAL / 2); // wait halfway through the interval, then analyze
          //}
          //else{
            //displayError(1);
          //}
        }, DOWNLOAD_INTERVAL ); // 5 min interval

    }



    // An error popup dialog
    function displayError(index) {
      var errorStrings = [
        'Please try again, or contact a system administrator.',
        'Please check your internet connection.'
      ];
      var buttonText = [
        'Okay',
        'Retry'
      ];

      var alertPopup = $ionicPopup.alert({
        title: '<div class="errorTitle">Unable to Connect With CareWheels</div>',
        template: '<div class="errorTemplate">' + errorStrings[index] + '</div>',
        buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
          text: buttonText[index],
          type: 'button-calm'
        }]
      });
      alertPopup.then(function (res) {
        // only set this bool to false if its a connection error
        if (index == 1)
          $scope.connectionError = false;
      });
    }


    if (credentials)
      $scope.login(credentials.username, credentials.password, true);

  });
