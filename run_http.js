var fs = require("fs");

var config = eval("(" + fs.readFileSync("http/config.json") + ")");
GLOBAL.couch_connection = config.couch_connection;
GLOBAL.upload_dir = config.upload_dir;
GLOBAL.icopath = config.icopath;
GLOBAL.certs = config.certs;
GLOBAL.content_type = config.content_type;

var server = require("./server"),
route = require("./router"),
handler = require("./requestHandler"),
handle = {};

handle["/"] = handler.start;
handle["/upload"] = handler.upload;
handle["/show"] = handler.show;
handle["/favicon.ico"] = handler.favicon;

server.start(route.route, handle);
server.start_ssl(route.route, handle);
server.debug(route.route, handle);