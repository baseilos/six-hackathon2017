myApp.controller('BillsCtrl', ['$rootScope', '$scope', '$location', 'LoginService', '$http', function ($rootScope, $scope, $location, LoginService, $http) {

  $scope.loadData = function() {
    $http({
      method: 'GET',
      url: 'api/ebill',
    }).then(function success(response) {
      console.log('Ebill data loaded: ' + response);
        $rootScope.bills = response; 
    }); 
  };

  $scope.payBill = function(bill) {
    bill.status = 'paid';
  };

  $scope.rejectBill = function(bill) {
    bill.status = 'rejected';
  };

  $scope.statusStyle = function(bill) {
    console.log('Fantomas');
    return {'open': 'color_yellow', 'paid': 'color_green', 'rejected': 'color_red'}[bill.status];
  };


  $scope.loadData();

}]);
