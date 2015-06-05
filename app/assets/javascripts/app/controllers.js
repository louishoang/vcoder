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
               ["$scope"
              ,function($scope){
    $scope.notifications = [{
      type: "Annoucement",
      message: "Welcome to VCoder DashBoard"
    },
    {
      type: "General",
      message: "You have one message from Louis Hoang"
    }];
  }])
  .controller("StudentsController",
             ["$scope", "Student", function($scope, Student){

    $scope.sortType = "email";
    $scope.sortReverse = false;
    $scope.searchTerm = '';
    $scope.itemsPerPage = 5;
    $scope.currentPage = 0;

    $scope.prevPage = function() {
      if ($scope.currentPage > 0) {
        $scope.currentPage--;
      }
    };

    $scope.nextPage = function() {
      if ($scope.currentPage < $scope.pageCount - 1){
        $scope.currentPage++;
      }
    };

    $scope.getPageCount = function(){
      var array = new Array();
      for(i = 1; i <= $scope.pageCount; i ++){
        array.push(i);
      }
      return array;
    };

    $scope.startFrom = function(){
      return $scope.itemsPerPage * $scope.currentPage;
    };

    $scope.setPage = function(n){
      $scope.currentPage = n - 1;
    };

    $scope.$watch('currentPage', function(){
      $scope.startFrom = $scope.itemsPerPage * $scope.currentPage;
    });

    Student.index(function(resp){
      $scope.students = resp.students;
      $scope.pageCount = $scope.students.length % $scope.itemsPerPage;
    });

    $scope.student = {name: "", email: "", password:"changeme", cohort: ""};

    $scope.newStudent = function(){
      Student.create($scope.student);
      $scope.students.push($scope.student);
    };

  }]);
