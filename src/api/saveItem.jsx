import axios from "axios";

export const saveItem = async (userData) => {
  try {
    const response = await axios.post(`https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/items/save`, userData);
    return {
      success: true,
      data: response.data
    };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : error.message,
      message: error.response 
        ? error.response.data.message || `Error: ${error.response.status}` 
        : error.message
    };
  }
};