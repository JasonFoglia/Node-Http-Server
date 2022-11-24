
const createServer = require("http").createServer;
const createSecureServer = require("https").createServer;
const readFileSync = require("fs").readFileSync;
const parse = require("url").parse;

const log = require("./utilities").log;
const GLOBAL = require("./globals").GLOBAL;

const server = {
  options: {
    key: readFileSync(GLOBAL.certs.key),
    cert: readFileSync(GLOBAL.certs.cert)
  },

  start: (route, handle) => {
    const onRequest = (request, response) => {
      const pathname = parse(request.url).pathname;
      route(handle, pathname, response, request);
    }

    createServer(onRequest).listen(GLOBAL.server.port);
    log("Http server has started at http://localhost:" + GLOBAL.server.port);
  },

  debug: (route, handle) => {
    const onRequest = (request, response) => {
      const pathname = parse(request.url).pathname;
      route(handle, pathname, response, request);
    }

    createServer(onRequest).listen(GLOBAL.server.adminPort);
    log("Debug server has started at http://localhost" + GLOBAL.server.adminPort);
  },

  start_ssl: (route, handle) => {
    const onRequest = (request, response) => {
      const pathname = parse(request.url).pathname;
      route(handle, pathname, response, request);
    }

    createSecureServer(server.options, onRequest).listen(443);
    log("Http SSL server has started at https://localhost/");
  }
};
/**
exports.start = start;
exports.debug = debug;
*/

exports.start_ssl = server.start_ssl;