/**
 * Created by asakawa on 8/14/16.
 */
describe('Notifications -', function() {

  var notifs = '';
  var defaultNotif = [
    {hours: 10, minutes: 0, seconds: 0, on: true},
    {hours: 14, minutes: 0, seconds: 0, on: true},
    {hours: 19, minutes: 0, seconds: 0, on: true}
  ];

  beforeEach(module('careWheels'));

  beforeEach(inject(function(_notifications_) {
    notifs = _notifications_;
  }));

  it('Delete_Reminders():', function() {
    notifs.Delete_Reminders();
    var data = angular.fromJson(window.localStorage['Reminders']);
    expect(data).toBe(null);
  });

  it('Init_Notifs():', function() {
    notifs.Init_Notifs();
    var data = angular.fromJson(window.localStorage['Reminders']);
    expect(data).toBeDefined();
    expectDefaultValues(data);
  });

/*  describe('Create_Notif():', function() {
    notifs.Create_Notif(10, 5, 0, true, 1);//hours, minutes, seconds, isOn, reminderNum
    it('verify data', function(){
      var data = angular.fromJson(window.localStorage['Reminders']);
      expect(data).toBeDefined();
      expect(data[0].hours).toBe(10);
      expect(data[0].minutes).toBe(5);
      expect(data[0].on).toBe(true);
    });
  });*/

  function expectDefaultValues(data) {
    for (var i=0; i<3; i++){
      expect(data[i].hours).toBe(defaultNotif[i].hours);
      expect(data[i].minutes).toBe(defaultNotif[i].minutes);
      expect(data[i].on).toBe(defaultNotif[i].on);
    }
  }

});
