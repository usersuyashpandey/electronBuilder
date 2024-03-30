import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiKey = localStorage.getItem("apiKey");

const axiosClient = axios.create({
  baseURL: "https://xecta-model-apis.p.rapidapi.com/",
  headers: {
    "x-rapidapi-host": "xecta-model-apis.p.rapidapi.com",
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    localStorage.setItem("apiKey", response.config.headers["X-RapidAPI-Key"]);
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosClient;

export const healthCheckEndpoint = async (apiKey) => {
  const response = await axiosClient.get("/", {
    headers: {
      "X-RapidAPI-Key": apiKey,
      "X-RapidAPI-Host": "xecta-model-apis.p.rapidapi.com",
    },
  });
  if (response.status === 200) {
    toast.success("API key is valid and successfully added to local cache");
    localStorage.setItem("apiKey", JSON.stringify(apiKey));
  }
  return response;
};

export function getPvtDetails(data) {
  return axiosClient.post("PVT/saturated_oil_array_input", data);
}

const options = {
  method: "POST",
  url: "https://xecta-model-apis.p.rapidapi.com/BHP/pipe_flow",
  headers: {
    "content-type": "application/json",
    // "X-RapidAPI-Key": apiKey,
    "X-RapidAPI-Host": "xecta-model-apis.p.rapidapi.com",
  },
};

export const getBHPDetails = async (data) => {
  try {
    const response = await axiosClient.request({
      ...options,
      data: data,
    });
    if (response.status === 200) {
      return response;
    }
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
