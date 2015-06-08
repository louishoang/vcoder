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
      $scope.user.role = resp.role;
      $scope.isAdmin = function(){
        return $scope.user.role == "Admin";
      }
    });
  }])
  .controller('ClassRoomController',
                 ["$scope", "SessionService", "$route",
                  function($scope, SessionService, $routes){
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
             ["$scope", "Student", "PaginationService",
              function($scope, Student, PaginationService){

    PaginationService($scope, 'Student');

    Student.index(function(resp){
      $scope.students = resp.students;
      $scope.pageCount = Math.ceil($scope.students.length / $scope.itemsPerPage);
    });

    $scope.student = {name: "", email: "", password:"changeme",
                      cohort: "", is_active: ""};

    $scope.newStudent = function(){
      Student.create($scope.student, function(resp){
        if(resp.success){
          toastr.success(resp.success);
          $scope.students.push(resp.student);
        }else{
          toastr.error(resp.error);
        }
      });
    };

    $scope.changeStatus = function(stud){
      Student.update(stud);
    };

  }])
  .controller("AnnouncementController",
             ["$scope", "Announcement",
              function($scope, Announcement){
    $scope.announcement = {content: "", type: "Announcement"}

    $scope.newAnnouncement = function(){
      Announcement.create($scope.announcement, function(resp){
        if(resp.success){
          toastr.success(resp.success);
          // $scope.students.push(resp.student);
        }else{
          toastr.error(resp.error);
        }
      });
    };
  }]);
