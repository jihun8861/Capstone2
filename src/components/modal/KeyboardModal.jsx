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
  margin: 20px 0;
  padding: 0 20px;
`;

// 제목 입력 필드 관련 스타일 컴포넌트 추가
const TitleInputContainer = styled.div`
  padding: 0 30px;
  margin-bottom: 30px;
`;

const TitleLabel = styled.label`
  display: block;
  font-size: 16px;
  font-weight: bold;
  margin-bottom: 8px;
  color: #333;
`;

const TitleInput = styled.input`
  width: 100%;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  background-color: #f9f9f9;
  &:focus {
    outline: none;
    border-color: #004aad;
    box-shadow: 0 0 0 2px rgba(0, 74, 173, 0.2);
  }
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

export const KeyboardModal = ({ 
  isOpen,
  onClose, 
  onConfirm, 
  imageSrc, 
  message, 
  confirmText = "확인", 
  cancelText = "취소",
  title = "/images/custom.png",
  showTitleInput = false, // 제목 입력 필드 표시 여부
  titleValue = "", // 제목 값
  onTitleChange = () => {} // 제목 변경 핸들러
}) => {
  if (!isOpen) return null;

  return (
    <ModalOverlay>
      <ModalContainer>
        <ModalHeader>
          <ModalTitle src={title} alt="키보드 커스텀" />
          <CloseButton onClick={onClose}>
            <FiX />
          </CloseButton>
        </ModalHeader>
        <ModalContent>
          <ModelImageContainer>
            <ModelImage src={imageSrc} alt="미리보기 이미지" />
          </ModelImageContainer>
          <MessageText>{message}</MessageText>
          
          {/* 제목 입력 필드 - showTitleInput이 true일 때만 표시 */}
          {showTitleInput && (
            <TitleInputContainer>
              <TitleLabel>디자인 제목</TitleLabel>
              <TitleInput
                type="text"
                value={titleValue}
                onChange={onTitleChange}
                placeholder="디자인 제목을 입력해주세요"
                required
                autoFocus
              />
            </TitleInputContainer>
          )}
        </ModalContent>
        <ButtonContainer>
          <ButtonHalf className="cancel" onClick={onClose}>
            {cancelText}
          </ButtonHalf>
          <ButtonHalf className="confirm" onClick={onConfirm}>
            {confirmText}
          </ButtonHalf>
        </ButtonContainer>
      </ModalContainer>
    </ModalOverlay>
  );
};