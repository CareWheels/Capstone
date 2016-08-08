/**
 * CareWheels - Group Status Controller
 *
 */
angular.module('careWheels').controller('groupStatusController',
  function ($scope, $interval, $state, GroupInfo) {

    /* TODO find a better solution */
    // the groupInfo object is not available immediately, spin until available
    var initGroupInfo = setInterval(function(){
      var groupArray = GroupInfo.groupInfo();
      if ( groupArray[0] != null ){
        clearInterval(initGroupInfo);
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

    $scope.group = [
      { // center, self
        username: '',
        credits: "0.0",
        debits: "0.0",
        image: '',
        userSelected: ''
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
      console.log('clicked top left');
      GroupInfo.setMember_new($scope.group[1].username);
      $state.go('app.individualStatus');
    };
    $scope.clickTopRight = function () {
      console.log('clicked top right');
      GroupInfo.setMember_new($scope.group[2].username);
      $state.go('app.individualStatus');
    };
    $scope.clickBottomLeft = function () {
      console.log('clicked bottom left');
      GroupInfo.setMember_new($scope.group[3].username);
      $state.go('app.individualStatus');

    };
    $scope.clickBottomRight = function () {
      console.log('clicked bottom right');
      GroupInfo.setMember_new($scope.group[4].username);
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
