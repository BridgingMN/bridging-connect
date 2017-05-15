angular
  .module('myApp')
  .controller('CaseworkerAppointmentScheduleController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this;
  vm.myDate = new Date();
  console.log(vm.currentDate);

  vm.minDate = new Date(
    vm.myDate.getFullYear(),
    vm.myDate.getMonth() - 1,
    vm.myDate.getDate()
  );

  vm.maxDate = new Date(
    vm.myDate.getFullYear(),
    vm.myDate.getMonth() + 1,
    vm.myDate.getDate()
  );

  vm.onlyMonToThursPredicate = function(date) {
    var day = date.getDay();
    return day === 1 || day === 2 || day === 3 || day === 4;
  };



  vm.appointmentSlots = ['9:15 AM', '10:30 AM'];
  vm.selectedAppointment = vm.appointmentSlots[0];

}]);
