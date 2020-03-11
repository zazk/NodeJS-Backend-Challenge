const request = require("supertest");

const setUpAuth = (ask, options = {}) => {
  return ask
    .set("Accept", "application/json")
    .set("Authorization", process.env.API_AUTH_TOKEN)
    .send(options.data || {});
};

const makeRequest = async (app, path, options = {}) => {
  const method = options.method || "get";
  switch (method) {
    case "post":
      return setUpAuth(request(app).post(path), options);
    case "put":
      return setUpAuth(request(app).put(path), options);
    case "delete":
      return setUpAuth(request(app).delete(path), options);
    case "get":
      return setUpAuth(request(app).get(path));
    case "patch":
      return setUpAuth(request(app).patch(path), options);
  }
};

module.exports.setUpAuth = setUpAuth;
module.exports.makeRequest = makeRequest;
