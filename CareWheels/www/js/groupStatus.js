/**
 * CareWheels - Group Status Controller
 *
 */

angular.module('careWheels')
  .controller('groupStatusController',
    function ($scope, $interval, $state, $http, $log, $httpParamSerializerJQLike) {


    /******************** TESTING *****************************/
    //var usergroup = $scope.data = angular.fromJson(window.localStorage['UserGroup']);
    //console.log(usergroup);
    $scope.url = 'https://carebank.carewheels.org:8443/userandgroupmemberinfo.php';
    $scope.fetch = function(userIn, passIn, tofindIn) {
      $scope.code = null;
      $scope.response = null;
      $http({
        url:$scope.url,
        method:'POST',    //all our custom REST endpoints have been designed to use POST
        data: $httpParamSerializerJQLike({    //serialize the parameters in the way PHP expects
          username:userIn,
          password:passIn,
          usernametofind:tofindIn
        }),
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'   //make Angular use the same content-type header as PHP
        }
      }).then(function(response) {    //the old $http success/error methods have been depricated; this is the new format
        $scope.status = response.status;
        $scope.data = response.data;
      }, function(response) {
        $scope.data = response.data || "Request failed";
        $scope.status = response.status;
        if(response.status!=200){
          $log.warn($scope.data);
        }
      });
    };

    var groupObject = $scope.fetch('chris', 'locked', 'bill');
      console.log($scope.data);
    setTimeout(function(){
      console.log($scope.data[0].photoUrl); //bill
      console.log($scope.data[1].photoUrl); //spoke 1
      console.log($scope.data[2].photoUrl); //spok2
      console.log($scope.data[3].photoUrl);
      console.log($scope.data[4].photoUrl);
    },8 * 1000); //10 seconds

    /************** END TEST BLOCK ***************************/

      /* TODO: this is currently mocked data */
    $scope.group = {
      /* self */
      username: 'test01',
      profilePic: 'url',
      credits: "0.0",
      debits: "0.0",
      image: 'https://carebank.carewheels.org/content/images/user/Ihbek3YWQT9emA9WrSYtEMk52CT67DhJXGatPyz7FUwpnKa11202OP2yzHN1nINg_960x504.jpeg',

      /* User Group */

      topLeft: {
        username: 'yoda',
        profilePic: 'url',
        status: 'deepskyblue',
        image: 'https://carebank.carewheels.org/content/images/user/KDRtBlv3CU08ChlLj2GRcUKL6bQUIaZmK4g2pMXHaUCiMPzM82Q9nRNxrhhtTt7r_755x960.jpeg'
      },
      topRight: {
        username: 'mace windu',
        profilePic: 'url',
        status: 'deepskyblue',
        image: 'https://carebank.carewheels.org/content/images/user/fzlb11HIhMn3OliPz0JIMHyhfq1GJGCZOB2kOXRldLzVxmDvf3ZlpAdmFlFlkNj7_626x352.png'
      },
      bottomLeft: {
        username: 'obi-wan',
        profilePic: 'url',
        status: 'yellow',
        image: 'https://carebank.carewheels.org/content/images/user/Ikaudj0wmpc4Nqu4ttbnfvTqULE6qpSg6iV8eF9YEcgq1d72Idf2w9kWFO9V29Uk_280x280.png'
      },
      bottomRight: {
        username: 'emperor',
        profilePic: 'url',
        status: 'red',
        image: 'https://carebank.carewheels.org/content/images/user/ZLZubMNFK3b9RGbGetCLgrlOksvsaLEe1OVIK68FJDOv0EXjDGSyo7lZWS9x0T59_960x480.jpeg'
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
