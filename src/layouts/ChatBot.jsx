import styled from "styled-components";
import { useLocation } from "react-router-dom";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

const ChatBotButton = styled.div`
  position: fixed;
  bottom: 80px;
  right: 40px;
  width: 65px;
  height: 65px;
  background-color: ${({ isOpen }) => (isOpen ? "#004aad" : "black")};
  border: none;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: background-color 0.5s, transform 0.5s;
`;

const ChatIcon = styled.img`
  width: 30px;
  height: 30px;
`;

const ModalWrapper = styled.div`
  position: fixed;
  bottom: 160px;
  right: 40px;
  width: 370px;
  height: 600px;
  background: white;
  border-radius: 30px;
  padding: 20px;
  display: ${({ isOpen }) => (isOpen ? "flex" : "none")};
  flex-direction: column;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transform: translateY(${({ isOpen }) => (isOpen ? "0" : "20px")});
  transition: opacity 0.3s, transform 0.3s;
`;

export const ChatBot = () => {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  if (pathname !== "/") return null;

  return (
    <>
      <ChatBotButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <IoClose size={30} color="white" /> : <ChatIcon src="/images/chat.png" alt="Chat" />}
      </ChatBotButton>
      <ModalWrapper isOpen={isOpen}>
        <h2>챗봇</h2>
      </ModalWrapper>
    </>
  );
};
