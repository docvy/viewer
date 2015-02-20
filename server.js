/**
* Serves Static files
*/


// Module imports
var http = require("http");
var express = require("express");


// Module variables
var app = express();
var server = http.Server(app);
var port = process.env.NODE_JS_PORT || 9999;


// Serving static files
app.use("/node_modules", express.static(__dirname + "/node_modules"));
app.use(express.static(__dirname +"/dist"));


// Starting server
server.listen(port, function() {
  console.log("running on port: %d", port);
});
