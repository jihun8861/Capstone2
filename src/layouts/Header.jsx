import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 80px;
  padding: 0 20px;
  position: fixed;
  top: 0;
  z-index: 100;
  background-color: white;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
`;

const Nav = styled.nav`
  position: absolute;
  right: 20px;
  display: flex;
  gap: 20px;
`;

const NavItem = styled.div`
  cursor: pointer;
  font-size: 18px;
  &:hover {
    color: #007bff;
  }
`;

export const Header = () => {
  const navigate = useNavigate();
  const [isLogIn, setIsLogIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLogIn(!!token);
  }, []);

  const onClickLoginButton = () => {
    navigate("/signin");
  };

  const onClickLogoutButton = () => {
    const confirmLogout = window.confirm("정말 로그아웃 하시겠습니까?");

    if (confirmLogout) {
      localStorage.removeItem("token");
      setIsLogIn(false);
      navigate("/");
    }
  };

  const onClickHomeButton = () => {
    if (isLogIn) {
      console.log("token:", localStorage.getItem("token"));
    }
    navigate("/");
  };

  const onClickMyPageButton = () => {
    if (!isLogIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/signin");
      return;
    }
    navigate("/mypage");
  };

  const onClickSharePageButton = () => {
    if (!isLogIn) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/signin");
      return;
    }
    navigate("/sharepage");
  };

  return (
    <Container>
      <Logo onClick={onClickHomeButton}>Capstone2</Logo>
      <Nav>
        <NavItem onClick={onClickHomeButton}>홈</NavItem>
        <NavItem onClick={onClickMyPageButton}>마이페이지</NavItem>
        <NavItem onClick={onClickSharePageButton}>공유페이지</NavItem>
        {isLogIn ? (
          <NavItem onClick={onClickLogoutButton}>로그아웃</NavItem>
        ) : (
          <NavItem onClick={onClickLoginButton}>로그인</NavItem>
        )}
      </Nav>
    </Container>
  );
};
