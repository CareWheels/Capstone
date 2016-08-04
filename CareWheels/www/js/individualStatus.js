/**
 * CareWheels - Individual Status Controller
 *
 */
angular.module('careWheels')

.controller('individualStatusController', function($scope, GroupInfo){

  var analysis = GroupInfo.retrieveAnalyzedGroup();

  // This is simply a way to print out the analyzed object so that I can figure out how
  // to use it. It will print on the bottom of the Individual Status Page of the app.
  // To get rid of it, comment it out in individualStatus.html.
  $scope.testAnalysis = function() {
    var test = analysis;
    return test;
  }

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
    case 'one':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'two':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'three':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "* *";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'four':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "* * *";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'five':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'six':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'seven':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "*";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "*";
        }
    case 'eight':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'nine':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'ten':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'eleven':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'twelve':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'thirteen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'fourteen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'fifteen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'sixteen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'seventeen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'eighteen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'nineteen':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'twenty':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'twentyone':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'twentytwo':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    case 'twentythree':
        if (type === 'meals'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
        else if (type === 'meds'){
          //This is where you put the function call to get the pings for this time.
          return "";
        }
    default:
        return 'error';
    }
  };

  $scope.getPresence = function(time) {
    switch(time) {
    case 'midnight':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'one':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'two':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'three':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'four':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'five':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'six':
        //This is where you put the function call to get the presence for this time.
        return "grey";
    case 'seven':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'eight':
        //This is where you put the function call to get the presence for this time.
        return "grey";
    case 'nine':
        //This is where you put the function call to get the presence for this time.
        return "grey";
    case 'ten':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'eleven':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'twelve':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'thirteen':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'fourteen':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'fifteen':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'sixteen':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'seventeen':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'eighteen':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'nineteen':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'twenty':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'twentyone':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'twentytwo':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    case 'twentythree':
        //This is where you put the function call to get the presence for this time.
        return "blue";
    default:
        return 'error';
    }
  };


  $scope.trevor = {
    name: 'Kylo',
    midnight: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'yellow'
      },
      meds: {
      	status: 'blue'
      }
    },
    one: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'yellow'
      },
      meds: {
      	status: 'blue'
      }
    },
    two: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'yellow'
      },
      meds: {
      	status: 'blue'
      }
    },
    three: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
      	status: 'blue'
      }
    },
    four: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
      	status: 'blue'
      }
    },
    five: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
      	status: 'red'
      }
    },
    six: {
      presence: {
        status: 'grey'
      },
      meals: {
        status: 'blue'
      },
      meds: {
      	status: 'red'
      }
    },
    seven: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
      	status: 'blue'
      }
    },
    eight: {
      presence: {
        status: 'grey'
      },
      meals: {
        status: 'blue'
      },
      meds: {
      	status: 'blue'
      }
    },
    nine: {
      presence: {
        status: 'grey'
      },
      meals: {
        status: 'blue'
      },
      meds: {
      	status: 'blue'
      }
    },
    ten: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
      	status: 'blue'
      }
    },
    eleven: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
      	status: 'blue'
      }
    },
    twelve: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
      	status: 'blue'
      }
    },
    thirteen: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
        status: 'blue'
      }
    },
    fourteen: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
        status: 'blue'
      }
    },
    fifteen: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
        status: 'blue'
      }
    },
    sixteen: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
        status: 'blue'
      }
    },
    seventeen: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
        status: 'blue'
      }
    },
    eighteen: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
        status: 'blue'
      }
    },
    nineteen: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
        status: 'blue'
      }
    },
    twenty: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
        status: 'blue'
      }
    },
    twentyone: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
        status: 'blue'
      }
    },
    twentytwo: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
        status: 'blue'
      }
    },
    twentythree: {
      presence: {
        status: 'blue'
      },
      meals: {
        status: 'blue'
      },
      meds: {
        status: 'blue'
      }
    }
  };
});
