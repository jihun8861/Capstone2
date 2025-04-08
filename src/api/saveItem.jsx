import axios from "axios";

export const saveItem = async (formData) => {
  try {
    const response = await axios.post(
      `https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/items/save`,
      formData,
      {
        headers: {
          // multipart/form-data를 위해 명시적으로 content-type을 설정하지 않음
          // axios가 자동으로 boundary와 함께 적절한 content-type을 설정함
        }
      }
    );
    return {
      success: true,
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      error: error.response ? error.response.data : error.message,
      message: error.response
        ? error.response.data.message || `Error: ${error.response.status}`
        : error.message,
    };
  }
};