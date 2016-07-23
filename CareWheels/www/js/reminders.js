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
      amOrPm: 'PM',
      isOn: false
    },
    {/* Reminder 1 */
      hour: '2',
      min: '30',
      amOrPm: 'AM',
      isOn: true

    },
    {/* Reminder 2 */
      hour: '12',
      min: '0',
      amOrPm: 'AM',
      isOn: true
    }
  ];

  /** ON/OFF toggle **/
  $scope.toggleOnOff_0 = function(){
    if ($scope.isOnOffToggled_0 == false) {
      $scope.reminders[0].isOn = false;
      $scope.isOnOffToggled_0 = true;
    } else{
      $scope.reminders[0].isOn = true;
      $scope.isOnOffToggled_0 = false;
      sendReminder(0);
    }
  };
  /** AM/PM toggle **/
  $scope.toggleAmPm_0 = function(){
    if ($scope.isAmPmToggled_0 == false) {
      $scope.reminders[0].amOrPm = 'AM';
      $scope.isAmPmToggled_0 = true;
    } else{
      $scope.reminders[0].amOrPm = 'PM';
      $scope.isAmPmToggled_0 = false;
    }
  };


  /** ON/OFF toggle **/
  $scope.toggleOnOff_1 = function(){
    if ($scope.isOnOffToggled_1 == false) {
      $scope.reminders[1].isOn = false;
      $scope.isOnOffToggled_1 = true;
    } else{
      $scope.reminders[1].isOn = true;
      $scope.isOnOffToggled_1 = false;
      sendReminder(1);
    }
  };
  /** AM/PM toggle **/
  $scope.toggleAmPm_1 = function(){
    if ($scope.isAmPmToggled_1 == false) {
      $scope.reminders[1].amOrPm = 'AM';
      $scope.isAmPmToggled_1 = true;
    } else{
      $scope.reminders[1].amOrPm = 'PM';
      $scope.isAmPmToggled_1 = false;
    }
  };


  /** ON/OFF toggle **/
  $scope.toggleOnOff_2 = function(){
    if ($scope.isOnOffToggled_2 == false) {
      $scope.reminders[2].isOn = false;
      $scope.isOnOffToggled_2 = true;
    } else{
      $scope.reminders[2].isOn = true;
      $scope.isOnOffToggled_2 = false;
      sendReminder(2);

    }
  };
  /** AM/PM toggle **/
  $scope.toggleAmPm_2 = function(){
    if ($scope.isAmPmToggled_2 == false) {
      $scope.reminders[2].amOrPm = 'AM';
      $scope.isAmPmToggled_2 = true;
    } else{
      $scope.reminders[2].amOrPm = 'PM';
      $scope.isAmPmToggled_2 = false;
    }
  };



  /**
   * function for ng-checked, returns a true if set at PM
   * or a false if set to AM */
  $scope.isPM = function(element){
    return element == 'PM';
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
    console.log("send Reminder hit for reminder#:" + index);
    setTimeout(function() {

      if($scope.reminders[index].isOn){
        //set the reminder here
        console.log("ship it!");
      }
      else
        console.log("REVERT!!!")
    }, 1000 * 5); //5 seconds
  }
}]);
