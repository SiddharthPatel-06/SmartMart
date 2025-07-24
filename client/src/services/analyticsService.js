import axios from "axios";

const API_URL = "http://localhost:4000/api/v1/analytics";

export const getSalesStatsService = async () => {
  const res = await axios.get(`${API_URL}/sales`);
  return res.data;
};

export const getTopProductsService = async () => {
  const res = await axios.get(`${API_URL}/top-products`);
  return res.data;
};

export const getLeastProductsService = async () => {
  const res = await axios.get(`${API_URL}/least-products`);
  return res.data;
};

export const getExpiringProductsService = async () => {
  const res = await axios.get(`${API_URL}/expiring-products`);
  return res.data;
};
