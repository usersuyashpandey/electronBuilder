import axios from "axios";

export const getModelApiData = async (model, payload) => {
  const url = `https://modelsdev.onxecta.com${model}`;
  return await axios.post(url, payload, {
    headers: {
      "Content-type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
