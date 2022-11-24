const createReadStream = require("fs").createReadStream;
const readFileSync = require("fs").readFileSync;
const extname = require("path").extname;
const resolve = require("path").resolve;
const formidable = require("formidable");
const mv = require('mv');

const log = require("./utilities").log;
const GLOBAL = require("./globals").GLOBAL;
const Couch = require("./couch");

const requestHandler = {
  start: (response) => {
    log("Request handler 'start' was called.");

    const index = "./html/index.html";
    if (resolve(index)) {
      response.writeHead(200, {
        "Content-Type": "text/html"
      });
      response.write(readFileSync(index), "binary");
      response.end();
    }

    /***
    couch.Read(GLOBAL.couch_connection, "test", "html", (res) => {
      if (res && res != undefined) {
        body += res;
      }
      
    }); 
    */
  },

  upload: (response, request, query) => {
    log("Request handler 'upload' was called.");
    formidable.UPLOAD_DIR = "./tmp";
    const form = new formidable.IncomingForm({ multiples: true });

    form.parse(request, (error, fields, files) => {
      let res = "";
      if (files && typeof files.upload == "object") {
        files.upload = [files.upload];
      }
      files.upload.forEach((file) => {
        const oldpath = file.filepath;
        const fileName = file.originalFilename;
        res += "received image:<br/><img src='/show?image=" + fileName + "' />";
        const newpath = GLOBAL.upload_dir + fileName;
        mv(oldpath, newpath, (err) => {
          if (err) {
            log(["copy error", err]);
            throw err;
          }
          const ext = extname(fileName).replace(".", "");
          if (resolve(newpath)) {
            const couchObj = {
              id: fileName,
              name: fileName,
              'Content-Type': GLOBAL.content_type[ext],
              body: createReadStream(newpath)
            };

            try {
              Couch.WriteFile(GLOBAL.couch_connection, "test", couchObj);
            } catch (e) { log(["Couch problem", e]) }
          }
        });
      });

      response.writeHead(200, {
        "Content-Type": "text/html"
      });
      response.write(res);
      response.end();

    });
  },

  show: (response, request, query) => {
    log("Request handler 'show' was called.");

    Couch.ReadFile(GLOBAL.couch_connection, "test", query.image, query.image, undefined, (chunk) => {
      const ext = extname(query.image).replace(".", "");
      response.writeHead(200, {
        "Content-Type": GLOBAL.content_type[ext]
      });
      response.write(chunk.body, "binary");
      response.end();
    });
  },

  favicon: (response) => {
    if (resolve(GLOBAL.icopath + "favicon.png")) {
      response.writeHead(200, {
        "Content-Type": "image/x-icon"
      });
      response.write(readFileSync(GLOBAL.icopath + "favicon.png"), "binary");
      response.end();
    }
  }
};

exports.start = requestHandler.start;
exports.upload = requestHandler.upload;
exports.show = requestHandler.show;
exports.favicon = requestHandler.favicon;
