require("../../env/test");
const { expect, it, describe, beforeAll, afterAll } = require("@jest/globals");
const request = require("supertest");
const db = require("../../db/db");
const app = require("../../app");

beforeAll(async () => {
  await db.DEL("testuser");
});

afterAll(async () => {
  await db.quit();
});

describe("POST /api/register", () => {
  it("should respond with a new user when passed valid data", () =>
    request(app)
      .post("/api/authentication/register")
      .send({
        username: "testuser",
        password: "testpassword",
        given_name: "Test",
        surname: "User",
      })
      .expect(201)
      .then(({ body: { user } }) => {
        expect(user).toEqual(
          expect.objectContaining({
            username: "testuser",
            given_name: "Test",
            surname: "User",
          })
        );
        expect(user.password).toBeUndefined();
      }));
  it("should respond with an error when passed an existing user", () =>
    request(app)
      .post("/api/authentication/register")
      .send({
        username: "testuser",
        password: "testpassword",
        given_name: "Test",
        surname: "User",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Register User failed: Error: User already exists");
      }));
  it("should respond with an error when passed incomplete user details (missing password)", () =>
    request(app)
      .post("/api/authentication/register")
      .send({
        username: "testuser",
        given_name: "Test",
        surname: "User",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          'Register User failed: ValidationError: "password" is required'
        );
      }));
  it("should respond with an error when passed incomplete user details (missing username)", () =>
    request(app)
      .post("/api/authentication/register")
      .send({
        password: "testpassword",
        given_name: "Test",
        surname: "User",
      })
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe(
          'Register User failed: ValidationError: "username" is required'
        );
      }));
});
