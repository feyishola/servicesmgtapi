const fectchApiFrontend = (path, method = "GET", payload) => {
  return new Promise(async (resolve, reject) => {
    const request = await fetch(path, {
      headers: { "Content-Type": "application/json" },
      method,
      body: JSON.stringify(payload),
    });
    const response = await request.json();
    console.log(response);
    if (response.response) {
      resolve(response.payload);
    } else {
      reject("error occured in fetching data");
    }
  });
};

export const fectchApi = fectchApiFrontend;
