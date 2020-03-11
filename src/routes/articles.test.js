const utils = require("../utils");
let server = require("../server");
const mongoose = require("../config/mongoose");

describe("Article Test", () => {
  server = require("../server");
  describe("Article Creation", () => {
    it("should create a new article", async () => {
      const resUser = await utils.makeRequest(server, "/users", {
        method: "post",
        data: {
          name: "User Temp Test",
          avatar: "avatar://"
        }
      });
      const resArticle = await utils.makeRequest(server, "/articles", {
        method: "post",
        data: {
          userId: resUser.body._id,
          title: "Sample title",
          text: "Sample text",
          tags: ["some-tag-test"]
        }
      });
      expect(resArticle.statusCode).toEqual(201);
      expect(resArticle.body).toHaveProperty("_id");
    });

    it("should fail to create a new article", async () => {
      const resArticle = await utils.makeRequest(server, "/articles", {
        method: "post",
        data: {
          title: "Sample title",
          text: "Sample text",
          tags: ["some-tag-test"]
        }
      });
      expect(resArticle.statusCode).toEqual(400);
    });
  });

  describe("Article list", () => {
    it("should list a articles", async () => {
      const res = await utils.makeRequest(server, "/articles");
      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty("length");
    });
  });

  describe("Article search by tags", () => {
    it("should list a articles", async () => {
      const listTestArticles = await utils.makeRequest(
        server,
        "/articles/search?tag=some-tag-test"
      );

      for (let article of listTestArticles.body) {
        const resDel = await utils.makeRequest(
          server,
          `/article/${article._id}`,
          {
            method: "delete"
          }
        );
      }
      expect(listTestArticles.statusCode).toEqual(200);
      expect(listTestArticles.body.length).toBeGreaterThanOrEqual(1);
      expect(listTestArticles.body).toHaveProperty("length");
    });
  });

  describe("Article delete", () => {
    it("should delete a article", async () => {
      const listArticle = await utils.makeRequest(server, "/article");
      const articlesCount = listArticle.body.length;
      if (articlesCount) {
        const article = listArticle.body[articlesCount - 1];
        const resDel = await utils.makeRequest(
          server,
          `/article/${article._id}`,
          {
            method: "delete"
          }
        );
        const _listArticle = await utils.makeRequest(server, "/article");
        expect(_listArticle.body.length).toEqual(articlesCount - 1);
      }
    });
  });

  afterAll(async done => {
    await server.close(done);
    await mongoose.disconnect();
  });
});
