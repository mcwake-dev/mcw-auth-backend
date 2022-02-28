const Joi = require("joi");
const { encryptPassword } = require("../utils/password");

module.exports = Joi.object({
  username: Joi.string().min(6).max(30).required(),
  password: Joi.string()
    .min(8)
    .max(50)
    .required()
    .external((password) => encryptPassword(password)),
  given_name: Joi.string().required(),
  surname: Joi.string().required(),
});
