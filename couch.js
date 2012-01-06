var cradle = require("cradle"),
log = require("jason").log;

var Couch = {
        Write:function(url, db, data)
        {
                var conn = new(cradle.Connection)(url.path, url.port, {
                        cache: false,
                        raw: false
                });

                var database = conn.database(db);
                database.save(data.id, data.obj, function (err, res) {
                        log(res.ok) // True
                });
        },
        WriteFile:function(url, db, data)
        {
                var conn = new(cradle.Connection)(url.path, url.port, {
                        cache: false,
                        raw: false
                });

                var database = conn.database(db);
                database.saveAttachment(data.id, "", data.name, data.content_type, data.content, function (res) {
                        if(res != null && res != undefined)
                                if(res.error != null && res.error != undefined)
                                        log(res);
                });
                //conn.close();
        },
        Read:function(url, db, id, callback)
        {
                var conn = new(cradle.Connection)(url.path, url.port, {
                        cache: false,
                        raw: false
                });

                var database = conn.database(db);
                database.get(id, function (e, res) {
                        log(res);
                        callback(res);
                });
        },
        ReadFile:function(url, db, id, file, content_type)
        {
                var conn = new(cradle.Connection)(url.path, url.port, {
                        cache: false,
                        raw: false
                        //,headers:{"Content-type":content_type + "; charset=utf8"}
                });
                var database = conn.database(db);
                var filein = database.getAttachment(id, file);
                log(filein.length);
                return filein;
        }
}

exports.Write = Couch.Write;
exports.WriteFile = Couch.WriteFile;
exports.Read = Couch.Read;
exports.ReadFile = Couch.ReadFile;