import styled from "styled-components";
import { FiX } from "react-icons/fi";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
`;

const ModalContainer = styled.div`
  background-color: white;
  width: 100%;
  max-width: 500px;
  border-radius: 0;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`;

const ModalTitle = styled.img`
  width: 150px;
  padding-top: 15px;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 42px;
  cursor: pointer;
  display: flex;
  align-items: center;
  color: #333;
  position: absolute;
  right: 16px;
  top: 30%;
`;

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 20px 0;
`;

const ModelImageContainer = styled.div`
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  margin-bottom: 20px;
  background-color: #eaecef;
`;

const ModelImage = styled.img`
  width: 170%;
  padding-right: 80px;
`;

const MessageText = styled.p`
  text-align: center;
  font-size: 18px;
  margin: 20px 0 40px;
  padding: 0 20px;
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
`;

const ButtonHalf = styled.button`
  flex: 1;
  padding: 18px 0;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border: none;

  &.cancel {
    background-color: #333;
    color: white;
  }

  &.confirm {
    background-color: #004aad;
    color: white;
  }
`;

export const RestartModal = ({ isOpen, onClose, onConfirm, imageSrc, message }) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle src="/images/custom.png" />
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>
        <ModalContent>
          <ModelImageContainer>
            <ModelImage src={imageSrc} alt="현재 키보드 모델" />
          </ModelImageContainer>
          <MessageText>{message}</MessageText>
        </ModalContent>
        <ButtonContainer>
          <ButtonHalf className="cancel" onClick={onClose}>
            취소
          </ButtonHalf>
          <ButtonHalf className="confirm" onClick={onConfirm}>
            다시 시작하기
          </ButtonHalf>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};