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


app.controller('remindersController', ['$scope', '$controller', '$ionicPopup', function($scope, $controller, $ionicPopup){
  var notifViewModel = $scope.$new();
  var restViewModel = $scope.$new();
  $controller('NotificationController',{$scope : notifViewModel });
  $controller('ReminderRestController',{$scope : restViewModel });
  /**
   *  these three reminders are held in an array, below is
   *  the default values for each of the reminders
   *
   * */
  $scope.reminders = [
    {/* Reminder 0 */
      hour: notifViewModel.data[0].hours,
      min: notifViewModel.data[0].minutes, //leading zeros will automatically be added
      amOrPm: 'AM',
      isOn: notifViewModel.data[0].on
    },
    {/* Reminder 1 */
      hour: notifViewModel.data[1].hours,
      min: notifViewModel.data[1].minutes,
      amOrPm: 'AM',
      isOn: notifViewModel.data[1].on

    },
    {/* Reminder 2 */
      hour: notifViewModel.data[2].hours,
      min: notifViewModel.data[2].minutes,
      amOrPm: 'AM',
      isOn: notifViewModel.data[2].on
    }
  ];

  for(i=0; i<3; ++i){
    if($scope.reminders[i].hour>12){
      $scope.reminders[i].hour -= 12;
      $scope.reminders[i].amOrPm = 'PM';
    }
  }
  /**
   * PLEASE NOTE: these next 6 functions can be consolidated
   * into just two functions, by using an array of booleans
   * and passing an index as a parameter for the following
   * functions. I attempted to code this, however
   * I kept getting naming conflict errors with the toggle
   * booleans.
   * */

  /** REMINDER 0: ON/OFF toggle **/
  $scope.toggleOnOff_0 = function(){
    if ($scope.isOnOffToggled_0 == false) {
      $scope.reminders[0].isOn = false;
      $scope.isOnOffToggled_0 = true;
    } else{
      $scope.reminders[0].isOn = true;
      $scope.isOnOffToggled_0 = false;
    }
  };
  /** REMINDER 0: AM/PM toggle **/
  $scope.toggleAmPm_0 = function(){
    if ($scope.isAmPmToggled_0 == false) {
      $scope.reminders[0].amOrPm = 'AM';
      $scope.isAmPmToggled_0 = true;
    } else{
      $scope.reminders[0].amOrPm = 'PM';
      $scope.isAmPmToggled_0 = false;
    }
  };

  /** REMINDER 1: ON/OFF toggle **/
  $scope.toggleOnOff_1 = function(){
    if ($scope.isOnOffToggled_1 == false) {
      $scope.reminders[1].isOn = false;
      $scope.isOnOffToggled_1 = true;
    } else{
      $scope.reminders[1].isOn = true;
      $scope.isOnOffToggled_1 = false;
    }
  };
  /** REMINDER 1: AM/PM toggle **/
  $scope.toggleAmPm_1 = function(){
    if ($scope.isAmPmToggled_1 == false) {
      $scope.reminders[1].amOrPm = 'AM';
      $scope.isAmPmToggled_1 = true;
    } else{
      $scope.reminders[1].amOrPm = 'PM';
      $scope.isAmPmToggled_1 = false;
    }
  };

  /** REMINDER 2 : ON/OFF toggle **/
  $scope.toggleOnOff_2 = function(){
    if ($scope.isOnOffToggled_2 == false) {
      $scope.reminders[2].isOn = false;
      $scope.isOnOffToggled_2 = true;
    } else{
      $scope.reminders[2].isOn = true;
      $scope.isOnOffToggled_2 = false;
    }
  };
  /** REMINDER 2: AM/PM toggle **/
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

  $scope.confirmReset = function() {
     var confirmPopup = $ionicPopup.confirm({
       title: 'Reset',
       template: 'Are you sure you want to reset all Reminders to their times?'
     });
   
     confirmPopup.then(function(res) {
       if(res) {
        //Delete old reminder files and reset to default
        notifViewModel.Delete_Reminders();
        notifViewModel.Init_Notifs();

        //Reset Cyclos fields to default
        var rem1 = notifViewModel.Reminder_As_String(0);
        var rem2 = notifViewModel.Reminder_As_String(1);
        var rem3 = notifViewModel.Reminder_As_String(2);
        console.log("rem1="+rem1+" rem2="+rem2+" rem3="+rem3);
        restViewModel.fetch('test', 'test123', 'test', rem1, rem2, rem3);   //TODO: update with real credentials!
       } else {
         console.log('Reset canceled!');
       }
     });
   };

  /** TODO: sendReminder not complete
   *
   * */
  // function sendReminder (index) {
  //   /**
  //    * wait five seconds before any of the following
  //    * code is executed
  //    * */
  //   console.log("send Reminder hit for reminder#:" + index);
  //   setTimeout(function() {
  //     //pre-process to Notification format

  //     //update Notification component's memory and local reminder times
  //     var myHours = $scope.reminders[index].hour;
  //     if($scope.reminders[index].amOrPm == 'PM') myHours = parseInt(myHours)+12;
  //     notifViewModel.Create_Notif(myHours, $scope.reminders[index].min, 0, $scope.reminders[index].isOn, index+1);
  //     console.log(myHours + ":" + $scope.reminders[index].min + ":" + 0 + " " + $scope.reminders[index].isOn + index);

  //     //update Cyclos server's reminder fields
  //     if($scope.reminders[0].isOn){

  //     } else rem1 = '';
  //     if($scope.reminders[0].isOn){

  //     } else rem2 = '';
  //     if($scope.reminders[0].isOn){

  //     } else rem3 = '';
  //     //restViewModel.fetch('test', 'test123', 'test', rem1, rem2, rem3);    //TODO: update with real credentials below
  //     //restViewModel.fetch(userIn, passIn, toUpdate, rem1, rem2, rem3);
  //   }, 1000 * 5); //5 seconds
  // }
    /** TODO: sendReminder not complete
   *
   * */
  $scope.saveReminders = function() {
    //update Notification component's memory and local reminder times
    for(var index=0; index<3; ++index){
      var myHours = $scope.reminders[index].hour;
      if($scope.reminders[index].amOrPm == 'PM') myHours = parseInt(myHours)+12;
      notifViewModel.Create_Notif(myHours, $scope.reminders[index].min, 0, $scope.reminders[index].isOn, index+1);
      console.log(myHours + ":" + $scope.reminders[index].min + ":" + 0 + " " + $scope.reminders[index].isOn + index);
    }
    
    //update Cyclos server's reminder fields
    if($scope.reminders[0].isOn){
      var rem1 = notifViewModel.Reminder_As_String(0);
    } else rem1 = '';
    if($scope.reminders[0].isOn){
      var rem2 = notifViewModel.Reminder_As_String(1);
    } else rem2 = '';
    if($scope.reminders[0].isOn){
      var rem3 = notifViewModel.Reminder_As_String(2);
    } else rem3 = '';
    console.log("rem1="+rem1+" rem2="+rem2+" rem3="+rem3);
    restViewModel.fetch('test', 'test123', 'test', rem1, rem2, rem3);   //TODO: update with real credentials!
  }
}]);
