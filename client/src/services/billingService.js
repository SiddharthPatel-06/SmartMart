import axios from "axios";
const API = "http://localhost:4000/api/v1";

export const addToCartService = async (data) =>
  await axios.post(`${API}/cart/add`, data);

export const generateInvoiceService = async (data) =>
  await axios.post(`${API}/invoice/generate`, data);
