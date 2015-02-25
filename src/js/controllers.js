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
          .message("error reading directory: " + err)
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
  var notifyBox = new notify.Box($scope);
  var filepath = $routeParams.filepath;
  notifyBox.message("reading file").info().show();
  server.readfile(filepath, function(err, data) {
    if (err) {
      notifyBox
        .message("error reading file: " + err)
        .danger().show();
      return;
    }
    notifyBox.hide();
    $scope.content = data.data;
  });
}



angular.module('docvy.controllers', [
  "ngResource",
  "docvy.services"
])
  .controller("AppCtrl", ["$scope", function() { }])
  .controller("BrowseCtrl", ["$scope", "$location", "notify", "server",
    BrowseCtrl])
  .controller("ReadCtrl", ["$scope", "$routeParams", "notify",
    "server", ReadCtrl]);
