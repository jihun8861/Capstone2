import styled from "styled-components";
import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { FiRefreshCw, FiThumbsUp, FiSave } from "react-icons/fi";
import { ThreeDModel } from "../../components/model/ThreeDModel";
import { ColorSelect } from "../../color/ColorSelect";
import { KeycapArray } from "./KeycapArray";
import { useAuthStore } from "../../api/useAuthStore";
import { saveItem } from "../../api/saveItem";
import { SwitchData } from "../../data/SwitchData";
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
`;

const ThreeDContainer = styled.div`
  display: flex;
  width: ${(props) => (props.showDescription ? "68%" : "85%")};
  height: 100%;
  position: relative;
  overflow: hidden;
  justify-content: center;
  align-items: center;
  transition: width 0.3s ease;
`;

const DescriptionContainer = styled.div`
  display: ${(props) => (props.show ? "flex" : "none")};
  width: ${(props) => (props.show ? "17%" : "0")};
  height: 100%;
  padding: ${(props) => (props.show ? "20px" : "0")};
  background-color: white;
  border-left: ${(props) => (props.show ? "solid 1px #ddd" : "none")};
  transition: all 0.3s ease;
  overflow-y: auto;
  flex-direction: column;

  h3 {
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 15px;
    color: #333;
  }

  h4 {
    font-size: 16px;
    font-weight: bold;
    margin: 15px 0 10px 0;
    color: #444;
  }

  p {
    font-size: 14px;
    line-height: 1.5;
    color: #666;
    margin-bottom: 10px;
  }
`;

const CustomFrame = styled.div`
  position: relative;
  width: 100%;
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => (props.isDarkMode ? "#121212" : "#e9ecef")};
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
  width: 80px;
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
  background-color: ${(props) => (props.active ? "#00ffff" : "#333")};
  color: ${(props) => (props.active ? "#000" : "#fff")};
  border: none;
  border-radius: 5px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: ${(props) => (props.active ? "0 0 15px #00ffff" : "none")};
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background-color: ${(props) => (props.active ? "#66ffff" : "#444")};
  }
`;

// LED 아이콘 컴포넌트
const LedIcon = styled.div`
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${(props) => (props.active ? "#00ffff" : "#666")};
  box-shadow: ${(props) => (props.active ? "0 0 10px #00ffff" : "none")};
  margin-right: 8px;
`;

// 스위치 설명 관련 스타일 컴포넌트 추가
const SwitchInfo = styled.div`
  margin-bottom: 30px;
  padding: 15px;
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  background-color: #f9f9f9;
`;

const SwitchHeader = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 10px;
`;

const SwitchColorBox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  margin-right: 10px;
  border: 1px solid #ddd;
  background-color: ${(props) => props.color};
`;

const SwitchName = styled.h4`
  margin: 0;
  font-size: 16px;
  font-weight: bold;
  color: #333;
