import React, { useState } from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  width: 100%;
  min-height: 100vh;
  padding: 40px;
  box-sizing: border-box;
`;

const Sidebar = styled.div`
  width: 250px;
  border-right: 1px solid #ddd;
`;

const MenuItem = styled.div.attrs((props) => ({
  "data-active": props.isActive ? "true" : "false",
}))`
  padding: 15px 20px;
  cursor: pointer;
  font-size: 18px;
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
  color: ${(props) => (props.isActive ? "#000" : "#666")};
  background: ${(props) => (props.isActive ? "#f0f0f0" : "transparent")};

  &:hover {
    background: #f5f5f5;
  }
`;

const Content = styled.div`
  flex: 1;
  padding: 20px;
`;

export const MyPage = () => {
  const [selectedMenu, setSelectedMenu] = useState("회원정보 수정");

  const renderContent = () => {
    switch (selectedMenu) {
      case "회원정보 수정":
        return <div>회원정보 수정 화면</div>;
      case "나의 커스텀 키보드":
        return <div>커스텀 키보드 화면</div>;
      case "관심상품":
        return <div>관심상품 화면</div>;
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
            isActive={selectedMenu === menu}
            onClick={() => setSelectedMenu(menu)}
          >
            {menu}
          </MenuItem>
        ))}
      </Sidebar>
      <Content>{renderContent()}</Content>
    </Container>
  );
};
