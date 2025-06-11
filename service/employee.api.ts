import { EmployeeCreateDTO } from "@/app/api/employee/Employee.dto";
import { Base_URL, ENDPOINTS } from "@/constants/end_points";
import axios from "axios";

  export const getAllEmp = async () => {
        try {
          const res = await axios.get(`${Base_URL}${ENDPOINTS.STUDENT}`); 
          return res.data.data;
        } catch (err) {
          console.error('Error fetching employees:', err);
        } 
      };
export const createEmployee = async (data:any) => {
      try {
        const res = await axios.post(`${Base_URL}${ENDPOINTS.STUDENT}`,data);  
        return res.data.data;
      } catch (err) {
        console.error('Error saving employees:', err);
      } 
    };
export const editEmployee = async (data:any) => {
      try {
        const res = await axios.put(`${Base_URL}${ENDPOINTS.STUDENT}/${data.id}`,data);  
        return res.data.data;
      } catch (err) {
        console.error('Error saving employees:', err);
      } 
    };
export const deleteEmployee = async (id:string) => {
      try {
        const res = await axios.delete(`${Base_URL}${ENDPOINTS.STUDENT}/${id}`,);  
        return res.data.data;
      } catch (err) {
        console.error('Error deleting employees:', err);
      } 
    };