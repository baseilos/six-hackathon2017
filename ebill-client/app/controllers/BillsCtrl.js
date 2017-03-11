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
    if (isReadOnly(bill)) {
      console.log('Bill ' + bill.uuid + ' is read only!');
    }
    
    $http({
      method: 'POST',
      url: 'api/ebill/' + bill.uuid +'/pay',
    }).then(function success(response) {
      console.log('Ebill ' + bill.uuid + ' paid');
    }); 
  };

  $scope.rejectBill = function(bill) {
    if (isReadOnly(bill)) {
      console.log('Bill ' + bill.uuid + ' is read only!');
    }

    $http({
      method: 'POST',
      url: 'api/ebill/' + bill.uuid +'/reject',
    }).then(function success(response) {
      console.log('Ebill ' + bill.uuid + ' reject');
    }); 
  };

  $scope.statusStyle = function(bill) {
    return {'open': 'color_orange', 'paid': 'color_green', 'rejected': 'color_red'}[bill.status];
  };

  $scope.isReadOnly = function(bill) {
    return bill.status !== 'open';
  }


  $scope.loadData();

}]);
