/**
 * CareWheels - Group Status Controller
 *
 */
angular.module('careWheels').controller('groupStatusController',
  function ($scope, $interval, $state, GroupInfo) {


    /******************** TESTING *****************************/
      //var usergroup = $scope.data = angular.fromJson(window.localStorage['UserGroup']);
    var user = window.localStorage['loginCredentials'];
    console.log('logged in as', user);
    var groupArray = GroupInfo.groupInfo();
    console.log('GroupInfo:', groupArray);


    /************** END TEST BLOCK ***************************/

    /* TODO: this is currently mocked data */
    $scope.group = {
      /* self */
      username: 'test01',
      profilePic: 'url',
      credits: "0.0",
      debits: "0.0",
      image: '',

      /* User Group */

      topLeft: {
        username: 'yoda',
        profilePic: 'url',
        status: 'deepskyblue',
        image: ''
      },
      topRight: {
        username: 'mace windu',
        profilePic: 'url',
        status: 'deepskyblue',
        image: ''
      },
      bottomLeft: {
        username: 'obi-wan',
        profilePic: 'url',
        status: 'yellow',
        image: ''
      },
      bottomRight: {
        username: 'emperor',
        profilePic: 'url',
        status: 'red',
        image: ''
      }
    };

    /* click/press events */
    $scope.clickTopLeft = function () {
      //todo: goto individualStatus.html for this user
      console.log('clicked top left');
      $state.go('app.individualStatus');
    };
    $scope.clickTopRight = function () {
      console.log('clicked top right');
      $state.go('app.individualStatus');

    };
    $scope.clickBottomLeft = function () {
      console.log('clicked bottom left');
      $state.go('app.individualStatus');

    };
    $scope.clickBottomRight = function () {
      console.log('clicked bottom right');
      $state.go('app.individualStatus');

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
