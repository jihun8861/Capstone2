import styled from "styled-components";
import { useNavigate } from "react-router-dom";

const Container = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
`;

const Nav = styled.nav`
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

  return (
    <Container>
      <Logo onClick={() => navigate("/")}>Capstone2</Logo>
      <Nav>
        <NavItem onClick={() => navigate("/")}>홈</NavItem>
        <NavItem onClick={() => navigate("/mypage")}>마이페이지</NavItem>
        <NavItem onClick={() => navigate("/sharepage")}>공유페이지</NavItem>
        <NavItem onClick={() => navigate("/signin")}>로그인</NavItem>
      </Nav>
    </Container>
  );
};
