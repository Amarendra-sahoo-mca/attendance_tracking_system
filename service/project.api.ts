import { Base_URL, ENDPOINTS } from "@/constants/end_points";
import axios from "axios";

export const getAllProject = async () => {
  try {
    const res = await axios.get(`${Base_URL}${ENDPOINTS.PROJECT}`);
    return res.data.data;
  } catch (err) {
    console.error("Error fetching Project:", err);
  }
};
export const getOneProject = async (id:string) => {
  try {
    const res = await axios.get(`${Base_URL}${ENDPOINTS.PROJECT}/${id}`);
    return res.data.data;
  } catch (err) {
    console.error("Error fetching Project profile:", err);
  }
};
export const createProject = async (data: any) => {
  try {
    const res = await axios.post(`${Base_URL}${ENDPOINTS.PROJECT}`, data);
    return res.data;
  } catch (err: any) {
    console.error("Error saving Project:", err.response?.data);
    throw err.response?.data || { message: "Unknown error" };
  }
};
export const editProject = async (data: any) => {
  try {
    const res = await axios.put(
      `${Base_URL}${ENDPOINTS.PROJECT}/${data.id}`,
      data
    );
    return res.data.data;
  } catch (err) {
    console.error("Error saving Project:", err);
  }
};
export const deleteProject = async (id: string) => {
  try {
    const res = await axios.delete(`${Base_URL}${ENDPOINTS.PROJECT}/${id}`);
    return res.data.data;
  } catch (err) {
    console.error("Error deleting Project:", err);
  }
};
