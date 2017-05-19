angular
  .module('myApp')
  .controller('CaseworkerAppointmentScheduleController', ['$location', 'UserService', function($location, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this;
  vm.appointment = UserService.newAppointment;

  //Model for the currently selected date
  vm.selectedDate = new Date();

  //placeholder appointments
  vm.availableAppointments = [{
    date: new Date(
      vm.selectedDate.getFullYear(),
      vm.selectedDate.getMonth(),
      vm.selectedDate.getDate() + 4)
  },{
    date: new Date(
      vm.selectedDate.getFullYear(),
      vm.selectedDate.getMonth(),
      vm.selectedDate.getDate() + 4)
  },
  {
    date: new Date(
      vm.selectedDate.getFullYear(),
      vm.selectedDate.getMonth(),
      vm.selectedDate.getDate() + 5)
  }];

  //Limits for the range of dates on the calendar
  vm.minDate = new Date(
    vm.selectedDate.getFullYear(),
    vm.selectedDate.getMonth(),
    vm.selectedDate.getDate() + 3
  );
  vm.maxDate = new Date(
    vm.selectedDate.getFullYear(),
    vm.selectedDate.getMonth() + 1,
    vm.selectedDate.getDate()
  );

  //Model for the available appointment slots
  vm.appointmentSlots = [];

  //Model for the selected appointment slot
  vm.selectedAppointment = vm.appointmentSlots[0];

  //methods
  vm.onlyMonToThursPredicate = onlyMonToThursPredicate;
  vm.selectDate = selectDate;
  vm.submit = submit;

  // getAvailableAppointments(vm.minDate, vm.maxDate);

  function onlyMonToThursPredicate (date) {
    console.log(date);
    return vm.availableAppointments.some(filterAppointmentsByDate, date);
  }

  //When the caseworker selects a date this function should update the view to show available appointsments for that day
  function selectDate(date) {
    console.log(date);
    vm.selectedDate = date;
    vm.appointmentSlots = vm.availableAppointments.filter(filterAppointmentsByDate, date);
    vm.selectedAppointment = vm.appointmentSlots[0];
  }
  //This function should call a method from the service that reserves the selected appointment slot on the selected date and then redirects the caseworker to the Client Referral Form
  function submit() {
    console.log(vm.selectedAppointment);
    UserService.newAppointment.submitAppointment(vm.selectedAppointment);
    $location.path('/caseworker-appointment-form');
  }

  //Sends a request to the server to get available appointments.
  function getAvailableAppointments(min_date, max_date) {
    UserService.newAppointment.getAvailableAppointments(min_date, max_date)
      .then(availableAppointmentsSuccess, availableAppointmentsError);
  }

  //Called upon receiving an array of available Appointment objects
  //Updates the view to reflect available Appointments
  //Sets the currently selected Appointment to the first appointment in the array
  function availableAppointmentsSuccess(response) {
    vm.availableAppointments = response;
    selectDate(vm.availableAppointments[0].date);
  }

  function availableAppointmentsError(error) {
    console.error(error);
  }

  function filterAppointmentsByDate(appointment) {
    var date = this;
    return compareDates(appointment.date, date);
  }

  //format dates and compare them
  function compareDates(date1, date2) {
    date1 = moment(date1).format('YYYY-MM-DD');
    date2 = moment(date2).format('YYYY-MM-DD');
    return moment(date1).isSame(date2);
  }


}]);
