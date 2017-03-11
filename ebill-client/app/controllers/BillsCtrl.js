myApp.controller('BillsCtrl', ['$rootScope', '$scope', '$location', 'LoginService', '$http', function ($rootScope, $scope, $location, LoginService, $http) {

  $scope.loadData = function() {
    $http({
      method: 'GET',
      url: 'api/ebill',
    }).then(function success(response) {
      console.log('Ebill data loaded: ' + JSON.stringify(response));
        $scope.bills = response.data; 
    }); 
  };

  $scope.payBill = function(bill) {
    bill.status = 'paid';
  };

  $scope.rejectBill = function(bill) {
    bill.status = 'rejected';
  };

  $scope.statusStyle = function(bill) {
    return {'open': 'color_orange', 'paid': 'color_green', 'rejected': 'color_red'}[bill.status];
  };


  $scope.loadData();

}]);
