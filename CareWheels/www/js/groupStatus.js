/**
 * CareWheels - Group Status Controller
 *
 */
angular.module('careWheels').controller('groupStatusController',
  function ($scope, $interval, $state, $ionicPopup, GroupInfo) {

    /* TODO find a better solution */
    // the groupInfo object is not available immediately, spin until available
    var initGroupInfo = setInterval(function(){
      var groupArray = GroupInfo.groupInfo();
      if ( groupArray[0] != null ){
        clearInterval(initGroupInfo);
        for (var i = 0; i < groupArray.length; i++){
          $scope.group[i].image = groupArray[i].photoUrl;
          $scope.group[i].username = groupArray[i].username;
          $scope.group[i].name = groupArray[i].name;
        }
      }
    }, 50);

    $interval(function(){
      var groupArray = GroupInfo.groupInfo();
      for (var i = 1; i < groupArray.length; i ++){
        try{
          var fridgeAlert = groupArray[i].analysisData.fridgeAlertLevel;
          var medsAlert = groupArray[i].analysisData.medsAlertLevel;
          $scope.group[i].status = $scope.getAlertColor(fridgeAlert, medsAlert);
        }
        catch(Exception) {
          $scope.group[i].status = 'grey';
          $scope.group[i].error = true;
        }
        // on the last element of the loop, now check health
        if (i == groupArray.length - 1){
          checkGroupHealth();
        }
      }
    }, 100);

    /** automatically go through each user square, and
     *  find each 'red' alert, and fade that element in
     *  and out. (flashing effect)
     * */
    $interval(function (){
      /* jQuery element to fade in and out */
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
    }, 2000);


    $scope.group = [
      { // center, self
        name: '',
        username: '',
        balance: '0.0',
        image: '',
        userSelected: '',
        displayedError: false

      },
      { // top left
        name: '',
        username: '',
        status: '',
        image: '',
        error: false
      },
      { // top right
        name: '',
        username: '',
        status: '',
        image: '',
        error: false
      },
      { // bottom left
        name: '',
        username: '',
        status: '',
        image: '',
        error: false
      },
      { // bottom right
        name: '',
        username: '',
        status: '',
        image: '',
        error: false
      }
    ];

    /* click/press events */
    $scope.clickTopLeft     = function () { clickUser(1); };
    $scope.clickTopRight    = function () { clickUser(2); };
    $scope.clickBottomLeft  = function () { clickUser(3); };
    $scope.clickBottomRight = function () { clickUser(4); };
    $scope.clickCenter      = function () {};
    $scope.clickCareBank    = function () {};




    function clickUser(index){
      if(!$scope.group[index].error){
        GroupInfo.setMember_new($scope.group[index].username);
        $state.go('app.individualStatus');
      }
    }

    // An error popup dialog
    function displayError(errorString) {
      var alertPopup = $ionicPopup.alert({
        title: '<div class="errorTitle">Unable to load sensor data for:</div>',
        template: '<div class="errorTemplate">' + errorString + '</div>',
        buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
          text: 'Okay',
          type: 'button-calm'
        }]
      });
      alertPopup.then(function(res) {

      });
    }


    /**
     * returns a string of of the color code depending on the
     * alert level. This string is used with ng-class, to
     * append the color class onto the div
     * */
    $scope.getAlertColor = function(fridge, meds){
      fridge = parseInt(fridge);
      meds = parseInt(meds);

      if (fridge == 2 || meds == 2)
        return 'red';
      else if (fridge == 1 || meds == 1)
        return 'yellow';
      else if (fridge == 0 || meds == 0)
        return 'blue';
      else
      // error
        return '';
    }

    function checkGroupHealth(){
      //create a template string
      var errorList = [];
      var errorCount = 0;
      for (var i = 1; i < $scope.group.length; i ++){
        if ($scope.group[i].error){
          errorCount++;
          errorList.push(String($scope.group[i].name));
        }
        // on the last element now
        if (i == $scope.group.length - 1){
          // no errors? then return
          if (errorCount == 0)
            return true;

          //lets craft up a string to be displayed
          var errorString = '';
          for (var j= 0; j < errorList.length; j++){
            errorString += errorList[j];
            if (j < errorList.length - 2)
              errorString += ', ';
            else if (j == errorList.length - 2)
              errorString += ' and ';
            else if (j == errorList.length - 1){
              // were done, display error message now
              if(!$scope.group[0].displayedError){
                $scope.group[0].displayedError = true;
                displayError(errorString);
              }

            }
          }
        }
      }
    }

  });
