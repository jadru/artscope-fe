import axios from "axios";
import cookie from "react-cookies";
import { toast } from "react-toastify";

import { standardLabel } from "@/components/shared/StandardLabel";
import { NEXT_PUBLIC_ROOT_URL } from "@/constant/env";

const Jxios = axios.create({
  baseURL: typeof window !== "undefined" ? "" : NEXT_PUBLIC_ROOT_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
});

Jxios.interceptors.response.use(
  (res) => {
    // every response will be decoded
    if (res.data) {
      if (typeof res.data === "string") {
        res.data = standardLabel(res.data);
      } else if (typeof res.data === "object") {
        Object.keys(res.data).forEach((key) => {
          if (typeof res.data[key] === "string") {
            res.data[key] = standardLabel(res.data[key]);
          }
        });
      }
    }
    return res;
  },
  async (err) => {
    const { config, response } = err;
    if (response && response.status) {
      switch (response.status || config.sent) {
        case 400:
        case 401:
          if (typeof window !== "undefined")
            toast.error(`
              ${response.data.message}
                ${
                  response.data.detail !== null
                    ? " : " + response.data.detail
                    : ""
                }`);
          return Promise.reject(err);
        case 403:
        case 502:
        case 500:
          return Promise.reject(err);
        default:
          if (typeof window !== "undefined")
            toast.error(`
              ${response.data.message}
                ${
                  response.data.detail !== null
                    ? " : " + response.data.detail
                    : ""
                }`);
          return Promise.reject(err);
      }
    }
    return Promise.reject(err);
  }
);

export default Jxios;
