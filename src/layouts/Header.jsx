import styled from "styled-components";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { RxHamburgerMenu } from "react-icons/rx";
import { FaUserCircle } from "react-icons/fa";
import { Profile } from "../components/modal/Profile";
import { useAuthStore } from "../api/useAuthStore ";

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 80px;
  padding: 0 50px;
  position: fixed;
  top: 0;
  z-index: 100;
  background-color: ${(props) => (props.scrolled ? "white" : "transparent")};
  border-bottom: ${(props) =>
    props.showBorder ? "1px solid #e8e8e8" : "1px solid transparent"};
  transition: background-color 0.3s ease-in-out, border-bottom 0.3s ease-in-out;
`;

const MenuIconWrapper = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const LogoWrapper = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
`;

const LogoImage = styled.img`
  padding-top: 10px;
  width: 160px;
  height: 50px;
  transition: opacity 0.3s ease-in-out;
`;

const Nav = styled.nav`
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 20px;
`;

const MenuIcon = styled(RxHamburgerMenu)`
  font-size: 28px;
  cursor: pointer;
  color: ${(props) => (props.scrolled ? "black" : "white")};
`;

const NavItem = styled.div`
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  color: ${(props) => (props.scrolled ? "black" : "white")};
`;

const LoginFrame = styled.div`
  width: 170px;
  height: 45px;
  color: ${(props) => (props.scrolled ? "black" : "white")};
  border: solid 2px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  background-color: transparent;
  font-size: 16px;
  font-weight: bold;

  span {
    background-color: ${(props) =>
      props.scrolled ? "black" : "white"};
    height: 16px;
    width: 1px;
    margin: 5px 8px;
  }
`;

const ProfileIcon = styled(FaUserCircle)`
  font-size: 30px;
  cursor: pointer;
  color: ${(props) => (props.scrolled ? "black" : "white")};
`;

export const Header = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [showBorder, setShowBorder] = useState(false);
  const [isLogIn, setIsLogIn] = useState(!!localStorage.getItem("token"));
  const [showModal, setShowModal] = useState(false);

  const fixedPages = ["/signin", "/custompage"];

  const isFixedPage = (pathname) => {
    return fixedPages.includes(pathname);
  };

  useEffect(() => {
    if (isFixedPage(location.pathname)) {
      setScrolled(true);
      setShowBorder(true);
    } else {
      setScrolled(false);
      setShowBorder(false);
    }

    const handleScroll = () => {
      if (!isFixedPage(location.pathname)) {
        setScrolled(window.scrollY > 50);
        setShowBorder(window.scrollY > 50);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location.pathname]);

  useEffect(() => {
    setIsLogIn(!!user);
  }, [user]);

  const onClickLoginButton = () => {
    navigate("/signin");
  };

  const toggleModal = () => {
    setShowModal(!showModal);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLogIn(false);
    setShowModal(false);
    navigate("/");
  };

  return (
    <Container scrolled={scrolled} showBorder={showBorder}>
      <MenuIconWrapper>
        <MenuIcon scrolled={scrolled} />
      </MenuIconWrapper>
      <LogoWrapper onClick={() => navigate("/")}> 
        <LogoImage src={scrolled ? "/images/logo2.png" : "/images/logo1.png"} />
      </LogoWrapper>
      <Nav>
        <NavItem scrolled={scrolled}>고객지원</NavItem>
        <NavItem scrolled={scrolled}>찜한목록</NavItem>
        {isLogIn ? (
          <>
            <ProfileIcon scrolled={scrolled} onClick={toggleModal} />
            {showModal && (
              <Profile 
                onClose={closeModal} 
                onLogout={handleLogout} 
                showModal={showModal}
              />
            )}
          </>
        ) : (
          <LoginFrame scrolled={scrolled} onClick={onClickLoginButton}>
            로그인 <span></span> 회원가입
          </LoginFrame>
        )}
      </Nav>
    </Container>
  );
};
