const cradle = require("cradle");
const log = require("./utilities").log;
const util = require('util');

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
  Write: (connection, db, data, callBack) => {
    const conn = createConnection(connection);
    const database = conn.database(db);
    database.save(data.id, data.obj, (err, res) => {
      if (err) {
        log(["save error", err, data.id]);
      }
      callBack(res);
    });
  },
  WriteFile: (connection, db, data, callBack) => {
    const conn = createConnection(connection);
    const database = conn.database(db);
    database.saveAttachment({
      id: data.name,
      rev: data.rev
    }, data, (err, res) => {
      if (err) {
        log(["save file error", err, data.name]);
      }
      callBack(res);
    });
  },
  Read: (connection, db, id, callback) => {
    const conn = createConnection(connection);
    const database = conn.database(db);
    database.get(id, callback);
  },
  ReadFile: (connection, db, id, fileName, contentType, callBack) => {
    const conn = createConnection(connection, { headers: { "Content-type": contentType } });
    const database = conn.database(db);
    database.getAttachment(id, fileName, (err, res) => {
      if (err) {
        log(["read file error", err]);
      }
      callBack(res);
    });
  }
}

exports.Write = Couch.Write;
exports.WriteFile = Couch.WriteFile;
exports.Read = Couch.Read;
exports.ReadFile = Couch.ReadFile;