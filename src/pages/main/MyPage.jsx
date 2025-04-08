import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import UserEdit from "../mypage/UserEdit";
import MyCustomKeyboard from "../mypage/MyCustomKeyboard";
import FavoriteProducts from "../mypage/FavoriteProducts";

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  padding: 40px;
  box-sizing: border-box;
  margin-top: 80px;
`;

const Sidebar = styled.div`
  width: 220px;
  border-right: 1px solid #ddd;
  padding-top: 120px;
`;

const MenuItem = styled.div`
  padding: 30px 20px;
  margin-top: 30px;
  cursor: pointer;
  font-size: 18px;
  font-weight: ${(props) => (props.$isActive ? "bold" : "normal")};
  color: ${(props) => (props.$isActive ? "#000" : "#666")};
  background: ${(props) => (props.$isActive ? "#f0f0f0" : "transparent")};
  &:hover {
    background: #f5f5f5;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 80px;
`;

export const MyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const selectedMenu = queryParams.get("menu") || "회원정보 수정";

  const handleMenuClick = (menu) => {
    navigate(`/mypage?menu=${encodeURIComponent(menu)}`);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case "회원정보 수정":
        return <UserEdit />;
      case "나의 커스텀 키보드":
        return <MyCustomKeyboard />;
      case "관심상품":
        return <FavoriteProducts />;
      default:
        return null;
    }
  };

  return (
    <Container>
      <Sidebar>
        {["회원정보 수정", "나의 커스텀 키보드", "관심상품"].map((menu) => (
          <MenuItem
            key={menu}
            $isActive={selectedMenu === menu}
            onClick={() => handleMenuClick(menu)}
          >
            {menu}
          </MenuItem>
        ))}
      </Sidebar>
      <Content>{renderContent()}</Content>
    </Container>
  );
};
