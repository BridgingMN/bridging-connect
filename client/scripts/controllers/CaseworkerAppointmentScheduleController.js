angular
  .module('myApp')
  .controller('CaseworkerAppointmentScheduleController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this;

  //Model for the appointment info header
  vm.appointment = {

  };

  //Model for the currently selected date
  vm.myDate = new Date();

  //Limits for the range of dates on the calendar
  vm.minDate = new Date(
    vm.myDate.getFullYear(),
    vm.myDate.getMonth(),
    vm.myDate.getDate() + 3
  );
  vm.maxDate = new Date(
    vm.myDate.getFullYear(),
    vm.myDate.getMonth() + 1,
    vm.myDate.getDate()
  );

  //Model for the available appointment slots
  vm.appointmentSlots = ['9:15 AM', '10:30 AM'];

  //Model for the selected appointment slot
  vm.selectedAppointment = vm.appointmentSlots[0];

  //methods
  vm.onlyMonToThursPredicate = onlyMonToThursPredicate;
  vm.selectDate = selectDate;
  vm.submit = submit;






  function onlyMonToThursPredicate (date) {
    var day = date.getDay();
    return day === 1 || day === 2 || day === 3 || day === 4;
  }

  function selectDate(date) {
    console.log(date);
    //When the caseworker selects a date this function should update the view to show available appointsments for that day
  }

  function submit(date, appointmentSlot) {
    console.log(date, appointmentSlot);
    //This function should call a method from the service that reserves the selected appointment slot on the selected date and then redirects the caseworker to the Client Referral Form
  }

}]);
