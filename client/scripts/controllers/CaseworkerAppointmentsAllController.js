/**
 * Controller For caseworker-appointments-all
 * The caseworker homepage
 * @module caseworker/appointments-all
 */

angular
  .module('myApp')
  .controller('CaseworkerAppointmentsAllController', ['$mdToast', '$mdDialog', 'AppointmentService', 'UserService', function($mdToast, $mdDialog, AppointmentService, UserService) {
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
  vm.confirmCancelAppointment = confirmCancelAppointment;
  vm.showAppointmentDetails = showAppointmentDetails;
  vm.createNewAppointment = createNewAppointment;


  //This is a placeholder, in production appointsments will be an array property on the user object.
  vm.caseworkerAppointments = [
    {
      id: 1,
      client: {
        first: 'Rod',
        last: 'Todd'
      },
      info: {
        appointment_date: new Date(),
        delivery_date: new Date(),
        appointment_type: 'Shopping',
        loc: {
          location: 'Bloomington'
        },
        delivery_type: 'Delivery',
        start_time: '9:15 AM'
      }
    },
    {
      id: 1,
      client: {
        first: 'Rod',
        last: 'Todd'
      },
      info: {
        appointment_date: new Date(),
        delivery_date: new Date(),
        appointment_type: 'Shopping',
        loc: {
          location: 'Bloomington'
        },
        delivery_type: 'Delivery',
        start_time: '9:15 AM'
      }
    },
  ];

  //Setup models
  activate();

  /**
   * Run once upon loading controller, sets up models and other variables used by controller.
   * @function activate
   */
  function activate() {
    getUserAppointments();
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
    vm.caseworkerAppointments = appointments;
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

  function confirmCancelAppointment(appointment) {
    var confirm = $mdDialog.confirm()
      .title('Cancel Appointment')
      .textContent('Are you sure you want to cancel this ' + appointment.info.appointment_type +
                    ' appointment for your client ' + appointment.client.first + ' ' +
                     appointment.client.last + ' on ' + appointment.info.date + '?')
      .ariaLabel('Cancel Appointment')
      .ok('Yes, cancel the appointment')
      .cancel('No, do not cancel the appointment');

    $mdDialog.show(confirm)
      .then(function () {
        cancelAppointment(appointment);
      });
  }

  function cancelAppointment(appointment) {
    AppointmentService.cancelAppointment(appointment.id)
    .then(showToastSuccess, showToastError);
  }

  function showToastSuccess (text) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(text)
        .hideDelay(3000)
    );
  }

  function showToastError (text) {
    $mdToast.show(
      $mdToast.simple()
        .textContent(text)
        .hideDelay(3000)
    );
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
