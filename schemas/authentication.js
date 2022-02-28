const Joi = require("joi");

module.exports = Joi.object({
  username: Joi.string().min(3).max(30).required(),
  password: Joi.string().min(3).max(50).required(),
});
