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
function BrowseCtrl($scope, $location, common, notify, server) {
  "use strict";
  $scope.content = { directories: [], files: [] };
  var notifyBox = new notify.Box($scope);

  // reading directories
  $scope.readdir = function(_dirpath) {
    notifyBox.message("reading directory").show();
    server.current.readdir(_dirpath, function(err, data) {
      if (err) {
        notifyBox
          .message("error reading directory: " + data)
          .danger().show();
        return;
      }
      notifyBox.hide();
      $scope.content = data;
    });
  };

  // reading files
  $scope.readfile = common.readfile;

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
  server.current.readfile(filepath, function(err, data) {
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
function ServerCtrl($scope, notify, server, gui) {
  "use strict";
  var notifyBox = new notify.Box($scope);
  $scope.settings = {};
  $scope.openLink = gui.openLink;

  // listing plugins
  $scope.listPlugins = function() {
    server.current.listPlugins(function(err, plugins) {
      if (err) {
        notifyBox.message("error retrieving list of plugins")
          .danger().show();
        return;
      }
      $scope.plugins = plugins.plugins;
    });
  };


  // handling settings
  $scope.settings.port = server.current.port;
  $scope.settings.ignoreDotFiles = server.current.settings.
    readdir.ignoreDotFiles;
  $scope.$watch("settings", function(newSettings, oldSettings) {
    // changing port
    if (newSettings.port !== oldSettings.port) {
      server.current.setPort(newSettings.port);
    }
    // ignoring dot files
    if (newSettings.ignoreDotFiles !== oldSettings.ignoreDotFiles) {
      server.current.settings.readdir.ignoreDotFiles =
        newSettings.ignoreDotFiles;
    }
  }, true);

  // www root for plugins
  $scope.getPluginsIconUrl = function(plugin) {
    return server.current.getPluginsWebUrl() + "/" + plugin.name + "/" +
      plugin.metadata.icon;
  };

  // Installing plugins
  $scope.installPlugin = function(name) {
    notifyBox
      .message("attempting to install <strong>" + name + "</strong")
      .info().show().hide(2);
    server.current.installPlugin(name, function(err, plugin) {
      if (err) {
        return notifyBox("failed to install plugin")
          .danger().show().hide(5);
      }
      return notifyBox
        .message("succesfully installed plugin <strong>" +
          plugin.name + "</strong>")
        .success().show().hide(2);
      // refreshing the installed plugins
      $scope.listPlugins();
    });
  };

  // listing plugins
  $scope.listPlugins();

}


/**
* Controller for the Server view
*/
function MetaCtrl($scope, $sce, notify, server) {
  "use strict";
  var notifyBox = new notify.Box($scope);
  notifyBox.message("retrieving metadata").show();
  server.current.getMetadata(function(err, data) {
    if (err) {
      return notifyBox.message("error retrieving metadata")
        .danger().show();
    }
    notifyBox.hide();
    $scope.metadata = data;
    $scope.metadata.license = data.license.replace(/\n/g, "<br>");
    $scope.metadata.license = $sce.trustAsHtml($scope.metadata.license);
  });
}


/**
* Controller for Recent files
*/
function RecentFilesCtrl($scope, $location, common, server) {
  "use strict";
  server = 1;
  var pathsFromServer = [ "/home/.bashrc" ];
  $scope.recentfiles = [];
  var current;
  for (var index in pathsFromServer) {
    current = pathsFromServer[index];
    $scope.recentfiles.push({
      name: current.substring(current.lastIndexOf("/") + 1),
      url: current
    });
  }
  $scope.readfile = common.readfile;
}


/**
* Controller for Online Status Switch
*/
function StatusCtrl($scope, $location, server) {
  "use strict";
  $scope.online = server.isOnline();
  $scope.toggle = function() {
    $location.url("/login");
  };
}


/**
* Controller for Connections to local and remote servers
*/
function ConnectionCtrl($scope, notify, server, user) {
  "use strict";
  var notifyBox = new notify.Box($scope);
  $scope.loggingIn = false;
  $scope.login = { };
  $scope.signup = { };
  $scope.data = { };
  // login with username and password
  $scope.login.do = function() {};
  // login with github
  $scope.login.github = function() {};
  // login with twitter
  $scope.login.twitter = function() {};
  // signup
  $scope.signup.do = function() {};
  // automatically logins
  $scope.data = user.getUserInformation();
  if ($scope.data) {
    $scope.loggingIn = true;
    $scope.progress = "connecting to docvy-house";
    notifyBox.message("restoring session").info().show().hide(2);
  }
}


angular.module('docvy.controllers', [
  "ngResource",
  "docvy.services",
  "docvy.gui"
])
  .controller("AppCtrl", ["$scope", function() { }])
  .controller("BrowseCtrl", ["$scope", "$location", "common", "notify",
    "server", BrowseCtrl])
  .controller("ReadCtrl", ["$scope", "$routeParams", "notify",
    "server", ReadCtrl])
  .controller("ServerCtrl", ["$scope", "notify", "server", "gui",
    ServerCtrl])
  .controller("MetaCtrl", ["$scope", "$sce", "notify", "server",
    MetaCtrl])
  .controller("RecentFilesCtrl", ["$scope", "$location", "common",
    "server", RecentFilesCtrl])
  .controller("StatusCtrl", ["$scope", "$location", "server",
    StatusCtrl])
  .controller("ConnectionCtrl", ["$scope", "notify", "server", "user",
    ConnectionCtrl]);
