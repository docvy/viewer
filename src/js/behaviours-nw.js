/**
* This script defines how elements/actions will behave when the
* application is loaded as a nw.js application
*/


//var nwgui = require("nw.gui");


function gui() {
  "use strict";
  /**
  * Open link in Browser
  */
//  this.openLink = function(link) {
//    console.log("opening: " + link);
//    return nwgui.Shell.openExternal(link);
//  };

}




angular.module("docvy.gui", [])
  .service("gui", [gui]);
