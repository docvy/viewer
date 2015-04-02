/**
* Server Interface
* Both local and remote server must implement this interface in order
* to allow using the same skin in both the web application and
* desktop application
*
* Also. any methods that ae used internally should be named starting
* with an underscore(_)
*/
/* jshint ignore: start */
var ServerInterface = (function() {
  "use strict";

  function Interface() {  }

  // reading directories
  Interface.prototype.readdir = function(_path) { };

  // reading files
  Interface.prototype.readfile = function(filepath) { };

  // Getting Stack metadata
  Interface.prototype.getMetadata = function(callback) { };

  // Getting recent opened files
  Interface.prototype.getRecentFiles = function(callback) { };

  return Interface;
}) ();
/* jshint ignore: end */


/**
* The Local Server Class. The local server is run using the
* docvy-server. The Server runs on the user's localhost.
*/
var LocalServer = (function() {
  "use strict";

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
      .error(function() {
        return callback(new Error());
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
      .error(function(data) { return callback(data); });
  };

  return Server;
})();


function RemoteServer($http) {
  "use strict";
  $http = 1;
}


// Exposing the ServerInterface, LocalServer, RemoteServer in Node.js
try {
  exports.ServerInterface = ServerInterface; // jshint ignore: line
  exports.LocalServer = LocalServer;
  exports.RemoteServer = RemoteServer;
} catch(err) { }


// Exporting the server for AngularJs as services
angular.module('docvy.servers', ["ngResource"])
  .service("localServer", ["$http", function($http) {
    "use strict";
    return new LocalServer($http);
  }])
  .service("remoteServer", ["$http", function($http) {
    "use strict";
    return new RemoteServer($http);
  }]);

