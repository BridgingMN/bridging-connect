angular
  .module('myApp')
  .factory('AppointmentService', ['$http', 'CONSTANTS', function ($http, CONSTANTS) {
    function Appointment(appointment_type) {
      this.appointment_type = appointment_type;
      this.appointment = {};
    }

    Appointment.prototype.setDeliveryType = function (delivery_method) {
      this.delivery_method = delivery_method;
      return this.delivery_method;
    };

    Appointment.prototype.submitZipCode = function (zip_code) {
      var rulesURL = '/rules/zip/' + zip_code;
      return $http.get(rulesURL).then(returnResponse, returnError);
    };

    Appointment.prototype.getAvailableAppointments = function (min_date, max_date) {
      var params = {
        min_date: min_date,
        max_date: max_date,
        appointment_type: this.appointment_type,
        delivery_method: this.delivery_method,
        location_id: this.location_id
      };
      return $http.get('/appointments/available', {params: params})
        .then(returnResponse, returnError);
    };

    Appointment.prototype.submitAppointment = function (selectedAppointment) {
      this.appointment = selectedAppointment;
      console.log(this);
    };

    Appointment.prototype.createNewAppointment = function (clientReferralForm) {
      console.log('POSTing New Client');
      var appointmentInfo = this.appointment;
      console.log('appointmentInfo', appointmentInfo);
      return $http.post('/clients', {
        params: clientReferralForm
      }).then(function (response) {
        console.log('POSTING new appointment', response);
        return $http.post('/appointments/reserve', {
            client_id: response.data.id,
            appointment_slot_id: appointmentInfo.appointment_slot_id,
            status: 'pending'
        }).then(returnResponse, returnError);
      });
    };

    Appointment.prototype.reserveAppointment = function () {
      var appointmentInfo = this.appointment;
      console.log(this);
      return $http.post('/appointments/reserve', {
        client_id: appointmentInfo.client_id,
        appointment_slot_id: appointmentInfo.appointment_slot_id,
        status: 'pending'
      }).then(returnResponse, returnError);
    };

    return {
      Appointment: Appointment,
      getClientReferralForm: getClientReferralForm,
      getUserAppointments: getUserAppointments,
      cancelAppointment: cancelAppointment,
      updateClientReferallForm: updateClientReferallForm
    };



    function returnResponse(response) {
      console.log('Success', response );
      return response.data;
    }

    function returnError(error) {
      console.log('Error', error);
      return error;
    }

    function getUserAppointments() {
      return $http.get('/appointments/existing')
        .then( returnResponse, returnError);
    }

    function cancelAppointment(appointment_id) {
      var cancelURL = '/appointments/update/' + appointment_id + '/' + CONSTANTS.APPOINTMENT_STATUS_CANCELED;
      return $http.put(cancelURL)
        .then(returnResponse, returnError);
    }

    function getClientReferralForm(client_id) {
      var clientURL = '/clients/' + client_id;
      return $http.get(clientURL)
        .then(returnResponse, returnError);
    }

    function updateClientReferallForm(clientReferralForm) {
      return $http.put('/clients', clientReferralForm)
        .then(returnResponse, returnError);
    }

  }]);
