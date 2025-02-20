import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

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
  background-color: ${(props) => (props.scrolled ? "white" : "transparent")};
  border-bottom: ${(props) =>
    props.showBorder ? "1px solid #e8e8e8" : "1px solid transparent"};
  transition: background-color 0.3s ease-in-out, border-bottom 0.3s ease-in-out;
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
  font-weight: bold;
`;

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showBorder, setShowBorder] = useState(false);

  const fixedPages = ["/signin"];

  useEffect(() => {
    if (fixedPages.includes(location.pathname)) {
      setScrolled(true);
      setShowBorder(true);
    } else {
      setScrolled(false);
      setShowBorder(false);
    }

    const handleScroll = () => {
      if (!fixedPages.includes(location.pathname)) {
        setScrolled(window.scrollY > 50);
        setShowBorder(window.scrollY > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  return (
    <Container scrolled={scrolled} showBorder={showBorder}>
      <Logo onClick={() => navigate("/")}>Capstone2</Logo>
      <Nav>
        <NavItem onClick={() => navigate("/mypage")}>마이페이지</NavItem>
        <NavItem onClick={() => navigate("/sharepage")}>공유페이지</NavItem>
        <NavItem onClick={() => navigate("/signin")}>로그인</NavItem>
      </Nav>
    </Container>
  );
};