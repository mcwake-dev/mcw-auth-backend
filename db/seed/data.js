const db = require("../db");

module.exports = async () => {
  await db.DEL("audience");
  await db.SADD("audience", "votes");
};
