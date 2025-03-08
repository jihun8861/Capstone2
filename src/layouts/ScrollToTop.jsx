import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styled from "styled-components";
import { FaArrowUp } from "react-icons/fa";

const ScrollButton = styled.button`
  position: fixed;
  bottom: 60px;
  right: 40px;
  width: 65px;
  height: 65px;
  background-color: black;
  color: white;
  border: none;
  border-radius: 50%;
  display: ${({ show }) => (show ? "flex" : "none")};
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: opacity 0.3s, transform 0.3s;
`;

export const ScrollToTop = () => {
  const { pathname } = useLocation(); // 현재 경로 가져오기
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 200);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // 현재 페이지가 "/"(메인 페이지)가 아닐 경우 버튼 숨김
  if (pathname !== "/") return null;

  return (
    <ScrollButton onClick={scrollToTop} show={isVisible}>
      <FaArrowUp size={20} />
    </ScrollButton>
  );
};
