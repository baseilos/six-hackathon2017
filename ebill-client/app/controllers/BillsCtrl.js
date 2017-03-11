myApp.controller('BillsCtrl', ['$rootScope', '$scope', '$location', 'LoginService', '$http', function ($rootScope, $scope, $location, LoginService, $http) {

  $scope.bills = [{
    issuer: 'My Poster GMBH',
    currency: 'CHF',
    amount: '30',
    status: 'open'
  }, 
  {
    issuer: 'Dentist Dr. med. Mueller',
    currency: 'CHF',
    amount: '1198',
    status: 'open'
  },
  {
    issuer: 'Car services',
    currency: 'CHF',
    amount: '270',
    status: 'open'
  },
  {
    issuer: 'Taxes',
    currency: 'CHF',
    amount: '13000',
    status: 'open'
  },
  {
    issuer: 'MasterCard',
    currency: 'CHF',
    amount: '1300',
    status: 'open'
  }];

  $scope.loadData = function() {
    $http({
      method: 'GET',
      url: 'http://172.30.5.72:3000/ebill',
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
