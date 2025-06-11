import { Base_URL, ENDPOINTS } from "@/constants/end_points";
import axios from "axios";

const url = `${Base_URL}${ENDPOINTS.HOLIDAYS}`
export const getAllhdays = async () => {
      try {
        const res = await axios.get(url); 
        return res.data.data;
      } catch (err) {
        console.error('Error fetching holidays:', err);
      } 
    };