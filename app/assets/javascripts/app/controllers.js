angular.module("myApp.controllers",[])
  .controller("pageslideCtrl",
              ["$scope", "SessionService",
              function($scope, SessionService){
    $scope.checked = false; // This will be binded using the ps-open attribute
    $scope.toggle = function(){
      $scope.checked = !$scope.checked
    };
    $scope.user = null;
    SessionService.getCurrentUser().then(function(resp){
      $scope.user = resp.user;
      $scope.isAdmin = function(){
        return $scope.user.role == "Admin";
      }
    });
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
  }])
  .controller("StudentsController", ["$scope", function($scope){
    $scope.students = ["Louis", "Emy", "Money"];
  }]);
