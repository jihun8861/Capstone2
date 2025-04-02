import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../api/useAuthStore";

export const KakaoRedirect = () => {
  const navigate = useNavigate();
  const { fetchUserData } = useAuthStore(); // Zustand에서 fetchUserData 함수 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get("code");

  useEffect(() => {
    if (!code) {
      console.error("❌ 인가 코드 없음");
      navigate("/signin");
      return;
    }

    console.log("카카오 인가 코드:", code);

    axios
      .post(
        "https://port-0-edcustom-lxx6l4ha4fc09fa0.sel5.cloudtype.app/social/kakao/login",
        { code },
        {
          headers: {
            "Content-Type": "application/json;charset=UTF-8",
            Accept: "application/json;charset=UTF-8",
          },
        }
      )
      .then(async (response) => {
        console.log(
          "✅ 로그인 성공 응답:",
          JSON.stringify(response.data, null, 2)
        );

        let token;

        // 새로운 응답 형식: data 필드 자체가 토큰인 경우
        if (response.data.data && typeof response.data.data === "string") {
          token = response.data.data;
          console.log("✅ data 필드에서 토큰 추출 (문자열):", token);
        }
        // 기존 형식: data.token 객체가 있는 경우
        else if (response.data.data && response.data.data.token) {
          token = response.data.data.token;
          console.log("✅ data.token에서 토큰 추출:", token);
        }
        // 기존 형식: token 필드가 있는 경우
        else if (response.data.token) {
          token = response.data.token;
          console.log("✅ token 필드에서 토큰 추출:", token);
        } else {
          console.error("❌ 토큰을 찾을 수 없음");
          navigate("/signin");
          return;
        }

        // 토큰 저장
        localStorage.setItem("token", token);
        console.log("✅ 토큰 저장 완료");

        // 로그인 후 유저 정보 가져오기
        try {
          await fetchUserData();
          console.log("✅ 유저 정보 불러오기 성공");
        } catch (error) {
          console.error("❌ 유저 정보 불러오기 실패:", error);
        }

        // 이동할 페이지 결정
        let redirectTo = localStorage.getItem("redirectTo") || "/";

        // 로그인 페이지에 머물러 있지 않도록 보장
        if (redirectTo === "/signin") {
          redirectTo = "/";
        }

        console.log("✅ 리다이렉트:", redirectTo);
        navigate(redirectTo);
        localStorage.removeItem("redirectTo");
      })
      .catch((error) => {
        console.error("❌ 카카오 로그인 실패: ", error);
        // 오류 상세 정보 로깅
        if (error.response) {
          console.error("❌ 서버 응답:", error.response.data);
          console.error("❌ 상태 코드:", error.response.status);
        } else if (error.request) {
          console.error("❌ 요청은 전송되었으나 응답 없음");
        } else {
          console.error("❌ 요청 설정 중 오류:", error.message);
        }
        navigate("/signin");
      });
  }, [code, navigate, fetchUserData]);

  return <div>카카오 로그인 중...</div>;
};
