/**
 * Created by asakawa on 8/14/16.
 */
describe('Notifications -', function() {

  var notifs = '';
  var data = '';
  var defaultNotif = [
    {hours: 10, minutes: 0, seconds: 0, on: true},
    {hours: 14, minutes: 0, seconds: 0, on: true},
    {hours: 19, minutes: 0, seconds: 0, on: true}
  ];

  beforeEach(module('careWheels'));

  beforeEach(inject(function(_notifications_) {
    notifs = _notifications_;
  }));

  it('Init_Notifs():', function() {
    notifs.Init_Notifs();

    expect(User.credentials).toBeDefined();
  });

  describe('getData():', function() {
    var data = notifs.getData();
    console.log(data);

    expect(data[0].hours).toBe(10);
    expect(data[0].minutes).toBe(0);
    expect(data[0].on).toBe(true);

  });

  it('Create_Notif():', function() {
    //notifs.Create_Notif();
  });

  it('Delete_Reminders():', function() {
    notifs.Delete_Reminders();
  });

  it('Toggle_Off_Notif():', function() {
    //notifs.Toggle_Off_Notif();
  });

  it('Notifs_Status():', function() {
    //notifs.Notifs_Status();
  });

  it('Reminder_As_String():', function() {
    //notifs.Reminder_As_String();
  });


});
