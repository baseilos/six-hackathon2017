myApp.service('LoginService', ['$http', function ($http) {

  // Functions
  var getAuthHeader = function (username, password) {
    return "Basic " + btoa(username + ":" + password);
  };

  var login = function(username, password, onLogin, onError) {
    $http.defaults.headers.common["Authorization"] = getAuthHeader(username, password); 
    authenticate(onLogin, onError);
  };

  var authenticate = function(onLogin, onError) {
    $http({
      method: 'GET',
      url: '/api/authenticate',
    }).then(function success(response) {
        var loggedUser = parseUser(response);
        console.log('Logging in user: ' + JSON.stringify(loggedUser));
        onLogin(loggedUser);
    }, function error(response) {
        console.log('Unsuccessful login');
        onError();
    });
  }

  var logout = function() {
    $http.defaults.headers.common["Authorization"] = null;
    console.log('User logged out');
  };

  var parseUser = function(response) {
    var user = response.data._items[0];
    console.log(user);
    return {username: user.username, password: user.password, role: user.role, preferred_hours_day: user.preferred_hours_day, _etag: user._etag, _id: user._id};
  };

  var isAdmin = function(user) {
    return user !== null && user !== undefined && user.role === 'admin';
  }

  return {
    login: login,
    logout: logout,
    authenticate: authenticate,
    parseUser: parseUser,
    isAdmin: isAdmin
  }

}]);
