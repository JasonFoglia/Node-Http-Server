var querystring = require("querystring"),
fs = require("fs"),
path = require("path"),
parseURL = require('url').parse,
sys = require("util"),
log = require("jason").log,
couch = require("./couch"),
formidable = require("formidable");


function start(response) {
        log("Request handler 'start' was called.");

        var body = '<DOCTYPE html><html>'+
        '<head>'+
        '<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />'+
        '</head>'+
        '<body>'+
        '<form action="/upload" enctype="multipart/form-data" '+
        'method="post">'+
        '<input type="file" name="upload" multiple="multiple">'+
        '<input type="submit" value="Upload file" />'+
        '</form>'+
        '</body>'+
        '</html>';
        
        couch.Read(GLOBAL.couch_connection, "html", "test", function(res)
        {
                body += res;
        
                response.writeHead(200, {
                        "Content-Type": "text/html"
                });
                response.write(body);
                response.end();
        });
}

function upload(response, request, query) {
        log("Request handler 'upload' was called.");        
        formidable.UPLOAD_DIR = "./tmp";
        var form = new formidable.IncomingForm();
        
        form.parse(request, function(error, fields, files) {
                var t = "";
                try
                {
                        var p = GLOBAL.upload_dir + files.upload.name;                        
                        if(!path.existsSync(p))
                                fs.renameSync(files.upload.path, p);
                        else
                                fs.unlinkSync(files.upload.path);
                        
                        var filename = files.upload.name;
                        
                        if(path.existsSync(p))
                        {
                                var couchObj = {
                                        id:filename, 
                                        name:filename, 
                                        content_type:GLOBAL.content_type[filename.split(".")[filename.split(".").length-1]], 
                                        content:fs.createReadStream(p)
                                };
                                        
                                try
                                {
                                        couch.WriteFile(GLOBAL.couch_connection, "test", couchObj);                                        
                                }catch(e){log("Couch problem");log(e)}
                        }
                        t  = "received image:<br/><img src='/show?image="+p+"' />";
                }catch(e)
                {
                        t  = "image was not recevied!";
                        log(e);
                }
                response.writeHead(200, {
                        "Content-Type": "text/html"
                });
                response.write(t);
                response.end();
        });
}

function show(response, request, query) {
        log("Request handler 'show' was called.");
        
        var stream = couch.ReadFile(GLOBAL.couch_connection, "test", query.image, query.image);
        
        var file = "";
        response.writeHead(200, {
                "Content-Type": GLOBAL.content_type[query.image.split(".")[1]]
        });
        stream.addListener('data', function (chunk) { response.write(chunk, "binary"); });
        stream.addListener('end', function ()
        {
                response.end();
                /*if(file != "")
                {
                        response.write(file, "binary");
                }else
                {
                        response.writeHead(200, {
                                "Content-Type": "text/plain"
                        });
                        response.write("could not find file " + query.image + "\n" + file);
                        response.end();
                } */               
        });                
}

function favicon(response)
{
        if(path.existsSync(GLOBAL.icopath + "favicon.png"))
        {
                response.writeHead(200, {
                        "Content-Type": "image/x-icon"
                });
                response.write(fs.readFileSync(GLOBAL.icopath + "favicon.png"), "binary");
                response.end();
        }
}

exports.start = start;
exports.upload = upload;
exports.show = show;
exports.favicon = favicon;
