const inspect = require("util").inspect;

const jason = {
  sleep: (milliSeconds) => {
    const startTime = new Date().getTime();
    while (new Date().getTime() < startTime + milliSeconds);
  },
  log: (o) => {
    if (o != undefined && o != null) {
      console.log(inspect(o, true, 4, true));
    }
  }
}

exports.sleep = jason.sleep;
exports.log = jason.log;