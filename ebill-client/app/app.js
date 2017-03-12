var myApp = angular.module('myApp', ['ngMessages', 'ngRoute', 'ngTouch'], function ($httpProvider, $routeProvider) {
  // Set HTTP headers 
  $httpProvider.defaults.headers.common = {"Access-Control-Request-Headers": "accept, origin, authorization"};
  $httpProvider.defaults.headers.common = {"Access-Control-Allow-Origin": "*"}
  $httpProvider.defaults.headers.common = {"Access-Control-Expose-Headers": "Origin, X-Requested-With, Content-Type, Accept"};
  $httpProvider.defaults.headers.common["Cache-Control"] = "no-cache";
  $httpProvider.defaults.headers.common.Pragma = "no-cache"; 
  $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';

  // Route provider
  $routeProvider.
    when('/welcome', {
      templateUrl: 'partials/welcome.html',
      controller: 'SignupCtrl'
    }).
    when('/welcome_logged', {
      templateUrl: 'partials/welcome_logged.html'
    }).
    when('/bills', {
      templateUrl: 'partials/bills.html',
      controller: 'BillsCtrl'
    }).
    otherwise({
      redirectTo: '/bills'
    })
})
.run(function ($rootScope, $location) {

  $rootScope.$on("$routeChangeStart", function (event, next, current) {
    $rootScope.loggedUser = {username: 'johndoe', name: 'John Doe'};
      // User is logged, block non-admins from accessing users section
      if (next.originalPath == '/users' && $rootScope.loggedUser.role !== 'admin') {
        $location.path('/bills');
      }
  });
});