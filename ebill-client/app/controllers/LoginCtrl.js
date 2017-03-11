myApp.controller('LoginCtrl', ['$rootScope', '$scope', '$location', 'LoginService', function ($rootScope, $scope, $location, LoginService) {
  
  $rootScope.loggedUser = null;

  $scope.login = function() {
    /*LoginService.login($scope.loginUsername, $scope.loginPassword, function(user) {
      $rootScope.loggedUser = user;
      resetForm();
      $location.path('/welcome_logged');
    }, function() {
      alert('Unsuccesful login');
    });*/
    $rootScope.loggedUser = {username: 'testUser'};
    $location.path('/bills');
  };

  $scope.logout = function() {
    $rootScope.loggedUser = null;
    LoginService.logout();
    $location.path('/welcome');
  };

  $scope.isUserLogged = function() {
    return $rootScope.loggedUser !== null;
  }

  $scope.isAdminLogged = function() {
    return LoginService.isAdmin($rootScope.loggedUser);
  };

  $scope.isActive = function (viewLocation) {
     var active = (viewLocation === $location.path());
     return active;
  };

  var resetForm = function() {
    $scope.loginUsername = "";
    $scope.loginPassword = "";
    $scope.loginForm.$setPristine();
    $scope.loginForm.$setUntouched();
  }
}]);
