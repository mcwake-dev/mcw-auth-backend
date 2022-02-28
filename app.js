const express = require("express");
const session = require("express-session");
const cors = require("cors");
const redis = require("redis");
const connectRedis = require("connect-redis");
const bodyParser = require("body-parser");
const uuid = require("uuid");

const RedisStore = connectRedis(session);
const redisClient = redis.createClient({
  host: process.env.REDIS_HOST || "localhost",
  port: process.env.REDIS_PORT || "6379",
});
const apiRouter = require("./routes/api.route");
const { handleServerErrors, handleCustomErrors } = require("./errors");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: uuid.v4(),
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: false,
      maxAge: 1000 * 60 * 10,
    },
  })
);
app.use("/api", apiRouter);
app.use("", (req, res, next) => next({ status: 404, msg: "Not found" }));
app.use(handleServerErrors);
app.use(handleCustomErrors);

module.exports = app;
