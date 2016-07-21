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
  $scope.reminders = {
    hour: '0',
    min: '00',
    amOrPm: 'AM'
  }

}]);
