angular
  .module('myApp', ['ngRoute', 'ngMaterial', 'md.data.table'])
  .config(['$locationProvider', '$mdThemingProvider', '$routeProvider', config]);
// -----ROUTES-----
function config($locationProvider, $mdThemingProvider, $routeProvider) {
  $locationProvider.hashPrefix('');
  $routeProvider
    .when('/login', {
      templateUrl: '/views/templates/login.html',
      controller: 'LoginController',
      controllerAs: 'vm'
    })
    .when('/register', {
      templateUrl: '/views/templates/register.html',
      controller: 'RegisterController',
      controllerAs: 'vm'
    })
    .when('/forgotpassword', {
       templateUrl: '/views/templates/forgot.html',
       controller: 'PasswordResetController',
       controllerAs: 'vm'
     })
     .when('/updatepassword/:code/:email/:type', {
       templateUrl: '/views/templates/confirm.html',
       controller: 'PasswordResetController',
       controllerAs: 'vm',
     })
    .when('/user', {
      templateUrl: '/views/templates/user.html',
      controller: 'UserController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-pending', {
      templateUrl: '/views/templates/admin-appointments-pending.html',
      controller: 'AdminAppointmentsPendingController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-all', {
      templateUrl: '/views/templates/admin-appointments-all.html',
      controller: 'AdminAppointmentsAllController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointment-review', {
      templateUrl: '/views/templates/admin-appointment-review.html',
      controller: 'AdminAppointmentReviewController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-default', {
      templateUrl: '/views/templates/admin-appointments-default.html',
      controller: 'AdminAppointmentsDefaultController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-default-appointment-new', {
      templateUrl: '/views/templates/admin-default-appointment-new.html',
      controller: 'AdminDefaultAppointmentNewController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-default-edit', {
      templateUrl: '/views/templates/admin-default-edit.html',
      controller: 'AdminDefaultEditController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-customize', {
      templateUrl: '/views/templates/admin-appointments-customize.html',
      controller: 'AdminAppointmentsCustomizeController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-schedule-override-new', {
      templateUrl: '/views/templates/admin-schedule-override-new.html',
      controller: 'AdminScheduleOverrideNewController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-appointments-export', {
      templateUrl: '/views/templates/admin-appointments-export.html',
      controller: 'AdminAppointmentsExportController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-caseworker-overview', {
      templateUrl: '/views/templates/admin-caseworker-overview.html',
      controller: 'AdminCaseworkerOverviewController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-caseworker-new', {
      templateUrl: '/views/templates/admin-caseworker-new.html',
      controller: 'AdminCaseworkerNewController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-caseworker-edit', {
      templateUrl: '/views/templates/admin-caseworker-edit.html',
      controller: 'AdminCaseworkerEditController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-caseworker-import', {
      templateUrl: '/views/templates/admin-caseworker-import.html',
      controller: 'AdminCaseworkerImportController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-agency-overview', {
      templateUrl: '/views/templates/admin-agency-overview.html',
      controller: 'AdminAgencyOverviewController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-agency-new', {
      templateUrl: '/views/templates/admin-agency-new.html',
      controller: 'AdminAgencyNewController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/admin-agency-edit', {
      templateUrl: '/views/templates/admin-agency-edit.html',
      controller: 'AdminAgencyEditController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-new', {
      templateUrl: '/views/templates/caseworker-appointment-new.html',
      controller: 'CaseworkerAppointmentNewController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-location', {
      templateUrl: '/views/templates/caseworker-appointment-location.html',
      controller: 'CaseworkerAppointmentLocationController',
      controllerAs: 'vm',
      // resolve: { // get user from factory
      //   getuser : ['UserService', function(UserService){
      //     return UserService.getUser();
      //   }]
      // }
    })
    .when('/caseworker-appointment-zipcode', {
      templateUrl: '/views/templates/caseworker-appointment-zipcode.html',
      controller: 'CaseworkerAppointmentZipcodeController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-schedule', {
      templateUrl: '/views/templates/caseworker-appointment-schedule.html',
      controller: 'CaseworkerAppointmentScheduleController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-reschedule', {
      templateUrl: '/views/templates/caseworker-appointment-reschedule.html',
      controller: 'CaseworkerAppointmentRescheduleController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-form', {
      templateUrl: '/views/templates/caseworker-appointment-form.html',
      controller: 'CaseworkerAppointmentFormController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointment-edit-form', {
      templateUrl: '/views/templates/caseworker-appointment-edit-form.html',
      controller: 'CaseworkerAppointmentEditFormController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .when('/caseworker-appointments-all', {
      templateUrl: '/views/templates/caseworker-appointments-all.html',
      controller: 'CaseworkerAppointmentsAllController',
      controllerAs: 'vm',
      resolve: { // get user from factory
        getuser: ['UserService', function(UserService) {
          return UserService.getUser();
        }]
      }
    })
    .otherwise({
      redirectTo: 'login'
    });
  $mdThemingProvider.definePalette('accent', {
    '50': 'fff2ec',
    '100': 'fedecf',
    '200': 'fdc8b0',
    '300': 'fcb290',
    '400': 'fca278',
    '500': 'fb9160',
    '600': 'fa8958',
    '700': 'fa7e4e',
    '800': 'f97444',
    '900': 'f86233',
    'A100': 'f86233',
    'A200': 'f86233',
    'A400': 'ffe0d7',
    'A700': 'ffccbe',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': [
      '50',
      'A400',
      'A700'
    ],
    'contrastLightColors': [
      '100',
      '200',
      '300',
      '400',
      '500',
      '600',
      '700',
      '800',
      '900',
      'A100',
      'A200'
    ]
  });
  $mdThemingProvider.definePalette('primary', {
    '50': 'eaf7f9',
    '100': 'ccecef',
    '200': 'aae0e4',
    '300': '87d3d9',
    '400': '54c0c9',
    '500': '54c0c9',
    '600': '4dbac3',
    '700': '43b2bc',
    '800': '3aaab5',
    '900': '299ca9',
    'A100': 'eafdff',
    'A200': 'b7f7ff',
    'A400': '84f2ff',
    'A700': '6aefff',
    'contrastDefaultColor': 'light',
    'contrastDarkColors': [
      '50',
      '100',
      '600',
      '700',
      '800',
      'A100'
    ],
    'contrastLightColors': [
      '200',
      '300',
      '400',
      '500',
      '900',
      'A200',
      'A400',
      'A700'
    ]
  });
  $mdThemingProvider.theme('default')
    .primaryPalette('primary')
    .accentPalette('accent');
}
