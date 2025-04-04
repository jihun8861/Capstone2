import { useRef } from "react";
import styled from "styled-components";
import { BsPerson, BsHeart } from "react-icons/bs";
import { FiPower } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../api/useAuthStore";

const Modal = styled.div`
  position: absolute;
  top: 70px;
  right: 50px;
  width: 310px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 15px;
  display: flex;
  flex-direction: column;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #e8e8e8;
`;

const ProfileImage = styled.div`
  width: 50px;
  height: 50px;
  background-color: #f4a261;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  margin-right: 15px;
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  font-size: 16px;
  line-height: 1.6;
`;

const ModalItem = styled.div`
  padding: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  &:hover {
    background: #f5f5f5;
    border-radius: 8px;
  }
`;

export const Profile = ({ onClose, onLogout }) => {
  const navigate = useNavigate();
  const modalRef = useRef(null);
  const { user } = useAuthStore();

  const onClickLogoutButton = () => {
    if (window.confirm("정말 로그아웃 하시겠습니까?")) {
      onLogout();
    }
  };

  const handleNavigate = (path) => {
    onClose();
    navigate(path);
  };

  return (
    <Modal ref={modalRef}>
      <ProfileSection>
        <ProfileImage></ProfileImage>
        <ProfileInfo>
          <h4>{user.name}</h4>
          <span>{user.email}</span>
        </ProfileInfo>
      </ProfileSection>

      <ModalItem onClick={() => handleNavigate("/mypage")}>
        <BsPerson /> 마이페이지
      </ModalItem>
      <ModalItem onClick={onClose}>
        <BsHeart /> 찜한목록
      </ModalItem>

      <div style={{ borderTop: "1px solid #e8e8e8", margin: "5px 0" }} />
      <ModalItem onClick={onClickLogoutButton}>
        <FiPower /> 로그아웃
      </ModalItem>
    </Modal>
  );
};
