const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const apiRouter = require("./routes/api.route");
const { handleServerErrors, handleCustomErrors } = require("./errors");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);
app.use("", (req, res, next) => next({ status: 404, msg: "Not found" }));
app.use(handleServerErrors);
app.use(handleCustomErrors);

module.exports = app;
