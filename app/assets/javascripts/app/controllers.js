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
               ["$scope", "FirebaseAnnouncement"
              ,function($scope, FirebaseAnnouncement){
    // Use for dashboard
    $scope.notifications = FirebaseAnnouncement.announcements;
  }])
  .controller("StudentsController",
             ["$scope", "Student", "PaginationService", "Cohort",
              function($scope, Student, PaginationService, Cohort){

    PaginationService($scope, 'Student');
    // Student resources
    Student.index(function(resp){
      $scope.students = resp.students;
      $scope.pageCount = Math.ceil($scope.students.length / $scope.itemsPerPage);
    });

    $scope.student = {name: "", email: "", password:"changeme",
                      cohort_id: "", is_active: ""};

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

    //Cohort resources
    Cohort.index(function(resp){
      $scope.cohorts = resp.cohorts;
    });

    $scope.showAddNewCohort = false;

    $scope.revealAddNewCohort = function(){
      $scope.showAddNewCohort = !$scope.showAddNewCohort;
    }

  }])
  .controller("AnnouncementController",
             ["$scope", "Announcement", "FirebaseAnnouncement",
              function($scope, Announcement, FirebaseAnnouncement){
    // admin section only
    $scope.announcement = {content: "", type: "Announcement"}
    $scope.announcements = FirebaseAnnouncement.announcements;

    $scope.newAnnouncement = function(){
      FirebaseAnnouncement.saveAnnouncement($scope.announcement);
      Announcement.create($scope.announcement, function(resp){
        if(resp.success){
          toastr.success(resp.success);
        }else{
          toastr.error(resp.error);
        }
      });
    };

    $scope.removeAnnouncement = function(announcement){
      FirebaseAnnouncement.removeAnnouncement(announcement);
    };
  }]);
