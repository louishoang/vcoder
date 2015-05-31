angular.module('myApp.controllers',[])
  .controller('pageslideCtrl',
              ['$scope',
              function($scope){
    $scope.checked = false; // This will be binded using the ps-open attribute
    $scope.toggle = function(){
      $scope.checked = !$scope.checked
    }
  }])
  .controller('ClassRoomController',
                 ["$scope", "SessionService",
                  function($scope, SessionService){
    $scope.user = SessionService.currentUser.user;
  }])
  .controller("NotificationController",
               ["$scope", "$firebase"
              ,function($scope, $firebase){
    $scope.notifications = [{
      type: "Annoucement",
      message: "Welcome to VCoder DashBoard"
    },
    {
      type: "General",
      message: "You have one message from Louis Hoang"
    }];
  }]);
