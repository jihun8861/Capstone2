import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FiRefreshCw, FiShare2, FiSave, FiX } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ThreeDModel } from "../../components/model/ThreeDModel";
import { useAuthStore } from "../../api/useAuthStore";
import { saveItem } from "../../api/saveItem";
import { RestartModal } from "../../components/modal/RestartModal";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 80px;
  height: 100vh;
  background-color: #f8f9fa;
`;

const HeaderLine = styled.div`
  width: 100%;
  height: 12px;
  background-color: black;
`;

const HeaderFrame = styled.div`
  width: 100%;
  height: 80px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  border-bottom: solid 1px #ddd;
  justify-content: space-between;
  background-color: white;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.05);
`;

const LeftSection = styled.div`
  display: flex;
  align-items: center;
`;

const CustomImage = styled.img`
  width: 130px;
  height: 32px;
  padding-right: 10px;
  border-right: solid 1px #e1e1e1;
`;

const Title = styled.p`
  font-size: 19px;
  margin-left: 10px;
  color: #333;
  font-weight: bold;
`;

const RightSection = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const CustomFrame = styled.div`
  position: relative;
  width: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #e9ecef;
`;

const SelectFrame = styled.div`
  position: absolute;
  top: 45%;
  left: 30px;
  transform: translateY(-80%);
  width: 280px;
  height: 280px;
  background: white;
  display: flex;
  flex-direction: column;
  border: solid 1px #e6e5e1;
  z-index: 10;
`;

const SelectOption = styled.p`
  font-size: 21px;
  font-weight: bold;
  color: ${(props) => (props.selected ? "#007bff" : "#333")};
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.2s ease;

  &:hover {
    background-color: #f0f0f0;
  }
`;

const IconButton = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: white;
  padding: 10px 16px;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  border: none;

  svg {
    font-size: 18px;
  }
`;

const PaginationFrame = styled.div`
  position: absolute;
  min-width: 280px;
  max-width: 400px;
  width: auto;
  left: 30px;
  bottom: 180px;
  background-color: transparent;
  border: 2px solid #e1e1e1;
  display: flex;
  z-index: 10;
`;

const PageInfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

const PageCount = styled.div`
  padding: 8px 12px 0;
  font-size: 16px;
  color: #777;
`;

const PageTitle = styled.div`
  padding: 0 12px 8px;
  font-size: 21px;
  font-weight: bold;
  color: #333;
  white-space: nowrap;
`;

const NavButtonContainer = styled.div`
  display: flex;
  border-left: 1px solid #e6e5e1;
  flex-shrink: 0;
`;

const NavButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 21px;
  width: 50px;
  flex-shrink: 0;

  &:first-child {
    border-right: 2px solid #e1e1e1;
  }
`;

const SaveButton = styled.button`
  background-color: #004aad;
  color: white;
  border: none;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 16px;
  font-weight: bold;
  padding: 12px 20px;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-color: #003580;
  }

  svg {
    font-size: 20px;
  }
`;

export const CustomPage = () => {
  const { size } = useParams();
  const { user } = useAuthStore();
  const modelRef = useRef();
  const selectedSize = size ? `${size}%` : "Custom Keyboard";

  const [selectedModel, setSelectedModel] = useState(null);
  const [prevSelectedModel, setPrevSelectedModel] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modelImage, setModelImage] = useState("");

  const handleModelSelect = (modelType) => {
    setPrevSelectedModel(selectedModel);

    if (selectedModel === modelType) {
      setSelectedModel(null);
      setTimeout(() => {
        setSelectedModel(modelType);
      }, 10);
    } else {
      setSelectedModel(modelType);
    }
  };

  const handleRestart = () => {
    if (modelRef.current && modelRef.current.getScreenshot) {
      setModelImage(modelRef.current.getScreenshot());
    } else {
      setModelImage("/images/default-model.png");
    }
    setShowModal(true);
  };

  const handleConfirmRestart = () => {
    setShowModal(false);
    window.location.reload();
  };

  useEffect(() => {
    if (selectedModel) {
      console.log(`선택된 모델: ${selectedModel}, 사이즈: ${size}`);
    }
  }, [selectedModel, size]);

  const handleSave = async () => {
    if (!user?.email) {
      alert("로그인이 필요합니다.");
      return;
    }

    const userData = {
      email: user.email,
      barebonecolor: "test",
      keyboardtype: size,
      keycapcolor: "test",
      design: "test",
      switchcolor: "test",
      imageurl: "test"
    };

    const result = await saveItem(userData);

    if (result.success) {
      console.log("저장 성공:", result.data);
      alert("저장이 완료되었습니다.");
    } else {
      console.error("저장 실패:", result.error);
      alert(`저장 중 오류가 발생했습니다: ${result.message}`);
    }
  };

  return (
    <Container>
      <HeaderLine />
      <HeaderFrame>
        <LeftSection>
          <CustomImage src="/images/custom.png" alt="Custom Keyboard" />
          <Title>{selectedSize}</Title>
        </LeftSection>

        <RightSection>
          <IconButton onClick={handleRestart}>
            <FiRefreshCw />
            다시 시작하기
          </IconButton>
          <IconButton>
            <FiShare2 />
            공유하기
          </IconButton>
          <SaveButton onClick={handleSave}>
            <FiSave />
            저장하기
          </SaveButton>
        </RightSection>
      </HeaderFrame>

      <CustomFrame>
        <SelectFrame>
          <SelectOption>베어본</SelectOption>
          <SelectOption
            selected={selectedModel === "switch"}
            onClick={() => handleModelSelect("switch")}
          >
            스위치
          </SelectOption>
          <SelectOption
            selected={selectedModel === "keycap"}
            onClick={() => handleModelSelect("keycap")}
          >
            키캡
          </SelectOption>
        </SelectFrame>

        <PaginationFrame>
          <PageInfoContainer>
            <PageCount>1/3</PageCount>
            <PageTitle>베어본 (BAREBONE)</PageTitle>
          </PageInfoContainer>
          <NavButtonContainer>
            <NavButton>
              <FiChevronLeft />
            </NavButton>
            <NavButton>
              <FiChevronRight />
            </NavButton>
          </NavButtonContainer>
        </PaginationFrame>

        <ThreeDModel
          ref={modelRef}
          size={size}
          selectedModel={selectedModel}
          prevSelectedModel={prevSelectedModel}
        />
      </CustomFrame>

      <RestartModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={handleConfirmRestart}
        imageSrc={modelImage}
        message="작업하신 디자인을 지우고 다시 시작하시겠습니까? 디자인을 저장하시면 나중에 이어서 디자인할 수 있습니다."
      />
    </Container>
  );
};