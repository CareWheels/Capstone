angular.module('fileloggermodule', ['ionic', 'fileLogger'])
  .service('fileloggerService', function ($fileLogger, $filter) {
    var logFileName = "localLogFile.log";

    this.setLogLocation = function (fileName) {
      $fileLogger.setStorageFilename(fileName);
      $fileLogger.log('info', 'fileLogger started!');
      // console.log('Current log file: ' + fileName);
    };

    this.getCurrentDate = function () {
      var today = new Date();
      var formattedDate = $filter('date')(today, 'yyyy-MM-dd');
      return formattedDate;
    };

    this.getCurrentDateTime = function () {
      var today = new Date();
      var formattedDate = $filter('date')(today, 'yyyy-MM-dd-HH-mm-ss');
      return formattedDate;
    };

    // get log file name based on today date
    this.getLogFileName = function () {
      var currentDate = this.getCurrentDate();
      logFileName = currentDate + '.log';
      return logFileName;
    };

    this.initLogComponent = function () {
      this.setLogLocation(this.getLogFileName());
      $fileLogger.setTimestampFormat('medium');
    };

    this.someLog = function () {
      $fileLogger.log('debug', 'log from cybertron');
      $fileLogger.log('info', 'log from cybertron');
      $fileLogger.log('warn', 'log from cybertron');
      $fileLogger.log('error', 'log from cybertron');
    };

    this.deleteLogFile = function () {
      $fileLogger.deleteLogfile().then(function () {
        $fileLogger.log('info', 'The log file ' + logFileName + ' is deleted!');
      });
    };
  })
  .controller('fileloggerCtrl', ['$scope', '$fileLogger', '$interval', '$filter', 'fileloggerService', '$ionicPlatform', '$cordovaFile', '$cordovaFileTransfer', function ($scope, $fileLogger, $interval, $filter, fileloggerService, $ionicPlatform, $cordovaFile, $cordovaFileTransfer) {
    $scope.inputDate = {text: ""};

    fileloggerService.initLogComponent();

    $scope.initLogCurrentDate = function () {
      var currentDate = fileloggerService.getCurrentDate();
      logFileName = currentDate + '.log';
      fileloggerService.setLogLocation(logFileName);
    };

    $scope.initLogCustomDate = function () {
      logFileName = $scope.inputDate.text + '.log';
      fileloggerService.setLogLocation(logFileName);
    };

    $scope.someLog = function () {
      fileloggerService.someLog();
    };

    $scope.viewLog = function () {
      $fileLogger.getLogfile().then(function (l) {
        $fileLogger.log('debug', '--------------------------------------------------');
        $fileLogger.log('debug', 'Begin content of the Log file:');
        $fileLogger.log('debug', '--------------------------------------------------');
        $fileLogger.log('debug', l);
        $fileLogger.log('debug', '--------------------------------------------------');
        $fileLogger.log('debug', 'End content of the Log file:');
        $fileLogger.log('debug', '--------------------------------------------------');
        $scope.viewLogStatus = l;
      });
    };

    $scope.logFileInfo = function () {
      $fileLogger.checkFile().then(function (d) {
        $fileLogger.log('debug', '--------------------------------------------------');
        $fileLogger.log('debug', 'Detail information of Log file:');
        $fileLogger.log('debug', '--------------------------------------------------');
        $fileLogger.log('debug', JSON.stringify(d));
        $fileLogger.log('debug', '--------------------------------------------------');
        $scope.logFileInfoStatus = JSON.stringify(d.localURL);
      });
    };

    $scope.deleteLogFile = function () {
      fileloggerService.deleteLogFile();
    };

    // $interval(function () {
    //   $scope.initLogCurrentDate();
    //   $scope.someLog();
    //   $scope.deleteLogFile();
    // }, 5000);

    $scope.logUpload = function (usernameIn, passwordIn) {
      var user = usernameIn;
      var pass = passwordIn;

      var uri = encodeURI("http://carewheels.cecs.pdx.edu:8080/logupload.php");

      $fileLogger.checkFile().then(function (d) {
        var fileURL = JSON.stringify(d.localURL);
        fileURL = fileURL.replace(/\"+/g, "");
        console.log('debug', "fileURL: ", fileURL);

        var fileNameUp = user + '-' + fileloggerService.getCurrentDateTime() + '.log';
        var options = {
          fileKey: "filetoupload",
          fileName: fileNameUp,
          mimeType: "text/plain",
          params: {'username': user, 'password': pass, 'fileName': fileNameUp}
        };
        var headers = {'headerParam': 'headerValue'};
        options.headers = headers;

        $ionicPlatform.ready(function () {
          $cordovaFileTransfer.upload(uri, fileURL, options).then(function (result) {
            $fileLogger.log('info', "SUCCESS: " + JSON.stringify(result.response));
            $scope.data = JSON.stringify(result.response);

            $fileLogger.log('debug', "Code = " + result.responseCode);
            $fileLogger.log('debug', "Response = " + result.response);
            $fileLogger.log('debug', "Sent = " + result.bytesSent);

            // delete old log file and create a new one
            fileloggerService.deleteLogFile();
            fileloggerService.initLogComponent();
            $fileLogger.info('-----New log file is created!');
          }, function (error) {
            $fileLogger.log('info', "ERROR: " + JSON.stringify(error));
            $scope.data = JSON.stringify(error);

            $fileLogger.log('debug', "An error has occurred!");
            $fileLogger.log('debug', "Code = " + error.code);
            $fileLogger.log('debug', "Error source " + error.source);
            $fileLogger.log('debug', "Error target " + error.target);
          }, function (progress) {
            // PROGRESS HANDLING GOES HERE
          });
        });
      });
    }
  }]);
