describe('User factory', function() {

    var User;

    beforeEach(module('careWheels'));

    beforeEach(inject(function(_User_) {
        User = _User_;
    }));

    it('should exist', function() {
        expect(User).toBeDefined();
    });

    describe('credentials()', function() {
        it ('should exist', function() {
            expect(User.credentials).toBeDefined();
        });
    });
});