/**
* Angular Controllers
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


/**
* Controller for Browse view
* Handles listing directories and files in file system
*/
function BrowseCtrl($scope, $location, notify, server) {
  "use strict";
  $scope.content = { directories: [], files: [] };
  var notifyBox = new notify.Box($scope);

  // reading directories
  $scope.readdir = function(_dirpath) {
    notifyBox.message("reading directory").show();
    server.readdir(_dirpath, function(err, data) {
      if (err) {
        notifyBox
          .message("error reading directory: " + err.message)
          .danger().show();
        return;
      }
      notifyBox.hide();
      $scope.content = data;
    });
  };

  // reading files
  $scope.readfile = function(_filepath) {
    $location.url("/read/?filepath=" + _filepath);
  };

  $scope.readdir(); // immediately read something

}


/**
* Controller for Read view
* Handles reading of files
*/
function ReadCtrl($scope, $routeParams, notify, server) {
  "use strict";
  var notifyBox = new notify.Box($scope);
  var filepath = $routeParams.filepath;
  notifyBox.message("reading file").info().show();
  server.readfile(filepath, function(err, data) {
    if (err) {
      console.log(err);
      notifyBox
        .message("error reading file: <strong>" + err + "</strong>")
        .danger().show();
      return;
    }
    notifyBox.hide();
    $scope.content = data.data;
  });
}


/**
* Controller for the Server view
*/
function ServerCtrl($scope, notify, server) {
  "use strict";
  var notifyBox = new notify.Box($scope);
  $scope.settings = {};

  // listing plugins
  server.listPlugins(function(err, plugins) {
    if (err) {
      notifyBox.message("error retrieving list of plugins")
        .danger().show();
      return;
    }
    $scope.plugins = plugins.plugins;
  });

  // handling settings
  $scope.settings.port = server.port;
  $scope.settings.ignoreDotFiles = server.settings.
    readdir.ignoreDotFiles;
  $scope.$watch("settings", function(newSettings, oldSettings) {
    console.log(newSettings, oldSettings);
    // changing port
    if (newSettings.port !== oldSettings.port) {
      server.setPort(newSettings.port);
    }
  }, true);

  // www root for plugins
  $scope.getPluginsIconUrl = function(plugin) {
    return server.getPluginsWebUrl() + "/" + plugin.name + "/" +
      plugin.metadata.icon;
  };
}


angular.module('docvy.controllers', [
  "ngResource",
  "docvy.services"
])
  .controller("AppCtrl", ["$scope", function() { }])
  .controller("BrowseCtrl", ["$scope", "$location", "notify", "server",
    BrowseCtrl])
  .controller("ReadCtrl", ["$scope", "$routeParams", "notify",
    "server", ReadCtrl])
  .controller("ServerCtrl", ["$scope", "notify", "server", ServerCtrl]);
