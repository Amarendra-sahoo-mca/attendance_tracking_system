import { Base_URL, ENDPOINTS } from "@/constants/end_points";
import axios from "axios";

const employeeUrl = `${Base_URL}${ENDPOINTS.STUDENT}`;
const attendanceUrl = `${Base_URL}${ENDPOINTS.ATTENDANCE}`;

export const getAllEmpDD = async () => {
  try {
    const res = await axios.get(employeeUrl);
    return res.data.data;
  } catch (err) {
    console.error("Error fetching employees:", err);
  }
};
export const allAttendance = async () => {
  try {
    const res = await axios.get(attendanceUrl);
    return res.data.data;
  } catch (err) {
    console.error("Error fetching leaves:", err);
  }
};

export const createAttendance = async (data:any) => {
      try {
        const res = await axios.post(attendanceUrl,data);  
        return res.data.data;
      } catch (err) {
        console.error('Error saving attendance:', err);
      } 
    };

    export const deleteAttendance = async (id:string) => {
      try {
        const res = await axios.delete(`${attendanceUrl}/${id}`,);
        return res.data.data;
      } catch (err) {
        console.error('Error deleting attendance:', err);
      } 
    };

export const editAttendance = async (data:any) => {
      try {
        const res = await axios.put(`${attendanceUrl}/${data.id}`,data);  
        return res.data.data;
      } catch (err) {
        console.error('Error updating attendance:', err);
      } 
    };