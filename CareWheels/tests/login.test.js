describe('User factory', function() {

  var User;
  var ionicPopupMock;
  var deferredLogin;

  beforeEach(module('careWheels'));

  beforeEach(inject(function(_User_, $q) {
    User = _User_;
  }));

  describe('call login', function() {
    it('should call login function', function() {
      data = null;
      data = User.login('testbilly', 'testbilly', false);
      expect(data).not.toBe(null);
    });
  });

  describe('Login Success', function() {
    it('should call login and return data', function() {
      User.login('testbilly', 'testbilly', true);
      var data = angular.fromJson(window.localStorage['loginCredentials']);
      expect(data).not.toBe(null);
    });
  });

  describe('Login failed', function() {
    it('should call login and fail.', function() {
      User.login('testbilly', 'teastbilly', true);
      var data = angular.fromJson(window.localStorage['loginCredentials'] || null);
      expect(data).toBe(null);
    });
  })
}); 
