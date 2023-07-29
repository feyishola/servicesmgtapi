const { env } = require("../config");
const { fectchApi } = require("./fetch");

export const getRequest = async (api, token) => {
  const response = await fectchApi(env.baseUrl + `${api}`, "GET", null, token);
  return response;
};

export const postRequest = async (api, payload) => {
  const response = await fectchApi(env.baseUrl + `${api}`, "POST", payload);
  return response;
};
