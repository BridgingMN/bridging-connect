myApp.controller('CaseworkerAppointmentSchedule', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var self = this;
  self.myDate = new Date();
  console.log(self.currentDate);

  self.minDate = new Date(
    self.myDate.getFullYear(),
    self.myDate.getMonth() - 1,
    self.myDate.getDate()
  );

  self.maxDate = new Date(
    self.myDate.getFullYear(),
    self.myDate.getMonth() + 1,
    self.myDate.getDate()
  );

  self.onlyMonToThursPredicate = function(date) {
    var day = date.getDay();
    return day === 1 || day === 2 || day === 3 || day === 4;
  };



  self.appointmentSlots = ['9:15 AM', '10:30 AM'];
  self.selectedAppointment = self.appointmentSlots[0];

}]);
