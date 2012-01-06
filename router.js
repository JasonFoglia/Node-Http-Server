var log = require("jason").log,
path = require("path"),
fs = require("fs");

function route(handle, pathname, response, request) {
        var query = {};
        log(request.url.split("?")[1])
        if(request.url.indexOf("?") > -1)
                query = convert_json(request.url.split("?")[1]);
        
        var contenttype = GLOBAL.content_type[pathname.split(".")[1]];
        
        if (typeof handle[pathname] === 'function') 
                handle[pathname](response, request, query);
        else if(contenttype != "") {                                
                fs.readFile("." + pathname, "binary", function(error, file) {
                        if(error) {
                                response.writeHead(500, {
                                        "Content-Type": "text/plain"
                                });
                                response.write(error + "\n");
                                response.end();
                        } else {                                
                                response.writeHead(200, {
                                        "Content-Type": contenttype
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
function convert_json(str) {
        var arr = [];
        var _json = {};        
        if(str != "")
        {
                if(str.indexOf("&") > -1)
                {
                        var strpart1 = str.split("&");
                        for(var i in strpart1) {
                                var strpart2 = strpart1[i].split("=");
                                arr.push('"' + strpart2[0] + '":"' + strpart2[1] + '"');
                        }
                        _json = JSON.parse("{" + arr.join(",") + "}");
                }else
                {
                        var kv = str.split("=");
                        _json = JSON.parse('{"' + kv[0] + '":"' + kv[1] + '"}');
                }
        }
        return _json;
}

exports.route = route;