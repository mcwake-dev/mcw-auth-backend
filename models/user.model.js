const db = require("../db/db");

exports.register = async ({ username, password, given_name, surname }) => {
  const userKey = `${username}`;

  await db.WATCH(userKey);
  const userExists = await db.EXISTS(userKey);

  console.log(username, password, given_name, surname);

  if (userExists) {
    await db.UNWATCH();
    throw new Error("User already exists");
  } else {
    await db.HMSET(
      userKey,
      "username",
      username,
      "password",
      password,
      "given_name",
      given_name,
      "surname",
      surname
    );
    await db.UNWATCH();

    const user = await db.HGETALL(userKey);

    delete user.password;

    return user;
  }
};

exports.get = async (username) => {
  return await db.HGETALL(username);
};
