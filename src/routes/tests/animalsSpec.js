const supertest = require("supertest");
const app = require("../../index");
const db = require("../../database");
const AnimalStore = require("../../models/animal");

const request = supertest(app);
const store = new AnimalStore();

const token = process.env.TOKEN_TEST;

describe("Test animal endpoint responses", () => {
  animalObj = {
    name: "dog",
    picture: "image",
    sound: "sound",
    spelled: "spelled",
  };

  beforeAll(async () => {
    const createdanimal = await store.create(animalObj);
    animalObj.id = createdanimal.id;
  });

  afterAll(async () => {
    const connection = await db.connect();
    const sql = "DELETE FROM animals;";
    await connection.query(sql);
    connection.release();
  });

  it("check index endpoint", async () => {
    const response = await request
      .get("/api/animals")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it("check show endpoint", async () => {
    const response = await request
      .get(`/api/animals/${animalObj.id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-type", "application/json");
    expect(response.status).toBe(200);
  });

  it("check create endpoint", async () => {
    const response = await request
      .post(`/api/animals`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "cat",
        picture: "image",
        sound: "sound",
        spelled: "spelled",
      });
    expect(response.status).toBe(200);
  });

  it("check update endpoint", async () => {
    const response = await request
      .put(`/api/animals/${animalObj.id}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...animalObj,
        sound: "asd",
      });
    expect(response.status).toBe(200);
  });

  it("check delete endpoint", async () => {
    const response = await request
      .delete(`/api/animals/${animalObj.id}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  
});
