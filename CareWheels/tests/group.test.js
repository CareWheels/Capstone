/**
 * Created by asakawa on 8/11/16.
 */
describe('groupStatusController', function() {
  var groupScope, createController;

  beforeEach(inject(function ($rootScope, $scope, $controller, $state) {
    groupScope = $rootScope.$new();

    createController = function() {
      return $controller('groupStatusController', {
        '$scope': groupScope,
        '$state': 'app.groupStatus'
      });
    };
  }));

  it('check alert colors', function() {
    var controller = createController();
    //$state.go('app.groupStatus');
  });

/*  it('check alert colors', function() {
    var groupController = createController();

    expect(groupController.getAlertColor(2, 1)).toBe('red');
    //scope.path('/groupStatus');
    //expect(scope.path()).toBe('/groupStatus');
/!*    expect(scope.isActive('/about')).toBe(true);
    expect(scope.isActive('/contact')).toBe(false);*!/
  });*/
});
