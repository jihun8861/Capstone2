import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../api/useAuthStore ";

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
        console.log("✅ 로그인 성공:", response.data);
        localStorage.setItem("token", response.data.data);

        // ✅ 로그인 후 바로 유저 정보 가져오기
        await fetchUserData();

        // ✅ 이동할 페이지 결정
        let redirectTo = localStorage.getItem("redirectTo") || "/";

        // ✅ 로그인 페이지에 머물러 있지 않도록 보장
        if (redirectTo === "/signin") {
          redirectTo = "/";
        }

        navigate(redirectTo);
        localStorage.removeItem("redirectTo");
      })
      .catch((error) => {
        console.error("❌ 카카오 로그인 실패: ", error);
        navigate("/signin");
      });
  }, []);

  return <div>카카오 로그인 중...</div>;
};
