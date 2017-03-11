myApp.controller('SignupCtrl', ['$rootScope', '$scope', '$http', 'LoginService', function SignupCtrl($rootScope, $scope, $http, LoginService) {
  $scope.signup = function() {
    $http({
      method: 'POST',
      url: '/api/register',
      data: {
        username: $scope.username,
        password: $scope.password    
      }
    }).then(function success(response) {
      console.log('User ' + $scope.username + ' created');
      LoginService.login($scope.username, $scope.password, function (user) {
        // Log in user
        $rootScope.loggedUser = user; 
        resetForm();
      }, function() {
        // User nog logged
        console.log('Unable to log user ' + $scope.username);
      });
    }, function (response) {
      $scope.signupForm.username.$error.taken = true;
    });
  };

  var resetForm = function() {
    $scope.username = "";
    $scope.password = "";
    $scope.password2 = "";
    $scope.signupForm.$setPristine();
    $scope.signupForm.$setUntouched();
  }
}]);
