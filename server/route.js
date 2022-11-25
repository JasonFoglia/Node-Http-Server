const GLOBAL = require("./globals").GLOBAL;
const log = require("./utilities").log;
const resolve = require("path").resolve;
const readFile = require("fs").readFile;
const readFileSync = require("fs").readFileSync;
const extname = require("path").extname;
const parse = require("url").parse;

const route = (handle, pathname, response, request) => {
  let query = {};
  const queryString = parse(request.url).query;
  if (queryString) {
    log(["query string", queryString]);
    query = convertQueryStringToObject(queryString);
  }

  const contentType = GLOBAL.content_type[extname(pathname).replace(".", "")];

  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request, query);
  } else if (contentType != "") {

    readFile("." + pathname, "binary", (error, file) => {
      if (error) {
        response.writeHead(500, {
          "Content-Type": "text/html"
        });
        const indexPath = "./html/index.html";
        let index;
        if (resolve(indexPath)) {
          index = readFileSync(indexPath);
        }
        response.write(index.toString().replace("{{body}}", "<h3>404 Error. Page not found.</h3>"));
        response.end();
      } else {
        response.writeHead(200, {
          "Content-Type": contentType
        });
        response.write(file, "binary");
        response.end();
      }
    });
  } else {

    log("No request handler found for " + pathname);

    response.writeHead(200, {
      "Content-Type": "text/html"
    });
    response.write("You came here by accident!");
    response.end();
  }
}
const convertQueryStringToObject = (str) => {
  let obj = {};
  if (str != "") {
    if (str.indexOf("&") > -1) {
      const strPart1 = str.split("&");
      for (const i in strPart1) {
        const strPart2 = strPart1[i].split("=");
        obj[strPart2[0]] = strPart2[1];
      }
    } else {
      const kv = str.split("=");
      obj[kv[0]] = kv[1];
    }
  }
  return obj;
}


exports.route = route;
