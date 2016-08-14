/**
 * Created by asakawa on 8/14/16.
 */
describe('Notifications -', function() {

  var notifs = '';
  var data = '';

  beforeEach(module('careWheels'));

  beforeEach(inject(function(_notifications_) {
    notifs = _notifications_;
  }));

  it('Init_Notifs():', function() {
    notifs.Init_Notifs();
  });

  it('getData():', function() {
    notifs.getData();
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
