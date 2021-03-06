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
    if ($scope.isReadOnly(bill)) {
      console.log('Bill ' + bill.uuid + ' is read only!');
      return;
    }

    $http({
      method: 'POST',
      url: 'api/ebill/' + bill.uuid +'/pay',
    }).then(function success(response) {
      console.log('Ebill ' + bill.uuid + ' paid');
      $scope.loadData();
    }); 
  };

  $scope.rejectBill = function(bill) {
    if ($scope.isReadOnly(bill)) {
      console.log('Bill ' + bill.uuid + ' is read only!');
      return;
    }

    $http({
      method: 'POST',
      url: 'api/ebill/' + bill.uuid +'/reject',
    }).then(function success(response) {
      console.log('Ebill ' + bill.uuid + ' rejected');
      $scope.loadData();
    }); 
  };

  $scope.statusStyle = function(bill) {
    return {'open': 'color_orange', 'paid': 'color_green', 'rejected': 'color_red'}[bill.status];
  };

  $scope.isReadOnly = function(bill) {
    return bill.status !== 'open';
  }

  $scope.getDueDays = function(bill) {
    return moment(bill.dueDate, ["YYYY-MM-DD"]).fromNow();
  }

  $scope.getReadonlyDays = function(bill) {
    return moment.unix(bill.status == 'rejected' ? bill.rejectedTime : bill.paidTime).fromNow();
  }


  $scope.loadData();

}]);