`;

const SwitchDescription = styled.p`
  margin: 5px 0;
  font-size: 13px;
  line-height: 1.4;
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

  // 추천 설명 표시 상태 추가
  const [showDescription, setShowDescription] = useState(false);

  // LED 토글 핸들러 추가
  const handleLedToggle = () => {
    setLedEnabled((prev) => !prev);

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
      setShowDescription(false); // 베어본 선택 시 설명 숨김
    } else if (modelType === "keycap") {
      setShowColorPicker(false);
      setShowKeycapArray(true);
      setShowDescription(false); // 키캡 선택 시 설명 숨김
    } else if (modelType === "switch") {
      setShowColorPicker(false);
      setShowKeycapArray(false);
      setShowDescription(true); // 스위치 선택 시 설명 표시
      // 추천 결과 초기화 (스위치 설명을 보여주기 위해)
      setRecommendationResult(null);
    } else {
      setShowColorPicker(false);
      setShowKeycapArray(false);
      setShowDescription(false);
    }
  };

  const handleSwitchColorSelect = (color) => {
    setSwitchColor(color);
  };

  const handleKeycapColorChange = (keycapId, color, allColors) => {
    setKeycapColors(allColors || { ...keycapColors, [keycapId]: color });

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

  const handleConfirmRestart = () => {
    setRestartModalOpen(false);
    window.location.reload();
  };

  const getSwitchColorFromName = (switchName) => {
    const switchColorMap = {
      청축: "#0066cc",
      적축: "#cc0000",
      갈축: "#8b4513",
      흑축: "#000000",
      백축: "#ffffff",
    };

    for (const [axisName, color] of Object.entries(switchColorMap)) {
      if (switchName && switchName.includes(axisName)) {
        return color;
      }
    }

    return switchName;
  };

  const handleRecommendation = async () => {
    try {
      setIsLoading(true);

      const cleanKeycapColors = {};

      const result = await fetchKeyboardRecommendation({
        size,
        baseColor,
        switchColor,
        keycapColors: cleanKeycapColors, // 빈 객체로 요청
      });

      if (result.status === "OK") {
        setRecommendationResult(result);
        setShowDescription(true);

        const recommendedKeyboard = result.data.keyboards[0];

        if (recommendedKeyboard) {

          if (recommendedKeyboard.barebone) {
            setBaseColor(recommendedKeyboard.barebone);

            if (modelRef.current && modelRef.current.updateBaseColor) {
              modelRef.current.updateBaseColor(recommendedKeyboard.barebone);
            }
          }

          if (recommendedKeyboard.switch) {
            const switchColorValue = getSwitchColorFromName(
              recommendedKeyboard.switch
            );
            setSwitchColor(switchColorValue);

            if (modelRef.current && modelRef.current.updateSwitchColor) {
              modelRef.current.updateSwitchColor(switchColorValue);
            }
          }

          if (recommendedKeyboard.keycap) {
            const keycapIds = KEYCAP_IDS[size] || [];
            const newKeycapColors = {};
            keycapIds.forEach((id) => {
              newKeycapColors[id] = recommendedKeyboard.keycap;
            });

            setKeycapColors(newKeycapColors);
            setSelectedModel("keycap");
            setShowKeycapArray(true);
            setShowColorPicker(false);

            setTimeout(() => {
              if (modelRef.current) {
                if (modelRef.current.updateAllKeycapColors) {
                  modelRef.current.updateAllKeycapColors(newKeycapColors);
                } else if (modelRef.current.updateKeycapColor) {
                  keycapIds.forEach((id) => {
                    modelRef.current.updateKeycapColor(
                      id,
                      recommendedKeyboard.keycap
                    );
                  });
                }
              }
            }, 300); // 짧은 딜레이로 적용
          }

          alert("AI가 새로운 색상을 추천했습니다!");
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

    setDesignTitle("");
    setSaveModalOpen(true);
  };

  const handleTitleChange = (e) => {
    setDesignTitle(e.target.value);
  };

  const handleConfirmSave = async () => {
    if (!designTitle.trim()) {
      alert("제목을 입력해주세요.");
      return;
    }

    setSaveModalOpen(false);

    const formData = new FormData();
    const filteredKeycapColors = {};
    Object.keys(keycapColors).forEach((key) => {
      // 기본 색상(#ffffff)이 아닌 경우만 포함
      if (keycapColors[key] && keycapColors[key] !== "#ffffff") {
        filteredKeycapColors[key] = keycapColors[key];
      }
    });

    const jsonData = {
      email: user.email,
      title: designTitle,
      barebonecolor: baseColor,
      keyboardtype: size,
      keycapcolor: filteredKeycapColors, // keycapcolors에서 keycapcolor로 변경
      switchcolor: switchColor,
    };

    formData.append(
      "DTO",
      new Blob([JSON.stringify(jsonData)], {
        type: "application/json",
      })
    );

    if (modelImage) {
      const imageData = modelImage.split(",")[1];
      const byteCharacters = atob(imageData);
      const byteArrays = [];

      for (let i = 0; i < byteCharacters.length; i++) {
        byteArrays.push(byteCharacters.charCodeAt(i));
      }

      const byteArray = new Uint8Array(byteArrays);
      const blob = new Blob([byteArray], { type: "image/png" });
      const fileName = `keyboard_${new Date().getTime()}.png`;
      const file = new File([blob], fileName, { type: "image/png" });
      formData.append("file", file);
    }

    try {
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

  useEffect(() => {
    setBaseColor("#ffffff");
    setSwitchColor("#ffffff");
    setKeycapColors({});
  }, []);

  const Test = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    width: 400px;
    height: 90%;
    background-color: #e9ecef;
    top: 0;
    right: 0;
  `;

  const renderSwitchDescription = () => {
    return (
      <Test>
        {SwitchData.map((switchInfo, index) => (
          <SwitchInfo key={index}>
            <SwitchHeader>
              <SwitchColorBox color={switchInfo.color} />
              <SwitchName>{switchInfo.name}</SwitchName>
            </SwitchHeader>
            <SwitchDescription>{switchInfo.description}</SwitchDescription>
          </SwitchInfo>
        ))}
      </Test>
    );
  };

  // 추천 결과에서 설명 텍스트 렌더링 함수
  const renderDescription = () => {
    // 스위치 모델이 선택되고 추천 결과가 없는 경우 스위치 설명 표시
    if (selectedModel === "switch" && !recommendationResult) {
      return renderSwitchDescription();
    }

    // 추천 결과가 있는 경우 추천 결과 표시
    if (!recommendationResult) {
      return null;
    }

    // 추천된 키보드 정보 가져오기
    const keyboards = recommendationResult.data?.keyboards || [];
    const descriptions = recommendationResult.data?.description || [];

    return (
      <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
        {keyboards.length > 0 && (
          <div>
            <h3
              style={{
                marginBottom: "15px",
                borderBottom: "2px solid #ccc",
                paddingBottom: "5px",
              }}
            >
              🎨 추천 색상 조합
            </h3>
            {keyboards.map((keyboard, index) => (
              <div
                key={index}
                style={{
                  border: "1px solid #e0e0e0",
                  borderRadius: "10px",
                  padding: "15px",
                  marginBottom: "20px",
                  boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
                  backgroundColor: "#fafafa",
                }}
              >

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: keyboard.barebone,
                      marginRight: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  ></div>
                  <span>베어본: {keyboard.barebone}</span>
                </div>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginBottom: "8px",
                  }}
                >
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: keyboard.keycap,
                      marginRight: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  ></div>
                  <span>키캡: {keyboard.keycap}</span>
                </div>

                <div style={{ display: "flex", alignItems: "center" }}>
                  <div
                    style={{
                      width: "24px",
                      height: "24px",
                      backgroundColor: getSwitchColorFromName(keyboard.switch),
                      marginRight: "12px",
                      border: "1px solid #ccc",
                      borderRadius: "4px",
                    }}
                  ></div>
                  <span>스위치: {keyboard.switch}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {descriptions.length > 0 && (
          <div style={{ marginTop: "40px" }}>
            <h3
              style={{
                marginBottom: "15px",
                borderBottom: "2px solid #ccc",
                paddingBottom: "5px",
              }}
            >
              📝 키보드 설명
            </h3>
            {descriptions.map((desc, index) => (
              <h4
                key={index}
                style={{
                  fontWeight: "normal",
                  backgroundColor: "#f9f9f9",
                  padding: "10px 15px",
                  borderRadius: "8px",
                  marginBottom: "10px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                }}
              >
                {desc}
              </h4>
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
            <FiThumbsUp />
            {isLoading ? "추천 중..." : "추천받기"}
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

        <ThreeDContainer showDescription={showDescription}>
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
          <LedButton onClick={handleLedToggle} active={ledEnabled}>
            <LedIcon active={ledEnabled} />
            LED {ledEnabled ? "OFF" : "ON"}
          </LedButton>
        </LedButtonContainer>

        <DescriptionContainer show={showDescription}>
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