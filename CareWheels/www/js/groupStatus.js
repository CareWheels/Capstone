/**
 * CareWheels - Group Status Controller
 *
 */
angular.module('careWheels').controller('groupStatusController',
  function ($scope, $interval, $state, GroupInfo) {


    /******************** TESTING *****************************/


    /* TODO find a better solution */
    // the groupInfo object is not available immediately, spin until available
    var triggerGroupInfo = setInterval(function(){
      var groupArray = GroupInfo.groupInfo();
      if ( groupArray[0] != null ){
        clearInterval(triggerGroupInfo);
        console.log(groupArray);
        for (var i = 0; i < groupArray.length; i++){
          $scope.group[i].image = groupArray[i].photoUrl;
          $scope.group[i].username = groupArray[i].username;
        }
      }
    }, 50);

    setInterval(function(){
      var groupArray = GroupInfo.groupInfo();
      for (var i = 0; i < groupArray.length; i ++){
        try{
          var fridgeAlert = groupArray[i].analysisData.fridgeAlertLevel;
          var medsAlert = groupArray[i].analysisData.medsAlertLevel;
          $scope.group[i].status = getAlertColor(fridgeAlert, medsAlert);
        }
        catch(Exception) {
          $scope.group[i].status = 'blue';
        }
      }
    }, 50);


    function getAlertColor(fridge, meds){
      fridge = parseInt(fridge);
      meds = parseInt(meds);
      if (fridge == 3 || meds == 3)
        return 'red';
      else if (fridge == 2 || meds == 2)
        return 'yellow';
      else
        console.log('blue alert');
        return 'blue';
    }



    /************** END TEST BLOCK ***************************/

    /* TODO: this is currently mocked data */
    $scope.group = [
      { // center, self
        username: '',
        credits: "0.0",
        debits: "0.0",
        image: ''
      },
      { // top left
        username: '',
        status: '',
        image: ''
      },
      { // top right
        username: '',
        status: '',
        image: ''
      },
      { // bottom left
        username: '',
        status: '',
        image: ''
      },
      { // bottom right
        username: '',
        status: '',
        image: ''
      }
    ];

    /* click/press events */
    $scope.clickTopLeft = function () {
      //todo: goto individualStatus.html for this user
      console.log('clicked top left');
      $state.go('app.individualStatus');
      var groupArray = GroupInfo.groupInfo();
      console.log('GroupInfo:', groupArray);
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
