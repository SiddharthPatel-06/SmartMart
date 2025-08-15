import axios from "axios";

const BASE_URL = "https://smartmart-qno0.onrender.com/api/v1/marts";

export const fetchMartByIdService = async (martId) => {
  if (!martId) throw new Error("Mart ID is missing.");
  const response = await axios.get(`${BASE_URL}/${martId}`);
  return response;
};

export const fetchMartByOwnerService = async (ownerId) => {
  if (!ownerId) throw new Error("Owner ID is missing.");
  const response = await axios.get(`${BASE_URL}/owner/${ownerId}`);
  return response;
};
