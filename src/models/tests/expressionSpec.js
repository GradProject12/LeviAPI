const db = require("../../database");

const ExpressionStore = require("../expression");

const store = new ExpressionStore();

describe("Expression Model", () => {
  expressionObj = {
    sound: "sound",
    status:"status"
  };
  beforeAll(async () => {
    const createdexpression=await store.create(expressionObj);
    expressionObj.id=createdexpression.id;
  });

  afterAll(async () => {
    const connection = await db.connect();
    const sql = "DELETE FROM expressions;";
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

  it("Create method should return a New expression", async () => {
    const createdexpression = await store.create(expressionObj);
    expect(createdexpression.sound).toBe('sound');
    expect(createdexpression.status).toBe('status');
  });

  it("index method should return All available expressions in DB", async () => {
    const expressions = await store.index();
    expect(expressions.length).toBe(2);
  });

  it("show method should return an expression when called with ID", async () => {
    const returnedexpression = await store.show(expressionObj.id);
    expect(returnedexpression.sound).toBe('sound');
    expect(returnedexpression.status).toBe('status');
  });

  it("Update  method should return a expression with edited attributes", async () => {
    const updatedexpression = await store.update(
      { ...expressionObj, sound: "sound2" },
      expressionObj.id
    );
    expect(updatedexpression.id).toBe(expressionObj.id);
    expect(updatedexpression.sound).toBe("sound2");
  });

  it("Delete method should delete expression from DB", async () => {
    const deletedexpression = await store.delete(expressionObj.id);
    expect(deletedexpression.status).toEqual(expressionObj.status);
  });
});
