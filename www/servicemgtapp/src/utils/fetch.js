const fectchApiFrontend = (path, method = "GET", payload, token) => {
  return new Promise(async (resolve, reject) => {
    const request = await fetch(path, {
      headers: {
        "Content-Type": "application/json",
        "x-access-token": { token },
      },
      method,
      body: payload ? JSON.stringify(payload) : null,
    });
    const response = await request.json();
    console.log(response);
    if (response.response) {
      resolve(response.payload);
    } else {
      reject(response.payload || "error occured in fetching data");
    }
  });
};

export const fectchApi = fectchApiFrontend;
