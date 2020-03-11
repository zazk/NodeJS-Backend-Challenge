const utils = require("../utils");
const server = require("../server");
const mongoose = require("../config/mongoose");

describe("User Test", () => {
  describe("User Creation", () => {
    it("It should fail to create a new user", async () => {
      const res = await utils.makeRequest(server, "/users", {
        method: "post",
        data: {
          name_x: "User Temp Test for delete",
          avatar_x: "avatar://"
        }
      });
      expect(res.statusCode).toEqual(400);
    });
    it("should create a new user", async () => {
      const res = await utils.makeRequest(server, "/users", {
        method: "post",
        data: {
          name: "User Temp Test",
          avatar: "avatar://"
        }
      });
      const newTestName = "User Temp Test - Edited";
      const resEdit = await utils.makeRequest(
        server,
        `/users/${res.body._id}`,
        {
          method: "patch",
          data: {
            name: newTestName
          }
        }
      );
      expect(resEdit.statusCode).toEqual(200);
      expect(resEdit.body.name).toEqual(newTestName);

      const article = await utils.makeRequest(server, `/articles`, {
        method: "post",
        data: {
          userId: res.body._id,
          title: "Some Title - Test",
          text: "Some text - Test",
          tags: ["Some-Test-Tag"]
        }
      });
      expect(article.statusCode).toEqual(201);
      expect(article.body).toHaveProperty("_id");
      expect(article.body.userId).toEqual(res.body._id);
    });
  });

  describe("User list", () => {
    it("should list a users", async () => {
      const res = await utils.makeRequest(server, `/users`);
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("length");
    });
  });

  describe("User delete", () => {
    it("should delete a users", async () => {
      const listUser = await utils.makeRequest(server, "/users");
      const userCount = listUser.body.length;
      if (userCount) {
        const user = listUser.body[userCount - 1];
        const resDel = await utils.makeRequest(server, `/users/${user._id}`, {
          method: "delete"
        });
        const _listUser = await utils.makeRequest(server, "/users");
        expect(_listUser.body.length).toEqual(userCount - 1);
      }
    });
  });

  afterAll(async done => {
    await server.close(done);
    await mongoose.disconnect();
  });
});
