import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FiRefreshCw, FiShare2, FiSave } from "react-icons/fi";
import { ThreeDModel } from "../../components/model/ThreeDModel";
import { ColorSelect } from "../../color/ColorSelect";
import { KeycapArray } from "./KeycapArray";
import { useAuthStore } from "../../api/useAuthStore";
import { saveItem } from "../../api/saveItem";
import { KeyboardModal } from "../../components/modal/KeyboardModal";
import { fetchKeyboardRecommendation } from "../../api/recommendation";
import { KEYCAP_IDS } from "../../data/KeycapID";
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

const SelectContainer = styled.div`
  display: flex;
  width: 15%;
  height: 100%;
  margin-left: 30px;
  border: solid 1px;
`;

const ThreeDContainer = styled.div`
  display: flex;
  width: 68%;
  height: 100%;
  position: relative;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  border: solid 1px;
`;

const DescriptionContainer = styled.div`
  display: flex;
  width: 17%;
  height: 100%;
  border: solid 1px;
`

const CustomFrame = styled.div`
  position: relative;
  width: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${props => props.isDarkMode ? '#121212' : '#e9ecef'};
  transition: background-color 0.5s ease;
`;

const SelectFrame = styled.div`
  position: absolute;
  top: 35%;
  transform: translateY(-50%);
  width: 280px;
  height: 300px;
  background: white;
  display: flex;
  justify-content: center;
  flex-direction: column;
  border: solid 1px #e6e5e1;
  z-index: 10;
  padding: 10px;
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
  position: absolute;
  top: 320px;
  padding: 0 30px;
  display: ${(props) => (props.show ? "block" : "none")};
`;

// ColorPreview 부분을 수정하여 입력 필드 추가
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
  margin-right: 8px;
`;

const ColorInput = styled.input`
  width: 80px;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
`;

// LED 버튼을 SelectFrame 외부에 배치하기 위한 컨테이너
const LedButtonContainer = styled.div`
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 20;
`;

const LedButton = styled.button`
  padding: 12px 20px;
  background-color: ${props => props.active ? '#00ffff' : '#333'};
  color: ${props => props.active ? '#000' : '#fff'};
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${props => props.active ? '0 0 15px #00ffff' : 'none'};
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background-color: ${props => props.active ? '#66ffff' : '#444'};
  }
