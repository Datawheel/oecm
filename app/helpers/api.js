import axios from "axios";
const clientConfig = {
  host: process.env.MM_HOSTNAME || "localhost",
  port: process.env.MM_PORT || "3300"
};

let baseURL = `http://${clientConfig.host}:${clientConfig.port}`;
if (process.env.NODE_ENV === "production") {
  baseURL = "https://macro.market";
}
export const url = baseURL;

const axiosInstance = axios.create({baseURL});

export default axiosInstance;
