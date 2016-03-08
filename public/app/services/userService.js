angular.module('userService', [])
  .factory('User', function($http) {
    // create the object
    var userFactory = {};

    // get a single user
    userFactory.get = function(id) {
      return $http.get('http://localhost:3000/api/users/' + id);
    };

    // get all users
    userFactory.all = function() {
      return $http.get('http://localhost:3000/api/users/');
    };

    // create a user
    userFactory.create = function(userData) {
      return $http.post('http://localhost:3000/api/users/', userData);
    };

    // update a user
    userFactory.update = function(id, userData) {
      return $http.put('http://localhost:3000/api/users/' + id, userData);
    };

    // delete a user
    userFactory.delete = function(id) {
      return $http.delete('http://localhost:3000/api/users/' + id);
    };
    // return our entire userFactory object
    return userFactory;
  })
