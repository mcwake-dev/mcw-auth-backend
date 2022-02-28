const bcrypt = require("bcrypt");

const saltRounds = 10;

const encryptPassword = async (plaintext) => {
  const password = await bcrypt.hash(plaintext, saltRounds);

  return password;
};

const validatePassword = async (entered, encrypted) => {
  const result = await bcrypt.compare(entered, encrypted);

  if (result) {
    return true;
  } else {
    return false;
  }
};

module.exports = { encryptPassword, validatePassword };
