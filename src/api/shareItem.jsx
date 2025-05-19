import axios from "axios";

export const shareItem = async (formData) => {
  try {
    console.log("shareItem 함수 호출됨");

    console.log("FormData 내용:");
    for (let pair of formData.entries()) {
      console.log(pair[0], typeof pair[1], pair[1]);
    }

    const response = await axios.post(
      `https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/shareditems/save`,
      formData,
      {
        headers: {},
        timeout: 30000,
      }
    );

    console.log("API 응답:", response.data);

    if (response.data && response.data.status === "OK") {
      return {
        success: true,
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.data?.message || "응답에 오류가 있습니다",
        data: response.data,
      };
    }
  } catch (error) {
    console.error("shareItem API 오류:", error);

    return {
      success: false,
      error: error.response ? error.response.data : error.message,
      message: error.response
        ? error.response.data?.message || `Error: ${error.response.status}`
        : error.message || "네트워크 오류가 발생했습니다",
    };
  }
};
