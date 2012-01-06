var http = require("http"),
https = require("https"),
fs = require("fs"),
url = require("url"),
log = require("jason").log;

var options = {
    key: fs.readFileSync(GLOBAL.certs.key),
    cert: fs.readFileSync(GLOBAL.certs.cert)
};

function start(route, handle) {
        function onRequest(request, response) {
                var pathname = url.parse(request.url).pathname;
                route(handle, pathname, response, request);
        }

        http.createServer(onRequest).listen(80);
        log("Http server has started.");
}

function debug(route, handle) {
        function onRequest(request, response) {
                var pathname = url.parse(request.url).pathname;
                route(handle, pathname, response, request);
        }

        http.createServer(onRequest).listen(8080);
        log("Debug server has started.");
}

function start_ssl(route, handle) {
        function onRequest(request, response) {
                var pathname = url.parse(request.url).pathname;
                route(handle, pathname, response, request);
        }

        https.createServer(options, onRequest).listen(443);
        log("Http SSL server has started.");
}

exports.start = start;
exports.debug = debug;
exports.start_ssl = start_ssl;