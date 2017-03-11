myApp.directive('pwCheck', [function() {
  return {
    require: 'ngModel',
    link: function(scope, elem, attrs, ctrls) {
      var origPassword = '#' + attrs.pwCheck;
      elem.add(origPassword).on('keyup', function() {
        scope.$apply(function() {
          ctrls.$setValidity('pwMatch', elem.val() === $(origPassword).val());      
        });    
      });
    }
  };
}]);