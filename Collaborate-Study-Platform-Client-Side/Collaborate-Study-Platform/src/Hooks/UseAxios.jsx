import axios from "axios";
import React from "react";

const UseAxios = () => {
  const axiosInstance = axios.create({
    baseURL: `https://collaborate-study-platform-server-s.vercel.app`,
  });
  return axiosInstance;
};

export default UseAxios;
