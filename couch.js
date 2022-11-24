const cradle = require("cradle");
const log = require("./utilities").log;

const options = (connection) => {
  return {
    cache: false,
    raw: false,
    auth: {
      username: connection.user,
      password: connection.pass,
    }
  };
};
const createConnection = (connection, extraOptions) => {
  return new cradle.Connection(connection.path, connection.port, { ...options(connection), extraOptions });
};
const Couch = {
  Write: (connection, db, data) => {
    const conn = createConnection(connection);
    const database = conn.database(db);
    database.save(data.id, data.obj, function (err, res) {
      log(["saved data", res.ok]) // True
    });
  },
  WriteFile: (connection, db, data) => {
    const conn = createConnection(connection);
    const database = conn.database(db);
    database.saveAttachment({
      id: data.name
    }, data, (err, res) => {
      if (err) {
        log(["save error", err]);
      } else {
        log(["file saved", res.ok]);
      }
    });
  },
  Read: (connection, db, id, callback) => {
    const conn = createConnection(connection);
    const database = conn.database(db);
    database.get(id, (e, res) => {
      if (e) {
        log(["read error", e]);
        callback(res);
      } else {
        callback(res);
      }
    });
  },
  ReadFile: (connection, db, id, fileName, contentType, callBack) => {
    const conn = createConnection(connection, { headers: { "Content-type": contentType } });
    const database = conn.database(db);
    database.getAttachment(id, fileName, (err, res) => {
      if (err) {
        log(["read file error", err]);
      } else {
        callBack(res);
      }
    });
  }
}

exports.Write = Couch.Write;
exports.WriteFile = Couch.WriteFile;
exports.Read = Couch.Read;
exports.ReadFile = Couch.ReadFile;