import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FiRefreshCw, FiShare2, FiSave, FiX } from "react-icons/fi";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { ThreeDModel } from "../../components/model/ThreeDModel";
import { useAuthStore } from "../../api/useAuthStore";
import { saveItem } from "../../api/saveItem";
import { KeyboardModal } from "../../components/modal/KeyboardModal";
import { HexColorPicker } from "react-colorful";

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
  height: auto;
  background: white;
  display: flex;
  flex-direction: column;
  border: solid 1px #e6e5e1;
  z-index: 10;
  padding-bottom: 10px;
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

const ColorPickerContainer = styled.div`
  padding: 0 10px;
  margin-top: 10px;
  display: ${(props) => (props.show ? "block" : "none")};
`;

const ColorPreview = styled.div`
  display: flex;
  align-items: center;
  padding: 5px 10px;
  margin-top: 5px;
`;

const ColorSwatch = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  margin-right: 8px;
  background-color: ${(props) => props.color};
  border: 1px solid #ddd;
`;

const ColorLabel = styled.span`
  font-size: 14px;
  color: #666;
`;

export const CustomPage = () => {
  const { size } = useParams();
  const { user } = useAuthStore();
  const modelRef = useRef();
  const selectedSize = size ? `${size}%` : "Custom Keyboard";

  const [selectedModel, setSelectedModel] = useState("barebone");
  const [prevSelectedModel, setPrevSelectedModel] = useState(null);
  
  // 모달 상태 관리
  const [restartModalOpen, setRestartModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);
  const [modelImage, setModelImage] = useState("");
  
  // 색상 상태 추가
  const [baseColor, setBaseColor] = useState("#ffffff");
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleModelSelect = (modelType) => {
    setPrevSelectedModel(selectedModel);
    setSelectedModel(modelType);
    
    // 베어본 선택 시 색상 선택기 표시
    if (modelType === "barebone") {
      setShowColorPicker(true);
    } else {
      setShowColorPicker(false);
    }
  };

  // 다시 시작하기 버튼 처리
  const handleRestart = () => {
    if (modelRef.current && modelRef.current.getScreenshot) {
      setModelImage(modelRef.current.getScreenshot());
    } else {
      setModelImage("/images/default-model.png");
    }
    setRestartModalOpen(true);
  };

  // 다시 시작하기 확인 처리
  const handleConfirmRestart = () => {
    setRestartModalOpen(false);
    // 색상 초기화 추가
    setBaseColor("#ffffff");
    window.location.reload();
  };

  const handleSaveClick = async () => {
    if (!user?.email) {
      alert("로그인이 필요합니다.");
      return;
    }
  
    let screenshotImage = "";
    if (modelRef.current && modelRef.current.getScreenshot) {
      screenshotImage = modelRef.current.getScreenshot();
      setModelImage(screenshotImage);
      console.log("스크린샷 이미지 Base64:", screenshotImage); // ← 이 부분 추가
    } else {
      alert("이미지 생성에 실패했습니다. 다시 시도해주세요.");
      return;
    }
  
    setSaveModalOpen(true);
  };
  
  const handleConfirmSave = async () => {
    setSaveModalOpen(false);
  
    // FormData 객체 생성
    const formData = new FormData();
    
    // JSON 데이터 생성
    const jsonData = {
      email: user.email,
      barebonecolor: baseColor,
      keyboardtype: size,
      keycapcolor: "test",
      design: "test",
      switchcolor: "test"
    };
    
    // FormData에 JSON 추가
    formData.append('DTO', new Blob([JSON.stringify(jsonData)], {
      type: 'application/json'
    }));
    
    // Base64 이미지를 파일로 변환
    if (modelImage) {
      // Base64 데이터에서 실제 바이너리 데이터 추출 (data:image/png;base64, 부분 제거)
      const imageData = modelImage.split(',')[1];
      const byteCharacters = atob(imageData);
      const byteArrays = [];
      
      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }
      
      const byteArray = new Uint8Array(byteArrays);
      const blob = new Blob([byteArray], { type: 'image/png' });
      
      // 파일 이름 생성 (현재 시간 기준)
      const fileName = `keyboard_${new Date().getTime()}.png`;
      const file = new File([blob], fileName, { type: 'image/png' });
      
      // FormData에 파일 추가
      formData.append('file', file);
    }
  
    try {
      // saveItem 함수 수정 필요 - FormData를 전송할 수 있도록
      const result = await saveItem(formData);
  
      if (result.success) {
        alert("저장이 완료되었습니다.");
      } else {
        console.error("저장 실패:", result.error);
        alert(`저장 중 오류가 발생했습니다: ${result.message}`);
      }
    } catch (error) {
      console.error("저장 중 예외 발생:", error);
      alert("저장 중 오류가 발생했습니다.");
    }
  };
  

  useEffect(() => {
    if (selectedModel) {
      console.log(`선택된 모델: ${selectedModel}, 사이즈: ${size}`);
    }
  }, [selectedModel, size]);

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
          <SaveButton onClick={handleSaveClick}>
            <FiSave />
            저장하기
          </SaveButton>
        </RightSection>
      </HeaderFrame>

      <CustomFrame>
        <SelectFrame>
          <SelectOption 
            selected={selectedModel === "barebone"}
            onClick={() => handleModelSelect("barebone")}
          >
            베어본
          </SelectOption>
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
          
          {/* 색상 피커 컴포넌트 추가 */}
          <ColorPickerContainer show={showColorPicker}>
            <HexColorPicker color={baseColor} onChange={setBaseColor} />
            <ColorPreview>
              <ColorSwatch color={baseColor} />
              <ColorLabel>베어본 색상: {baseColor}</ColorLabel>
            </ColorPreview>
          </ColorPickerContainer>
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
          selectedModel={selectedModel === "barebone" ? null : selectedModel}
          prevSelectedModel={prevSelectedModel}
          baseColor={baseColor} // 색상 전달
        />
      </CustomFrame>

      {/* 다시 시작하기 모달 */}
      <KeyboardModal
        isOpen={restartModalOpen}
        onClose={() => setRestartModalOpen(false)}
        onConfirm={handleConfirmRestart}
        imageSrc={modelImage}
        message="작업하신 디자인을 지우고 다시 시작하시겠습니까? 디자인을 저장하시면 나중에 이어서 디자인할 수 있습니다."
        confirmText="다시 시작하기"
        cancelText="취소"
      />

      {/* 저장하기 모달 */}
      <KeyboardModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onConfirm={handleConfirmSave}
        imageSrc={modelImage}
        message="현재 디자인을 저장하시겠습니까?"
        confirmText="저장하기"
        cancelText="취소"
      />
    </Container>
  );
};