const db = require("../db/db");

exports.isValidAudience = (audience) => {
  return db.SISMEMBER("audience", audience);
};
