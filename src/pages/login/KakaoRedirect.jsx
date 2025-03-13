import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuthStore } from "../../api/useAuthStore ";

export const KakaoRedirect = () => {
  const navigate = useNavigate();
  const { fetchUserData } = useAuthStore();
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
        localStorage.setItem("token", response.data.data.token);

        await fetchUserData();

        let redirectTo = localStorage.getItem("redirectTo") || "/";

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