const log = require("../log");
const userSchema = require("../schemas/user");
const authSchema = require("../schemas/authentication");
const { register, get } = require("../models/user.model");
const { validatePassword } = require("../utils/password");
const jwt = require("jsonwebtoken");

exports.register = async (req, res, next) => {
  const logger = log.getLogger("Authentication Controller > register");

  logger.info("Attempting to register new user");

  try {
    const { username, given_name, surname, password } = req.body;
    const value = await userSchema.validateAsync({
      username,
      given_name,
      surname,
      password,
    });
    const registeredUser = await register({ ...value });

    logger.info("Register User succeeded");
    res.status(201).send({ user: registeredUser });
  } catch (err) {
    const errorMessage = `Register User failed: ${err}`;

    logger.warn(errorMessage);
    next({ msg: errorMessage, status: 400 });
  }
};

exports.authenticate = async (req, res, next) => {
  const logger = log.getLogger("Authentication Controller > authenticate");

  logger.info("Attempting to authenticate user");
  try {
    const { username, password } = req.body;
    const authValues = await authSchema.validateAsync({ username, password });
    const user = get(authValues.username);

    if (user) {
      const passwordCorrect = await validatePassword(
        authValues.password,
        user.password
      );

      if (passwordCorrect) {
        delete user.password;

        const token = jwt.sign(
          { user: req.session.user },
          process.env.JWT_PRIVATE_KEY,
          {
            issuer: process.env.JWT_ISSUER,
            audience: process.env.JWT_AUDIENCE,
            subject: username,
            expiresIn: JWT_EXPIRES,
            algorithm: process.env.algorithm,
          }
        );

        res.status(200).send({token});
      } else {
        next({ msg: "Password incorrect", status: 403 });
      }
    } else {
      next({ msg: "User not found", status: 404 });
    }
  } catch (err) {
    const errorMessage = `Authenticate User failed: ${err}`;

    logger.warn(errorMessage);
    next({ msg: errorMessage, status: 400 });
  }
};

exports.deauthenticate = async (req, res, next) => {
  const logger = log.getLogger("Authentication Controller > deauthenticate");

  logger.info("Attempting to deauthenticate user");

  req.session.destroy((err) => {
    if (err) {
      const errorMessage = `Deauthenticate: Error Occurred ${err}`;

      logger.error(errorMessage);
      next({ msg: `Deauthenticate: Error Occurred ${err}`, status: 400 });
    } else {
      logger.info("Deauthentication complete");
    }

    res.sendStatus(200);
  });
};
