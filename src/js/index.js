/**
* Script for the Shell page (index.html)
*
* The MIT License (MIT)
* Copyright (c) 2015 GochoMugo <mugo@forfuture.co.ke>
*/


angular.module("DocvyApp", ["ngRoute", "docvy.controllers"])


.config(["$routeProvider", function($routeProvider) {
  "use strict";

  $routeProvider

  .when("/browse", {
    templateUrl: "browse.html",
    controller: "BrowseCtrl"
  })

  .when("/read/", {
    templateUrl: "read.html",
    controller: "ReadCtrl"
  })

  .when("/server", {
    templateUrl: "server.html",
    controller: "ServerCtrl"
  })

  // if none of the above routes are matched, use this as the fallback
  .otherwise("/browse");
}]);
