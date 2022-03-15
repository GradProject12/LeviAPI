const supertest = require("supertest");
const app = require('../../index')
const db = require("../../database");
const UserStore=require('../../models/user')

const request = supertest(app);
const store = new UserStore();

const token=process.env.TOKEN_TEST

describe("Test User endpoint responses", () => {

  userObj = {
    username: "user",
    password: "123",
    email: "email",
  };

  beforeAll(async () => {
    const createdUser=await store.create(userObj);
    userObj.user_id=createdUser.user_id;
  });

  afterAll(async () => {
    const connection = await db.connect();
    const sql = "DELETE FROM users;";
    await connection.query(sql);
    connection.release();
  });

  it("check index endpoint", async () => {
    const response = await request
      .get("/api/users")
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });

  it("check show endpoint", async () => {
    const response = await request
      .get(`/api/users/${userObj.user_id}`)
      .set("Authorization", `Bearer ${token}`)
      .set("Content-type", "application/json");
    expect(response.status).toBe(200);
    
  });

  it("check create endpoint", async () => {
    const response = await request
      .post(`/api/users`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        username: "user2",
        password:'user2',
        email:'email2'
      });
    expect(response.status).toBe(200);
    
  });

  it("check update endpoint", async () => {
    const response = await request
      .put(`/api/users/${userObj.user_id}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`)
      .send({
        ...userObj,
        email: 'asd',
      });
    expect(response.status).toBe(200);
    
  });

  it("check delete endpoint", async () => {
    const response = await request
      .delete(`/api/users/${userObj.user_id}`)
      .set("Content-type", "application/json")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    
  });

  it("check auth endpoint", async () => {
    const response = await request
      .post(`/api/users/auth`)
      .set("Content-type", "application/json")
      .send({
        username:'user2',
        password:'user2'
      });
    expect(response.status).toBe(200);
    
  });

})