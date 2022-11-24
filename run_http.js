const start_ssl = require("./server").start_ssl;
const route = require("./router").route;
const requestHandler = require("./requestHandler");
const handle = {};

handle["/"] = requestHandler.start;
handle["/upload"] = requestHandler.upload;
handle["/show"] = requestHandler.show;
handle["/favicon.ico"] = requestHandler.favicon;

start_ssl(route, handle);

/**
start(_route, handle);
debug(_route, handle);
 */