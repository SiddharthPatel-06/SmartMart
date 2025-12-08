import axios from "axios";

const API_URL = "https://smartmart-qno0.onrender.com/api/v1/analytics";

export const getSalesStatsService = async (range = "daily") => {
  const res = await axios.get(`${API_URL}/sales?range=${range}`);
  return res.data;
};

export const getTopProductsService = async (limit = 5) => {
  const res = await axios.get(`${API_URL}/top-products?limit=${limit}`);
  return res.data;
};

export const getLeastProductsService = async (limit = 5) => {
  const res = await axios.get(`${API_URL}/least-products?limit=${limit}`);
  return res.data;
};

export const getExpiringProductsService = async (days = 30) => {
  const res = await axios.get(`${API_URL}/expiring-products?days=${days}`);
  return res.data;
};
