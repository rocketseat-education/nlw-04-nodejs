import request from "supertest";
import { getConnection, getCustomRepository } from "typeorm";
import { app } from "../app";

import createConnection from "../database";
import { UsersRepository } from "../repositories/UsersRespository";

describe("Users", () => {
  beforeAll(async () => {
    const connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close();
  });
  it("Should be able to create a new user", async () => {
    const response = await request(app).post("/users").send({
      email: "user@example.com",
      name: "User Example",
    });

    expect(response.status).toBe(201);
  });
  it("Should not be able to create a user with exists email", async () => {
    const response = await request(app).post("/users").send({
      email: "user@example.com",
      name: "User Example",
    });

    expect(response.status).toBe(400);
  });

  it("Should be able to delete a user", async () => {
    const user = await request(app).post("/users").send({
      email: "fulano@example.com",
      name: "Fulano",
    });
    const response = await request(app).delete(`/users/${user.body.id}`);

    expect(response.status).toBe(204);
  });

  it("Should not be able to delete a user that don't exists", async () => {
    const user = {
      id: "123",
      name: "Fulano",
      email: "fulano@example.com",
    };

    const response = await request(app).delete(`/users/${user.id}`);

    expect(response.status).toBe(400);
  });

  it("Should remove the user from the database", async () => {
    const usersRepository = getCustomRepository(UsersRepository);
    const user = await request(app).post("/users").send({
      email: "fulano@example.com",
      name: "Fulano",
    });

    const response = await request(app).delete(`/users/${user.body.id}`);

    expect(response.status).toBe(204);

    const deletedUser = await usersRepository.findOne(user.body.id);

    expect(deletedUser).toBeUndefined();
  });
});
