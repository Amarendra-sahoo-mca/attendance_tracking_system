import { Base_URL, ENDPOINTS } from "@/constants/end_points";
import axios from "axios";

export const getAllHoliday = async () => {
  try {
    const res = await axios.get(`${Base_URL}${ENDPOINTS.HOLIDAYS}`);
    return res.data.data;
  } catch (err) {
    console.error("Error fetching Holiday:", err);
  }
};
export const getOneHoliday = async (id:string) => {
  try {
    const res = await axios.get(`${Base_URL}${ENDPOINTS.HOLIDAYS}/${id}`);
    return res.data.data;
  } catch (err) {
    console.error("Error fetching Holiday profile:", err);
  }
};
export const createHoliday = async (data: any) => {
  try {
    const res = await axios.post(`${Base_URL}${ENDPOINTS.HOLIDAYS}`, data);
    return res.data;
  } catch (err: any) {
    console.error("Error saving Holiday:", err.response?.data);
    throw err.response?.data || { message: "Unknown error" };
  }
};
export const editHoliday = async (data: any) => {
  try {
    const res = await axios.put(
      `${Base_URL}${ENDPOINTS.HOLIDAYS}/${data.id}`,
      data
    );
    return res.data.data;
  } catch (err) {
    console.error("Error saving Holiday:", err);
  }
};
export const deleteHoliday = async (id: string) => {
  try {
    const res = await axios.delete(`${Base_URL}${ENDPOINTS.HOLIDAYS}/${id}`);
    return res.data.data;
  } catch (err) {
    console.error("Error deleting Holiday:", err);
  }
};
