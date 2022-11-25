const formidable = require("formidable");
const { extname, resolve } = require("path");
const { readFile, readFileSync, createReadStream } = require("fs");
const mv = require('mv');

const log = require("./utilities").log;
const GLOBAL = require("./globals").GLOBAL;
const Couch = require("./couch");

const requestHandler = {
  start: (response) => {
    log("Request handler 'start' was called.");

    const body = "";
    const index = "./html/index.html";
    if (resolve(index)) {
      response.writeHead(200, {
        "Content-Type": "text/html"
      });
      const indexPage = readFileSync(index);
      response.write(indexPage.toString().replace("{{body}}", body), "binary");
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

    response.writeHead(200, {
      "Content-Type": "text/html"
    });
    form.parse(request, (error, fields, files) => {
      if (files && !(files.upload instanceof Array)) {
        files.upload = [files.upload];
      }
      let i = 0;
      files.upload.forEach((file) => {
        const oldpath = file.filepath;
        const fileName = file.originalFilename;
        const newpath = GLOBAL.upload_dir + fileName;
        const ext = extname(fileName).replace(".", "");

        mv(oldpath, newpath, (err) => {
          if (err) {
            log(["copy error", err]);
            throw err;
          }

          Couch.Read(GLOBAL.couch_connection, "test", fileName, (d) => {
            const couchObj = {
              id: fileName,
              name: fileName,
              'Content-Type': GLOBAL.content_type[ext],
              body: createReadStream(newpath),
            };
            if (d && d._rev) {
              couchObj.rev = d._rev;
            }

            Couch.WriteFile(GLOBAL.couch_connection, "test", couchObj, (res) => {
              response.write('<div>received image:</div><img src="/show?image=' + fileName + '" alt="' + fileName + '" />');
              if (i == files.upload.length - 1) {
                response.end();
              }
              i++;
            });
          });

        });
      });
    });
  },

  show: (response, request, query) => {
    log("Request handler 'show' was called.");

    Couch.ReadFile(GLOBAL.couch_connection, "test", query.image, query.image, undefined, (chunk) => {
      const ext = extname(query.image).replace(".", "");
      log(query.image)
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
