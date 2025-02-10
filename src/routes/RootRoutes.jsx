import { Route, Routes } from "react-router-dom";
import { MainPage } from "../pages/main/MainPage";
import { SignInPage } from "../pages/login/SignIn";
import Layout from "../layouts/Layout";

export const RootRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout mainContent={<MainPage/>} />} />
      <Route path="/signin" element={<Layout mainContent={<SignInPage/>} />} />
      <Route/>
    </Routes>
  )
}