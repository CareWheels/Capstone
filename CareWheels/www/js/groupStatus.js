/**
 * CareWheels - Group Status Controller
 *
 */

angular.module('careWheels')

  .controller('groupStatusController', function ($scope, $interval) {

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
        username: 'mace windu',
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



    /** automatically go through each user square, and
     *  find each 'red' alert, and fade that element in
     *  and out. (flashing effect)
     * */
    $interval(function (){
      var alertArray = [
        $('#topLeftAlert'),
        $('#topRightAlert'),
        $('#bottomLeftAlert'),
        $('#bottomRightAlert')
      ];
      for(var i =0; i < alertArray.length; i++){
        if(alertArray[i].css('background-color') === 'rgb(255, 0, 0)'){
          alertArray[i].fadeOut("slow");
          alertArray[i].fadeIn("slow");
        }
      }
    }, 2000)

  });
