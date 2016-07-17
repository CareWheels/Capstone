angular.module('fileloggermodule', ['ionic', 'fileLogger'])
  .service('fileloggerService', function ($fileLogger, $filter) {
    var logFileName = "localLogFile.txt";

    this.setLogLocation = function (fileName) {
      $fileLogger.setStorageFilename(fileName);
      console.log('Current log file: ' + fileName);
    };

    this.getCurrentDate = function () {
      var today = new Date();
      var formattedDate = $filter('date')(today, 'yyyy-MM-dd');
      return formattedDate;
    };

    this.getLogFileName = function () {
      var currentDate = this.getCurrentDate();
      logFileName = currentDate + '.txt';
      return logFileName;
    };

    this.initLogComponent = function () {
      this.setLogLocation(this.getLogFileName());
      $fileLogger.setTimestampFormat('medium');
    };

    this.someLog = function () {
      $fileLogger.log('debug', 'log from cybertron');
      $fileLogger.log('info', 'log from cybertron');
    };

    this.deleteLogFile = function () {
      $fileLogger.deleteLogfile().then(function () {
        console.log('The log file \"' + logFileName + '\" is deleted!');
      });
    };
  })
  .controller('fileloggerCtrl', ['$scope', '$fileLogger', '$interval', '$filter', 'fileloggerService', function ($scope, $fileLogger, $interval, $filter, fileloggerService) {
    $scope.inputDate = {text: ""};

    fileloggerService.initLogComponent();

    $scope.initLogCurrentDate = function () {
      var currentDate = fileloggerService.getCurrentDate();
      logFileName = currentDate + '.txt';
      fileloggerService.setLogLocation(logFileName);
    };

    $scope.initLogCustomDate = function () {
      logFileName = $scope.inputDate.text + '.txt';
      fileloggerService.setLogLocation(logFileName);
    };

    $scope.someLog = function () {
      $fileLogger.log('debug', 'message');
      $fileLogger.log('info', 'message');
      $fileLogger.log('warn', 'message');
      $fileLogger.log('error', 'message');

      $fileLogger.debug('message');
      $fileLogger.info('message');
      $fileLogger.warn('message');
      $fileLogger.error('message');

      $fileLogger.log('error', 'error message', {code: 1, meaning: 'general'});

      $fileLogger.log('info', 'message', 123, [1, 2, 3], {a: 1, b: '2'});
    };

    $scope.viewLog = function () {
      $fileLogger.getLogfile().then(function (l) {
        console.log('--------------------------------------------------');
        console.log('Content of the Log file:');
        console.log('--------------------------------------------------');
        console.log(l);
        $scope.viewLogStatus = l;
        console.log('--------------------------------------------------');
      });
    };

    $scope.logFileInfo = function () {
      $fileLogger.checkFile().then(function (d) {
        console.log('--------------------------------------------------');
        console.log('Detail information of Log file:');
        console.log('--------------------------------------------------');
        console.log(JSON.stringify(d));
        console.log('--------------------------------------------------');
        $scope.logFileInfoStatus = JSON.stringify(d);
      });
    };

    $scope.deleteLogFile = function () {
      fileloggerService.deleteLogFile();
    };

    $interval(function () {
      $scope.initLogCurrentDate();
      $scope.someLog();
      $scope.deleteLogFile();
    }, 5000);
  }]);
