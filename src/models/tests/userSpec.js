const db = require("../../database");

const UserStore = require("../user");

const store = new UserStore();

describe("user Model", () => {
  userObj = {
    username: "admin",
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

  it("should have an index function", () => {
    expect(store.index).toBeDefined();
  });

  it("should have an create function", () => {
    expect(store.create).toBeDefined();
  });

  it("should have an update function", () => {
    expect(store.update).toBeDefined();
  });

  it("should have an delete function", () => {
    expect(store.delete).toBeDefined();
  });

  it("Create method should return a New user", async () => {
    const createduser = await store.create({username: "admin2",email: "123",email: "admin2"});
    expect(createduser.username).toBe('admin2');
    expect(createduser.email).toBe('admin2');
  });

  it("index method should return All available users in DB", async () => {
    const users = await store.index();
    expect(users.length).toBe(2);
  });

  it("show method should return an user when called with ID", async () => {
    const returneduser = await store.show(userObj.user_id);
    expect(returneduser.username).toBe('user');
    expect(returneduser.email).toBe('email');
  });

  it("Update  method should return a user with edited attributes", async () => {
    const updateduser = await store.update(
      { ...userObj, username: "admin5" },
      userObj.user_id
    );
    expect(updateduser.user_id).toBe(userObj.user_id);
    expect(updateduser.username).toBe("admin5");
  });

  it("Delete method should delete user from DB", async () => {
    const deleteduser = await store.delete(userObj.user_id);
    expect(deleteduser.email).toEqual(userObj.email);
  });
});
