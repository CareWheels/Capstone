/**
 * CareWheels - Group Status Controller
 *
 */


angular.module('careWheels', ['ionic', 'ngAnimate'])
  .controller('groupStatusController', function ($scope, $interval) {

/*    $interval(function ( ){
      console.log("interval hit");
      $scope.getElementById('.topLeftRed').style.display = "absolute";
      return true;
    }, 1000);*/


    $scope.group = {
      username: 'test01',
      profilePic: 'url',
      credits: "0.0",
      debits: "0.0",

      /* User Group */
      /* TODO: this is currently mocked data */
      topLeft: {
        username: 'yoda',
        profilePic: 'url',
        status: 'deepskyblue'
      },
      topRight: {
        username: 'yoda',
        profilePic: 'url',
        status: 'deepskyblue'
      },
      bottomLeft: {
        username: 'obi-wan',
        profilePic: 'url',
        status: 'yellow'
      },
      bottomRight: {
        username: 'emperor',
        profilePic: 'url',
        status: 'red'
      }
    };

    /* click/press events */
    $scope.clickTopLeft = function () {
      //todo: goto individualStatus.html for this user
      console.log('clicked top left');
    };
    $scope.clickTopRight = function () {
      console.log('clicked top right');
    };
    $scope.clickBottomLeft = function () {
      console.log('clicked bottom left');
    };
    $scope.clickBottomRight = function () {
      console.log('clicked bottom right');
    };
    $scope.clickCenter = function () {
      console.log('clicked center');
    };
    $scope.clickCareBank = function () {
      console.log('clicked carebank');
    };

    function memberAlert(position, color) {
      switch (position) {
        case 0:
        case 1:
        case 2:
        case 3:
      }
    }


  });


/*
*
*   .animation('.flashAlert',[function(){
 return {
 event: function(element, done){
 console.log("animation hit");
 jQuery(element).fadeIn(500);
 setInterval(function(){
 jQuery(element).fadeOut(500);
 jQuery(element).fadeIn(500);
 }, 2500);
 done();
 }
 }
 }]);
*
*
*
* */
