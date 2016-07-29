/**
 * CareWheels - Individual Status Controller
 *
 */
angular.module('careWheels')

.controller('individualStatusController', function($scope){

  $scope.getPings = function(time, type) {
    switch(time) {
    case 'midnight':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "* * * * * *";
        }
        //code block
        //break;
    case 'one':
        //Do the same here
        break;
    default:
        return 'error';
    }
    //if ( === 3){
    //  return "* * *";
    //}
    //else {
    //  return "boo";
    //}
  }

  $scope.trevor = {
    name: 'Trevor',
    midnight: {
      presence: {
        status: 'yellow'
      },
      meals: {
        status: 'yellow',
        pings: ''
      },
      meds: {
      	status: 'yellow',
        //pings = $scope.getPings(3)
        pings: ''
      }
    },
    one: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'yellow',
        pings: ''
      },
      meds: {
      	status: 'blue',
        pings: ''
      }
    },
    two: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'yellow',
        pings: ''
      },
      meds: {
      	status: 'blue',
        pings: ''
      }
    },
    three: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue',
        pings: '* *'
      },
      meds: {
      	status: 'blue',
        pings: ''
      }
    },
    four: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue',
        pings: '* * *'
      },
      meds: {
      	status: 'blue',
        pings: ''
      }
    },
    five: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue',
        pings: ''
      },
      meds: {
      	status: 'red',
        pings: ''
      }
    },
    six: {
      presence: {
        status: 'grey'
      },
      meals: {
        status: 'blue',
        pings: ''
      },
      meds: {
      	status: 'red',
        pings: ''
      }
    },
    seven: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue',
        pings: '*'
      },
      meds: {
      	status: 'blue',
        pings: '*'
      }
    },
    eight: {
      presence: {
        status: ''
      },
      meals: {
        status: '',
        pings: ''
      },
      meds: {
      	status: '',
        pings: ''
      }
    },
    nine: {
      presence: {
        status: ''
      },
      meals: {
        status: '',
        pings: ''
      },
      meds: {
      	status: '',
        pings: ''
      }
    },
    ten: {
      presence: {
        status: ''
      },
      meals: {
        status: '',
        pings: ''
      },
      meds: {
      	status: '',
        pings: ''
      }
    },
    eleven: {
      presence: {
        status: ''
      },
      meals: {
        status: '',
        pings: ''
      },
      meds: {
      	status: '',
        pings: ''
      }
    },
    twelve: {
      presence: {
        status: ''
      },
      meals: {
        status: '',
        pings: ''
      },
      meds: {
      	status: '',
        pings: ''
      }
    }
  };
});
