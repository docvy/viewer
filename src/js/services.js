/**
* Angular Services
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


/**
* showing notifications
*/
function notify() {
  "use strict";

  /**
  * Box constructor
  * @param <$scope> -- {Object} scope of controller
  * @return {Object} a notify object
  */
  function Box($scope) {
    this.$scope = $scope;
    this.$scope.alert = {
      message: "",
      _class:"",
      visible: false
    };
    return this;
  }

  Box.prototype.message = function(_message) {
    this.$scope.alert.message = _message;
    return this;
  };

  Box.prototype.danger = function() {
    this.$scope.alert._class = "danger";
    return this; 
  };

  Box.prototype.info = function() {
    this.$scope.alert._class = "info";
    return this;
  };

  Box.prototype.success = function() {
    this.$scope.alert._class = "success";
    return this;
  };

  Box.prototype.show = function() {
    this.$scope.alert.visible = true;
    return this;
  };

  Box.prototype.hide = function(timeout) {
    if (timeout) {
      setTimeout(function() {
        this.$scope.alert.visible = false;
        this.$scope.$apply();
      }, timeout * 1000);
    } else {
      this.$scope.alert.visible = false;
    }
    return this;
  }

  return { Box: Box };
}


var server = (function() {
  "use strict";
  /**
  * Server handle as a service
  */
  function Server($http) {
    // server variables
    this.$http = $http;
    this.port = 9432;
    return this;
  }

  /**
  * computing root url of server
  */
  Server.prototype.getRootUrl = function() {
    return "http://localhost:" + this.port;
  };

  /**
  * return a full url
  */
  Server.prototype.getUrl = function(endpoint) {
    return this.getRootUrl() + endpoint;
  };

  /**
  * Reading files in the file system
  *
  * @param <_dirpath> -- {String} path to directory
  * @param <callback> -- {Function} callback(err, data)
  */
  Server.prototype.readdir = function(_dirpath, callback) {
    var config = { };
    if (_dirpath) { config.params = { dirpath: _dirpath }; }
    this.$http.get(this.getUrl("/files/"), config)
      .success(function(data) {
        return callback(null, data);
      })
      .error(function(data) {
        return callback(data);
      });
  };

  /**
  * Reading a file
  *
  * @param <_filepath> -- {String} path to file
  * @param <callback> -- {Function} callback(err, data)
  */
  Server.prototype.readfile = function(_filepath, callback) {
    var config = { params: { } };
    config.params.filepath = _filepath;
    config.params.expects = ["html", "*"];
    this.$http.get(this.getUrl("/file/"), config)
      .success(function(data) {
        return callback(null, data);
      })
      .error(function(data) {
        return callback(data);
      });
  }

  return Server;
})();


angular.module('docvy.services', ["ngResource"])
  .service("notify", [notify])
  .service("server", ["$http", function($http) {
    return new server($http);
  }]);
