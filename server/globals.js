const config = require('../config.json');

const globals = {
  couch_connection: config.couch_connection,
  upload_dir: config.upload_dir,
  icopath: config.icopath,
  certs: config.certs,
  content_type: config.content_type,
  server: config.server
};

exports.GLOBAL = globals;