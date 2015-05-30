angular.module('myApp.controllers',[])
  .controller('ClassRoomController', function($scope, SessionService){
    $scope.user = SessionService.currentUser.user;
});
