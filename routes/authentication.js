const router = require("express").Router();

const {
  authenticate,
  deauthenticate,
  register,
  authenticateForSite,
} = require("../controllers/authentication.controller");

router.route("/authenticate").post(authenticate);
router.route("/authenticate-for-site").post(authenticateForSite);
router.route("/deauthenticate").get(deauthenticate);
router.route("/register").post(register);
module.exports = router;
