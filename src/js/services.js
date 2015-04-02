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
      var _this = this;
      setTimeout(function() {
        _this.$scope.alert.visible = false;
        _this.$scope.$apply();
      }, timeout * 1000);
    } else {
      this.$scope.alert.visible = false;
    }
    return this;
  };

  return { Box: Box };
}


/**
* Server
*/
function server(localServer, remoteServer) {
  "use strict";

  function Proxy() {
    this.local = localServer;
    this.remote = remoteServer;
    // this acts like a symlink to the current server
    this.current = localServer;
  }

  Proxy.prototype.goOffline = function(callback) {
    this.current = this.local;
    return callback();
  };

  Proxy.prototype.goOnline = function(callback) {
    // this.current = this.remote;
    return callback(new Error());
  };

  /**
  * Calling server methods using the Proxy object
  */
  Proxy.prototype.execute = function() {
    var args = [];
    for (var index in arguments) {
      args.push(arguments[index]);
    }
    return this.current[args.shift()].apply(this.current, args);
  };

  return new Proxy();
}


/**
* Common utilities
*/
function common($location) {
  "use strict";
  var utils = { };
  // reading files
  utils.readfile = function(_filepath) {
    $location.url("/read/?filepath=" + _filepath);
  };
  return utils;
}


angular.module('docvy.services', ["docvy.servers"])
  .service("notify", ["$sce", notify])
  .service("server", ["localServer", "remoteServer", server])
  .service("common", ["$location", common]);
