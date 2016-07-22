/**
 * CareWheels - Reminders Controller
 *
 */
// app.controller('TestCtrl2', ['$scope', '$controller', function ($scope, $controller) {
//    var testCtrl1ViewModel = $scope.$new(); //You need to supply a scope while instantiating.
//    //Provide the scope, you can also do $scope.$new(true) in order to create an isolated scope.
//    //In this case it is the child scope of this scope.
//    $controller('TestCtrl1',{$scope : testCtrl1ViewModel });
//    testCtrl1ViewModel.myMethod(); //And call the method on the newScope.
// }]);


app.controller('remindersController', ['$scope', '$controller', function($scope, $controller){
  var notifViewModel = $scope.$new();
  $controller('NotificationController',{$scope : notifViewModel });

  /**
   *  these three reminders are held in an array, below is
   *  the default values for each of the reminders
   *
   * */
  $scope.reminders = [
    {/* Reminder 0 */
      hour: '12',
      min: '0', //leading zeros will automatically be added
      amOrPm: 'AM',
      isOn: true
    },
    {/* Reminder 1 */
      hour: '2',
      min: '30',
      amOrPm: 'PM',
      isOn: true

    },
    {/* Reminder 2 */
      hour: '12',
      min: '0',
      amOrPm: 'AM',
      isOn: true
    }
  ];


  /**
   *  ON/OFF toggle, the toggle returns a true or false value
   * */
  $scope.toggleOnOff = function(index){
    if ($scope.isOnOffToggled == false) {
      $scope.reminders[index].isOn = false;
      $scope.isOnOffToggled = true;
      //console.log("toggle off")
    } else{
      $scope.reminders[index].isOn = true;
      $scope.isOnOffToggled = false;
      //console.log("toggle on");
      sendReminder(index);
    }
  };

  /**
   *  AM/PM toggle, the toggle returns a true or false value
   * */
  $scope.toggleAmPm = function(index){
    if ($scope.isAmPmToggled[index] == false) {
      $scope.reminders[index].amOrPm = 'AM';
      $scope.isAmPmToggled[index] = true;
    } else{
      $scope.reminders[index].amOrPm = 'PM';
      $scope.isAmPmToggled[index] = false;
    }
  };

  /**
   *  this function is used to one leading zero
   *  onto minutes that are less than 10
   * */
  $scope.padZero = function(input) {
    if (input < 10)
      return '0' + input;
    else
      return input
  };

  /** TODO: sendReminder not complete
   *
   * */
  function sendReminder (index) {
    /**
     * wait five seconds before any of the following
     * code is executed
     * */
    setTimeout(function() {
      if($scope.reminders[index].isOn){
        //set the reminder here

      }
    }, 1000 * 5); //5 seconds
  }
}]);
