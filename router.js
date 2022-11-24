const GLOBAL = require("./globals").GLOBAL;
const log = require("./utilities").log;
const readFile = require("fs").readFile;

const route = (handle, pathname, response, request) => {
  let query = {};
  log(request.url.split("?")[1])
  if (request.url.indexOf("?") > -1) { query = convert_json(request.url.split("?")[1]); }

  const contentType = GLOBAL.content_type[pathname.split(".")[1]];

  if (typeof handle[pathname] === 'function') {
    handle[pathname](response, request, query);
  } else if (contentType != "") {
    readFile("." + pathname, "binary", function (error, file) {
      if (error) {
        response.writeHead(500, {
          "Content-Type": "text/plain"
        });
        response.write(error + "\n");
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
const convert_json = (str) => {
  const arr = [];
  let _json = {};
  if (str != "") {
    if (str.indexOf("&") > -1) {
      const strPart1 = str.split("&");
      for (const i in strPart1) {
        const strPart2 = strPart1[i].split("=");
        arr.push('"' + strPart2[0] + '":"' + strPart2[1] + '"');
      }
      _json = JSON.parse("{" + arr.join(",") + "}");
    } else {
      const kv = str.split("=");
      _json = JSON.parse('{"' + kv[0] + '":"' + kv[1] + '"}');
    }
  }
  return _json;
}


exports.route = route;
