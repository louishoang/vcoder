angular.module('myApp',
               ['ngRoute',
               'ngResource',
               'myApp.controllers',
               'myApp.services',
               'myApp.filters',
               'myApp.directives',
               'pageslide-directive',
               'ng-rails-csrf'])
  .config(function($routeProvider){
    $routeProvider.when('/', {
      templateUrl: '/templates/dashboard.html',
      controller: 'ClassRoomController',
      resolve: {
        session: function(SessionService){
          return SessionService.getCurrentUser();
        }
      }
    })
    .when('/students', {
      templateUrl: '/templates/admin/student.html',
      controller: 'StudentsController'
    })
    .when('/announcements', {
      templateUrl: '/templates/admin/announcement.html',
      controller: 'AnnouncementController'
    })
  .otherwise({redirectTo: '/'});
});
