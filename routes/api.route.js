const router = require("express").Router();

const authenticationRouter = require("./authentication");

router.use("/authentication", authenticationRouter);

module.exports = router;
