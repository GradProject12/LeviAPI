const db = require("../../database");
const AnimalStore = require("../animal");
const store = new AnimalStore();

describe("Animal Model", () => {
  animalObj = {
    name: "animal",
    picture: "image",
    sound: "sound",
    spelled: "spelled",
  };
  beforeAll(async () => {
    const createdAnimal=await store.create(animalObj);
    animalObj.id=createdAnimal.id;
  });

  afterAll(async () => {
    const connection = await db.connect();
    const sql = "DELETE FROM animals;";
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

  it("Create method should return a New animal", async () => {
    const createdanimal = await store.create(animalObj);
    expect(createdanimal.sound).toBe('sound');
    expect(createdanimal.spelled).toBe('spelled');
  });

  it("index method should return All available animals in DB", async () => {
    const animals = await store.index();
    expect(animals.length).toBe(2);
  });

  it("show method should return an animal when called with ID", async () => {
    const returnedAnimal = await store.show(animalObj.id);
    expect(returnedAnimal.sound).toBe('sound');
    expect(returnedAnimal.spelled).toBe('spelled');
  });

  it("Update  method should return a animal with edited attributes", async () => {
    const updatedAnimal = await store.update(
      { ...animalObj, sound: "sound2" },
      animalObj.id
    );
    expect(updatedAnimal.id).toBe(animalObj.id);
    expect(updatedAnimal.sound).toBe("sound2");
  });

  it("Delete method should delete animal from DB", async () => {
    const deletedAnimal = await store.delete(animalObj.id);
    expect(deletedAnimal.spelled).toEqual(animalObj.spelled);
  });
});
