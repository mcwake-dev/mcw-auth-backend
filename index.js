const app = require("./app");
const logger = require("./log").getLogger("Index");

app.listen(process.env.PORT, () => {
  logger.info(`Listening on port ${process.env.PORT}`);
});
