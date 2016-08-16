/**
 * CareWheels - Group Status Controller
 *
 */
angular.module('careWheels').controller('groupStatusController',
  function ($scope, $interval, $state, $ionicPopup, GroupInfo, User, PaymentService) {

    var groupArray = GroupInfo.groupInfo();

    // the groupInfo object is not available immediately, spin until available
    var initGroupInfo = setInterval(function () {
      var groupArray = GroupInfo.groupInfo();
      //console.log(groupArray);
      if (groupArray[0] != null) {
        clearInterval(initGroupInfo);
        // app on load
        console.log('hit group controller');
        getLoggedInUser(groupArray);
        setGroupArray(groupArray);
      }
    }, 50);

    /** automatically go through each user square, and
     *  find each 'red' alert, and fade that element in
     *  and out. (flashing effect)
     * */
    $interval(function () {
      /* jQuery element to fade in and out */
      var alertArray = [
        $('#topLeftAlert'),
        $('#topRightAlert'),
        $('#bottomLeftAlert'),
        $('#bottomRightAlert')
      ];
      for (var i = 0; i < alertArray.length; i++) {
        if (alertArray[i].css('background-color') === 'rgb(255, 0, 0)') {
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
        displayedError: false,
        selfUserIndex: 0

      },
      { // top left @ index 1
        name: '',
        username: '',
        status: '',
        image: '',
        alertLevelColor: '',
        error: false
      },
      { // top right @ index 2
        name: '',
        username: '',
        status: '',
        image: '',
        alertLevelColor: '',
        error: false
      },
      { // bottom left @ index 3
        name: '',
        username: '',
        status: '',
        image: '',
        alertLevelColor: '',
        error: false
      },
      { // bottom right @ index 4
        name: '',
        username: '',
        status: '',
        image: '',
        alertLevelColor: '',
        error: false
      }
    ];


    /* click/press events */
    $scope.clickTopLeft = function () {
      clickUser(1);
    };
    $scope.clickTopRight = function () {
      clickUser(2);
    };
    $scope.clickBottomLeft = function () {
      clickUser(3);
    };
    $scope.clickBottomRight = function () {
      clickUser(4);
    };
    $scope.clickCenter = function () {
    };
    $scope.clickCareBank = function () {
    };

    // console.log("Calling memberSummary Payment:");
    // PaymentService.memberSummary(1.0);

    // lets figure out which user logged in at this point
    function getLoggedInUser(groupInfo) {
      var user = User.credentials();
      // error unable to load user object;
      if (user == null)
        $scope.group[0].selfUserIndex = 0;
      // loop through the groupInfo array to find the user who
      // logged in.
      for (var i = 0; i < groupInfo.length; i++) {
        if (user.username == $scope.group[i].username)
          $scope.group[0].selfUserIndex = i; // gotcha!
      }
      $scope.group[0].selfUserIndex = 0; //error, user not found
    }


    // now lets set the scope variables for all the page views.
    function setGroupArray(groupArray) {
      var loggedInUserIndex = $scope.group[0].selfUserIndex;

      // first lets set the group up, at index 1-4
      for (var i = 1; i < 5; i++) {
        if (i != $scope.group[0].selfUserIndex) {
          $scope.group[i].image = groupArray[i].photoUrl;
          $scope.group[i].username = groupArray[i].username;
          $scope.group[i].name = groupArray[i].name;

          try {
            var fridgeAlert = groupArray[i].analysisData.fridgeAlertLevel;
            var medsAlert = groupArray[i].analysisData.medsAlertLevel;
            $scope.group[i].status = $scope.getAlertColor(fridgeAlert, medsAlert, i);
          }
          catch (Exception) {
            $scope.group[i].status = 'grey';
            $scope.group[i].error = true;
          }
          // on the last element of the loop, now check health
          if (i == groupArray.length - 1) {
            if(!GroupInfo.getSensorError())
            $scope.checkGroupHealth();
          }
        }

      }
      // sweet, next lets set the data for the user that logged in,
      // this is reserved at index zero.
      $scope.group[0].image = groupArray[loggedInUserIndex].photoUrl;
      $scope.group[0].username = groupArray[loggedInUserIndex].username;
      $scope.group[0].name = groupArray[loggedInUserIndex].name;
      $scope.group[0].balance = trimZeros(groupArray[0].balance);
    }


    //removes insignificant zeros
    function trimZeros(input) {
      var number = parseFloat(input);
      return number.toString();

    }


    function clickUser(index) {
      if (!$scope.group[index].error) {
        PaymentService.sensorDataView(0.1, $scope.group[index].alertLevelColor);
        $scope.group[0].userSelected = $scope.group[index].name;
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
      alertPopup.then(function (res) {

      });
    }


    /**
     * returns a string of of the color code depending on the
     * alert level. This string is used with ng-class, to
     * append the color class onto the div
     * */
    $scope.getAlertColor = function (fridgeAlert, medsAlert, index) {

      // check for null params
      if (fridgeAlert == null || medsAlert == null)
        return '';

      var fridge = parseInt(fridgeAlert);
      var meds = parseInt(medsAlert);
      var alertString = '';

      // check for acceptable bounds
      if (meds < 0 || meds > 2 || fridge < 0 || fridge > 2)
        alertString = ''; // error state
      // check for null
      else if (fridge == 2 || meds == 2){
        alertString = 'red';
        $scope.group[index].alertLevelColor = 'red';
      }
      else if (fridge == 1 || meds == 1){
        alertString = 'yellow';
        $scope.group[index].alertLevelColor = 'yellow';
      }
      else if (fridge == 0 || meds == 0){
        alertString = 'blue';
        $scope.group[index].alertLevelColor = 'blue';
      }

      return alertString;
    };

    $scope.checkGroupHealth = function () {
      //create a template string
      var errorList = [];
      var errorCount = 0;
      for (var i = 1; i < $scope.group.length; i++) {
        if ($scope.group[i].error) {
          errorCount++;
          errorList.push(String($scope.group[i].name));
        }
        // on the last element now
        if (i == $scope.group.length - 1) {
          // no errors? then return
          if (errorCount == 0){
            GroupInfo.setSensorError(false);
            return true;
          }


          // error found! set the error variable
          if(errorCount > 0)
            GroupInfo.setSensorError(true);

          //lets craft up a string to be displayed
          var errorString = '';
          for (var j = 0; j < errorList.length; j++) {
            errorString += errorList[j];
            if (j < errorList.length - 2)
              errorString += ', ';
            else if (j == errorList.length - 2)
              errorString += ' and ';
            else if (j == errorList.length - 1) {
              // were done, display error message now
              if (!$scope.group[0].displayedError) {
                $scope.group[0].displayedError = true;
                displayError(errorString);
              }

            }
          }
        }
      }
    };

  });
