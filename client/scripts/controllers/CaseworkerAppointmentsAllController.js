/**
 * Controller For caseworker-appointments-all
 * The caseworker homepage
 * @module caseworker/appointments-all
 */

angular
  .module('myApp')
  .controller('CaseworkerAppointmentsAllController', ['AppointmentService', 'UserService', function(AppointmentService, UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  // Binds user data from factory
  vm.user = UserService.userObject;

  // Stores current appointment filter, by default should show all appointments
  vm.appointmentFilter = '';

  // Methods
  vm.getUserAppointments = getUserAppointments;
  vm.setAppointmentFilter = setAppointmentFilter;
  vm.rescheduleAppointment = rescheduleAppointment;
  vm.editAppointmentInfo = editAppointmentInfo;
  vm.deleteAppointment = deleteAppointment;
  vm.showAppointmentDetails = showAppointmentDetails;
  vm.createNewAppointment = createNewAppointment;

  //This is a placeholder, in production appointsments will be an array property on the user object.
  vm.caseworkerAppointments = [
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      loc: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      loc: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      loc: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      loc: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      loc: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      loc: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      loc: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    },
    {
      appointment_date: new Date(),
      delivery_date: new Date(),
      client_first: 'Rodney',
      client_last: 'Toddney',
      client_street: '123 Fake Street',
      appointment_type: 'Shopping',
      loc: 'Bloomington',
      delivery_type: 'Delivery',
      start_time: '9:15 AM'
    }

  ];

  //Setup models
  activate();

  /**
   * Run once upon loading controller, sets up models and other variables used by controller.
   * @function activate
   */
  function activate() {
    // getUserAppointments();
  }


  /**
   * Calls a method of the AppointmentService to GET extant appointment for this caseworker.
   * @function getUserAppointments
   */
  function getUserAppointments() {
    AppointmentService.getUserAppointments().then(
      getAppointmentsSuccess, getAppointmentsError
    );
  }

  function getAppointmentsSuccess(appointments) {
    vm.availableAppointments = appointments;
  }

  function getAppointmentsError(error) {
    console.log(error);
  }

  function setAppointmentFilter(filter) {
    console.log(filter);
    //This function will filter the view to show the desired types of appointments
  }

  function rescheduleAppointment(appointment_id) {
    console.log(appointment_id);
    //This function will redirect the caseworker to a view where they can reschedule their appointment
  }

  function editAppointmentInfo(appointment_id) {
    console.log(appointment_id);
    //This function will redirect the caseworker to a view where they can edit the referall form for their client
  }

  function deleteAppointment(appointment_id) {
    console.log(appointment_id);
    //This function should confirm that the user intends to delete an appointment and then delete that appointment
  }

  function showAppointmentDetails(appointment_id) {
    console.log(appointment_id);
    //This function would show the details for a particular appointment.
  }

  function createNewAppointment() {
    console.log('Resetting Appointment object');
    //This function should call a method in the service that resets the newAppointment object and redirects the caseworker to the new appointment view
  }
}]);
