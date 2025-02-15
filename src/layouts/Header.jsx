import styled from "styled-components";
import { useNavigate } from "react-router-dom";

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

  const onClickLoginButton = () => {
    navigate("/signin");
  };
  const onClickHomeButton = () => {
    navigate("/");
  };
  const onClickMyPageButton = () => {
    navigate("/mypage");
  };
  const onClickSharePageButton = () => {
    navigate("/sharepage");
  };

  return (
    <Container>
      <Logo onClick={onClickHomeButton}>Capstone2</Logo>
      <Nav>
        <NavItem onClick={onClickHomeButton}>홈</NavItem>
        <NavItem onClick={onClickMyPageButton}>마이페이지</NavItem>
        <NavItem onClick={onClickSharePageButton}>공유페이지</NavItem>
        <NavItem onClick={onClickLoginButton}>로그인</NavItem>
      </Nav>
    </Container>
  );
};
