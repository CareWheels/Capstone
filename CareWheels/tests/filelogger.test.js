describe('Logging Service', function () {
  var BASE_URL_in;
  var fileLogger_in;
  var filter_in;
  var ionicPlatform_in;
  var cordovaFile_in;
  var cordovaFileTransfer_in;
  var fileloggerService_in;
  var mockFileLogger;

  // load the module for our app
  beforeEach(
    module('careWheels')
  );
  beforeEach(function () {
    mockFileLogger = {
      setStorageFilename: jasmine.createSpy(),
      log: jasmine.createSpy(),
      deleteLogfile: jasmine.createSpy()
    };
    module(function ($provide) {
      $provide.value('$fileLogger', mockFileLogger);
    });
  });
  beforeEach(
    inject(function (BASE_URL, $fileLogger, $filter, $ionicPlatform, $cordovaFile, $cordovaFileTransfer, fileloggerService) {
      BASE_URL_in = BASE_URL;
      fileLogger_in = $fileLogger;
      filter_in = $filter;
      ionicPlatform_in = $ionicPlatform;
      cordovaFile_in = $cordovaFile;
      cordovaFileTransfer_in = $cordovaFileTransfer;
      fileloggerService_in = fileloggerService;
    })
  );

  it("should save log to local", function () {
    var logFileName = "localLogFile.log";
    fileloggerService_in.setLogLocation(logFileName);
    expect(mockFileLogger.setStorageFilename).toHaveBeenCalledWith(logFileName);
  });

  it("should get current date", function () {
    var today = new Date();
    var currentDate = filter_in('date')(today, 'yyyy-MM-dd');
    var result = fileloggerService_in.getCurrentDate();
    expect(currentDate).toEqual(result);
  });

  it("should get log file name", function () {
    var currentDate = fileloggerService_in.getCurrentDate();
    var logFileName = currentDate + '.log';
    var result = fileloggerService_in.getLogFileName();
    expect(logFileName).toEqual(result);
  });

  it("should generate some logs", function () {
    fileloggerService_in.someLog();
    expect(mockFileLogger.log).toHaveBeenCalled();
  })
});
