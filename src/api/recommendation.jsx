// src/api/recommendation.js
export const fetchKeyboardRecommendation = async ({ size, baseColor, switchColor, keycapColors }) => {
  try {
    const response = await fetch('https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/ai/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        size: size || "60",
        currentColors: {
          barebone: baseColor,
          switch: switchColor,
          keycap: keycapColors,
        },
      }),
    });

    const result = await response.json();
    return result;
  } catch (error) {
    throw new Error("AI 추천 요청 중 오류 발생: " + error.message);
  }
};
