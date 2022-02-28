const log = require("../log");
const userSchema = require("../schemas/user");
const authSchema = require("../schemas/authentication");
const { register, get } = require("../models/user.model");
const { validatePassword } = require("../utils/password");
const jwt = require("jsonwebtoken");
const { isValidAudience } = require("../models/audience.model");

exports.register = async (req, res, next) => {
  const logger = log.getLogger("Authentication Controller > register");

  logger.info("Attempting to register new user");

  console.log(req.body);

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
      console.log(authValues);
      const passwordCorrect = await validatePassword(
        authValues.password,
        user.password
      );

      if (passwordCorrect) {
        delete user.password;

        req.session.user = { ...user };

        res.redirect("/authenticateForSite");
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

exports.authenticateForSite = async (req, res, next) => {
  const logger = log.getLogger(
    "Authentication Controller > authenticateForSite"
  );

  if (!req.session.user) {
    logger.info("User is not authenticated");
    next({ msg: "Not authenticated", status: 403 });
  } else {
    logger.info("User is authenticated, checking audience");
    const { username } = req.session.user;
    const { audience } = req.body;

    if (isValidAudience(audience)) {
      logger.info("Audience is valid, creating token");

      const token = jwt.sign(
        { user: req.session.user },
        process.env.JWT_PRIVATE_KEY,
        {
          issuer: process.env.JWT_ISSUER,
          audience,
          subject: username,
          expiresIn: JWT_EXPIRES,
          algorithm: process.env.algorithm,
        }
      );

      logger.info("Issuing token");

      res.status(200).send({ token });
    } else {
      logger.warn("Audience invalid");

      next({ msg: "Invalid Audience", status: 403 });
    }
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