`;

// LED 아이콘 컴포넌트
const LedIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${props => props.active ? '#00ffff' : '#666'};
  box-shadow: ${props => props.active ? '0 0 10px #00ffff' : 'none'};
  margin-right: 8px;
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
  
  // 제목 상태 추가
  const [designTitle, setDesignTitle] = useState("");

  // 색상 상태 추가
  const [baseColor, setBaseColor] = useState("#ffffff");
  const [switchColor, setSwitchColor] = useState("#ffffff");
  const [showColorPicker, setShowColorPicker] = useState(false);
  
  // 키캡 배열 컴포넌트 표시 상태
  const [showKeycapArray, setShowKeycapArray] = useState(false);
  
  // 키캡 색상 상태 관리 - 키 ID를 색상에 매핑
  const [keycapColors, setKeycapColors] = useState({});

  // LED 상태 관리
  const [ledEnabled, setLedEnabled] = useState(false);
  
  // AI 추천 로딩 상태 추가
  const [isLoading, setIsLoading] = useState(false);
  
  // AI 추천 결과 및 설명 상태 추가
  const [recommendationResult, setRecommendationResult] = useState(null);

  // LED 토글 핸들러 추가
  const handleLedToggle = () => {
    setLedEnabled(prev => !prev);
    
    // ThreeDModel의 LED 상태 토글
    if (modelRef.current && modelRef.current.toggleLed) {
      modelRef.current.toggleLed();
    }
  };

  const handleModelSelect = (modelType) => {
    setPrevSelectedModel(selectedModel);
    setSelectedModel(modelType);

    // 베어본 선택 시 색상 선택기 표시
    if (modelType === "barebone") {
      setShowColorPicker(true);
      setShowKeycapArray(false);
    } else if (modelType === "keycap") {
      setShowColorPicker(false);
      setShowKeycapArray(true);
    } else {
      setShowColorPicker(false);
      setShowKeycapArray(false);
    }
  };

  // 스위치 색상 선택 핸들러
  const handleSwitchColorSelect = (color) => {
    setSwitchColor(color);
  };
  
  // 키캡 색상 변경 핸들러
  const handleKeycapColorChange = (keycapId, color, allColors) => {
    // 전체 키캡 색상 상태 업데이트
    setKeycapColors(allColors || { ...keycapColors, [keycapId]: color });
    
    // 3D 모델에 키캡 색상 변경 적용 (필요한 경우)
    if (modelRef.current && modelRef.current.updateKeycapColor) {
      modelRef.current.updateKeycapColor(keycapId, color);
    }
  };

  const handleRestart = () => {
    if (modelRef.current && modelRef.current.getScreenshot) {
      setModelImage(modelRef.current.getScreenshot());
    } else {
      setModelImage("/images/default-model.png");
    }
    setRestartModalOpen(true);
  };

  // 다시 시작하기 확인 처리 - 완전히 초기화하고 모델 리렌더링
  const handleConfirmRestart = () => {
    setRestartModalOpen(false);
    
    // 페이지 새로고침 실행
    window.location.reload();
  };

 const handleRecommendation = async () => {
  try {
    setIsLoading(true);

    const result = await fetchKeyboardRecommendation({
      size,
      baseColor,
      switchColor,
      keycapColors,
    });

    if (result.status === "OK") {
      // 전체 응답 결과를 저장
      setRecommendationResult(result);
      
      const recommendedKeyboard = result.data.keyboards[0];

      if (recommendedKeyboard) {
        // 베어본 색상 업데이트
        if (recommendedKeyboard.barebone) {
          setBaseColor(recommendedKeyboard.barebone);
        }

        // 스위치 색상 업데이트 및 스위치 모델 표시 설정
        if (recommendedKeyboard.switch) {
          setSwitchColor(recommendedKeyboard.switch);
          // 스위치 모델 표시 설정
          setSelectedModel("switch");
          setTimeout(() => {
            // 키캡 모델 표시 설정 (스위치 표시 후 키캡 표시)
            setSelectedModel("keycap");
          }, 1000); // 1초 후에 키캡 표시
        }

        // 키캡 색상 업데이트
        if (recommendedKeyboard.keycap) {
          // 모든 키캡에 동일한 색상 적용
          const keycapIds = Object.keys(keycapColors).length > 0 
            ? Object.keys(keycapColors) 
            : (KEYCAP_IDS[size] || []);
            
          const newKeycapColors = {};
          keycapIds.forEach(id => {
            newKeycapColors[id] = recommendedKeyboard.keycap;
          });
          
          // 키캡 색상 상태 업데이트
          setKeycapColors(newKeycapColors);
          
          // 3D 모델에 키캡 색상 직접 업데이트
          if (modelRef.current && modelRef.current.updateKeycapColor) {
            keycapIds.forEach(id => {
              modelRef.current.updateKeycapColor(id, recommendedKeyboard.keycap);
            });
          }
        }

        alert(result.message || "AI가 새로운 색상을 추천했습니다!");
      }
    } else {
      alert("추천 색상을 가져오는 데 실패했습니다.");
    }
  } catch (error) {
    console.error(error);
    alert(error.message);
  } finally {
    setIsLoading(false);
  }
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
      console.log("스크린샷 이미지 Base64:", screenshotImage);
    } else {
      alert("이미지 생성에 실패했습니다. 다시 시도해주세요.");
      return;
    }

    // 모달 열기 전에 제목 초기화 (이전에 입력한 값이 남아있지 않도록)
    setDesignTitle("");
    setSaveModalOpen(true);
  };

  // 제목 변경 핸들러
  const handleTitleChange = (e) => {
    setDesignTitle(e.target.value);
  };

  const handleConfirmSave = async () => {
    // 제목이 비어있는지 확인
    if (!designTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }
    
    setSaveModalOpen(false);

    // FormData 객체 생성
    const formData = new FormData();

    // JSON 데이터 생성 - 제목과 스위치 색상 정보 추가
    const jsonData = {
      email: user.email,
      title: designTitle, // 제목 정보 추가
      barebonecolor: baseColor,
      keyboardtype: size,
      keycapcolors: keycapColors, // 키캡 색상 정보를 객체로 저장
      switchcolor: switchColor, // 스위치 색상 정보 업데이트
      ledEnabled: ledEnabled, // LED 상태 추가
    };

    // FormData에 JSON 추가
    formData.append(
      "DTO",
      new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
      })
    );

    // Base64 이미지를 파일로 변환
    if (modelImage) {
      // Base64 데이터에서 실제 바이너리 데이터 추출 (data:image/png;base64, 부분 제거)
      const imageData = modelImage.split(",")[1];
      const byteCharacters = atob(imageData);
      const byteArrays = [];

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }

      const byteArray = new Uint8Array(byteArrays);
      const blob = new Blob([byteArray], { type: "image/png" });

      // 파일 이름 생성 (현재 시간 기준)
      const fileName = `keyboard_${new Date().getTime()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });

      // FormData에 파일 추가
      formData.append("file", file);
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
  
  // 컴포넌트 마운트 시점에 초기화 실행 (필요한 경우)
  useEffect(() => {
    // 최초 마운트 시 모든 상태 초기화
    setBaseColor("#ffffff");
    setSwitchColor("#ffffff");
    setKeycapColors({});
  }, []);

  // 추천 결과에서 설명 텍스트 렌더링 함수
  const renderDescription = () => {
    if (!recommendationResult) {
      return <p>키보드를 커스터마이징하고 "추천받기" 버튼을 클릭하면 AI가 추천하는 색상 조합을 볼 수 있습니다.</p>;
    }

    // 추천된 키보드 정보 가져오기
    const keyboards = recommendationResult.data?.keyboards || [];
    const descriptions = recommendationResult.data?.description || [];

    return (
      <div>
        <h3>AI 추천 결과</h3>
        <p>{recommendationResult.message}</p>
        
        {keyboards.length > 0 && (
          <div>
            <h4>추천 색상 조합</h4>
            {keyboards.map((keyboard, index) => (
              <div key={index} style={{ marginBottom: '15px' }}>
                <p><strong>조합 {index + 1}</strong></p>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: keyboard.barebone, 
                    marginRight: '10px',
                    border: '1px solid #ddd'
                  }}></div>
                  <span>베어본: {keyboard.barebone}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: keyboard.keycap, 
                    marginRight: '10px',
                    border: '1px solid #ddd'
                  }}></div>
                  <span>키캡: {keyboard.keycap}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    backgroundColor: keyboard.switch, 
                    marginRight: '10px',
                    border: '1px solid #ddd'
                  }}></div>
                  <span>스위치: {keyboard.switch}</span>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {descriptions.length > 0 && (
          <div>
            <h4>키보드 설명</h4>
            {descriptions.map((desc, index) => (
              <p key={index}>{desc}</p>
            ))}
          </div>
        )}
      </div>
    );
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
          <IconButton onClick={handleRecommendation} disabled={isLoading}>
            <FiShare2 />
            {isLoading ? '추천 중...' : '추천받기'}
          </IconButton>
          <SaveButton onClick={handleSaveClick}>
            <FiSave />
            저장하기
          </SaveButton>
        </RightSection>
      </HeaderFrame>

      <CustomFrame isDarkMode={ledEnabled}>
        <SelectContainer>
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

            {/* 베어본 선택 시에만 표시되는 색상 선택기 */}
            <ColorPickerContainer show={showColorPicker}>
              <HexColorPicker color={baseColor} onChange={setBaseColor} />
              <ColorPreview>
                <ColorSwatch color={baseColor} />
                <ColorLabel>베어본 색상:</ColorLabel>
                <ColorInput
                  value={baseColor}
                  onChange={(e) => {
                    const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
                    if (hexRegex.test(e.target.value)) {
                      setBaseColor(e.target.value);
                    } else if (
                      e.target.value.startsWith("#") &&
                      e.target.value.length <= 7
                    ) {
                      setBaseColor(e.target.value);
                    }
                  }}
                  onBlur={(e) => {
                    const hexRegex = /^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/;
                    if (!hexRegex.test(e.target.value)) {
                      setBaseColor(baseColor);
                    }
                  }}
                />
              </ColorPreview>
            </ColorPickerContainer>
          </SelectFrame>
        </SelectContainer>

        <ThreeDContainer>
          <ThreeDModel
            ref={modelRef}
            size={size}
            selectedModel={selectedModel === "barebone" ? null : selectedModel}
            prevSelectedModel={prevSelectedModel}
            baseColor={baseColor}
            switchColor={switchColor}
            keycapColors={keycapColors} // 키캡 색상 정보 전달
            ledEnabled={ledEnabled} // LED 상태 전달
          />
        </ThreeDContainer>

        {/* LED 버튼을 밖으로 이동 */}
        <LedButtonContainer>
          <LedButton 
            onClick={handleLedToggle}
            active={ledEnabled}
          >
            <LedIcon active={ledEnabled} />
            LED {ledEnabled ? "OFF" : "ON"}
          </LedButton>
        </LedButtonContainer>

        <DescriptionContainer>
          {renderDescription()}
        </DescriptionContainer>
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

      {/* 저장하기 모달 - 제목 입력 필드 추가 */}
      <KeyboardModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        onConfirm={handleConfirmSave}
        imageSrc={modelImage}
        message="현재 디자인을 저장하시겠습니까?"
        confirmText="저장하기"
        cancelText="취소"
        showTitleInput={true} // 제목 입력 필드 표시
        titleValue={designTitle} // 제목 값
        onTitleChange={handleTitleChange} // 제목 변경 핸들러
      />

      {/* 스위치 선택 시에만 ColorSelect 컴포넌트 표시 */}
      {selectedModel === "switch" && (
        <ColorSelect onColorSelect={handleSwitchColorSelect} />
      )}

      {/* 키캡 선택 시에만 KeycapArray 컴포넌트 표시 */}
      {showKeycapArray && (
        <KeycapArray           
          size={size || "60"} 
          onClose={() => setShowKeycapArray(false)}
          onKeycapColorChange={handleKeycapColorChange}
          initialColors={keycapColors}
        />
      )}
    </Container>
  );
};