const start_ssl = require("./server/server").start_ssl;
const route = require("./server/route").route;
const requestHandler = require("./server/requestHandler");
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