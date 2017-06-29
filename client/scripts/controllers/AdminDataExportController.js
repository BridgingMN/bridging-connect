angular
  .module('myApp')
  .controller('AdminDataExportController', ['UserService', function(UserService) {
  // DATA-BINDING VARIABLES
  var vm = this; // controller reference

  vm.appointmentCSV = UserService.appointmentCSV;
  console.log('AdminDataExport controller loaded.');
  vm.appointmentCSV();
}]);