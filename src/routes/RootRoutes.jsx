import { Route, Routes } from "react-router-dom";
import { MainPage } from "../pages/main/MainPage";
import { SignInPage } from "../pages/login/SignIn";
import { CustomPage } from "../pages/custom/CustomPage";
import { SignUpPage } from "../pages/login/SignUp";
import { MyPage } from "../pages/main/MyPage";
import { KakaoRedirect } from "../pages/login/KakaoRedirect";
import Layout from "../layouts/Layout";

export const RootRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout mainContent={<MainPage />} />} />
      <Route path="/signin" element={<Layout mainContent={<SignInPage />} />} />
      <Route
        path="/custompage"
        element={<Layout mainContent={<CustomPage />} />}
      />
      <Route path="/signin" element={<Layout mainContent={<SignInPage />} />} />
      <Route path="/signup" element={<Layout mainContent={<SignUpPage />} />} />
      <Route path="/kakaoRedirect" element={<KakaoRedirect />} />
      <Route path="/mypage" element={<Layout mainContent={<MyPage />} />} />
    </Routes>
  );
};
