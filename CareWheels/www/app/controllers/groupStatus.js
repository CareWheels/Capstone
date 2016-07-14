/**
 * CareWheels - Group Status Controller
 *
 */

angular.module('careWheels', []).controller('groupStatusController', function($scope){
  $scope.group = {
    username:'test01',
    topLeft:{
      /*user params, picture, statusColor, etc*/
    },
    topRight:{},
    bottomLeft:{},
    bottomRight:{},
    center:{},
    credits: "0.0",
    debits: "0.0"
  };

  /* click/press events */
  $scope.clickTopLeft = function(){
    //todo: goto individualStatus.html for this user
    console.log('clicked top left');
  };
  $scope.clickTopRight = function(){
    console.log('clicked top right');
  };
  $scope.clickBottomLeft = function(){
    console.log('clicked bottom left');
  };
  $scope.clickBottomRight = function(){
    console.log('clicked bottom right');
  };
  $scope.clickCenter = function(){
    console.log('clicked center');
  };
  $scope.clickCareBank = function(){
    console.log('clicked carebank');
  };

});
