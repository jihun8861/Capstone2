import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const KakaoRedirect = () => {
  const navigate = useNavigate();
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  useEffect(() => {
    console.log("카카오 인가 코드:", code);

    if (code) {
      axios
        .post(
          "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/social/kakao/login",
          { code },
          {
            headers: {
              "Content-Type": "application/json;charset=UTF-8",
              Accept: "application/json;charset=UTF-8",
            },
            withCredentials: true,
          }
        )
        .then((response) => {
          console.log("✅ 로그인 성공:", response.data);
          localStorage.setItem("token", response.data.token);
          navigate("/");
        })
        .catch((error) => {
          console.error("❌ 카카오 로그인 실패: ", error);
          if (error.response) {
            console.error("📌 서버 응답:", error.response);
          } else {
            console.error("📌 응답 없음, 네트워크 오류 가능성");
          }
          navigate("/signin");
        });
    }
  }, []);

  return <div>카카오 로그인 중...</div>;
};
