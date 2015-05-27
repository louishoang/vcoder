angular.module('myApp', ['ngRoute', 'myApp.controllers'])
  .config(function($routeProvider){
    $routeProvider.when('/', {
      templateUrl: '/templates/dashboard.html',
      controller: 'ClassRoomController'
    })
  .otherwise({redirectTo: '/'});
});
