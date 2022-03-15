const supertest = require("supertest");
const app = require("../../index");
const db = require("../../database");
const ExpressionStore = require("../../models/expression");

const request = supertest(app);
const store = new ExpressionStore();

const token = process.env.TOKEN_TEST;

describe("Test expression endpoint responses", () => {
  expressionObj = {
    sound: "sound",
    status: "status",
  };

  beforeAll(async () => {
    const createdexpression = await store.create(expressionObj);
    expressionObj.id = createdexpression.id;
  });

  afterAll(async () => {
    const connection = await db.connect();
    const sql = "DELETE FROM expressions;";
    await connection.query(sql);
    connection.release();
  });

  it("check index endpoint", async () => {
    const response = await request
      .get("/api/expressions")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it("check show endpoint", async () => {
    const response = await request
      .get(`/api/expressions/${expressionObj.id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-type", "application/json");
    expect(response.status).toBe(200);
  });

  it("check create endpoint", async () => {
    const response = await request
      .post(`/api/expressions`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        sound: "sound",
        status: "status",
      });
    expect(response.status).toBe(200);
  });

  it("check update endpoint", async () => {
    const response = await request
      .put(`/api/expressions/${expressionObj.id}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...expressionObj,
        sound: "asd",
      });
    expect(response.status).toBe(200);
  });

  it("check delete endpoint", async () => {
    const response = await request
      .delete(`/api/expressions/${expressionObj.id}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  
});
