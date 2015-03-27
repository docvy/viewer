/**
* Angular Services
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


/**
* showing notifications
*/
function notify($sce) {
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
      _class:"info",
      visible: false
    };
    return this;
  }

  Box.prototype.message = function(_message) {
    this.$scope.alert.message = $sce.trustAsHtml(_message);
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
  };

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
    this.settings = {
      readdir: { ignoreDotFiles: true }
    };
    this.metadata = null;
    return this;
  }

  /**
  * Setting server port
  *
  * @param <port> -- {Number} port bound by server
  */
  Server.prototype.setPort = function(port) {
    this.port = port;
  };

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
  * return url to plugin's www files
  */
  Server.prototype.getPluginsWebUrl = function() {
    return this.getUrl("/plugins/www");
  };

  /**
  * Reading files in the file system
  *
  * @param <_dirpath> -- {String} path to directory
  * @param <callback> -- {Function} callback(err, data)
  */
  Server.prototype.readdir = function(_dirpath, callback) {
    var config = { params: { } };
    config.params = this.settings.readdir;
    if (_dirpath) {
      config.params.dirpath = _dirpath;
    }
    this.$http.get(this.getUrl("/files/"), config)
      .success(function(data) {
        return callback(null, data);
      })
      .error(function(data) {
        return callback(data || new Error());
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
    config.params.expects = ["html"];
    this.$http.get(this.getUrl("/file/"), config)
      .success(function(data) {
        return callback(null, data);
      })
      .error(function(data) {
        return callback(data || new Error());
      });
  };

  /**
  * Getting list of plugins
  *
  * @param <callback> -- {Function} callback(err, plugins)
  */
  Server.prototype.listPlugins = function(callback) {
    this.$http.get(this.getUrl("/plugins/list"))
      .success(function(data) { return callback(null, data); })
      .error(function(data) { return callback(data); });
  };

  /**
  * Closing the server
  */
  Server.prototype.sendCloseRequest = function(callback) {
    this.$http.delete(this.getUrl("/stop"))
      .success(function(data) { return callback(null, data); })
      .error(function(data) { return callback(data); });
  };

  /**
  * Getting application metadata
  */
  Server.prototype.getMetadata = function(callback) {
    if (this.metadata) { return callback(null, this.metadata); }
    var _this = this;
    this.$http.get("/meta/metadata.json")
      .success(function(data) {
        _this.metadata = data;
        return callback(null, data);
      })
      .error(function(data) { return callback(data); })
  }

  return Server;
})();


angular.module('docvy.services', ["ngResource"])
  .service("notify", ["$sce", notify])
  .service("server", ["$http", function($http) {
    "use strict";
    return new server($http);
  }]);
