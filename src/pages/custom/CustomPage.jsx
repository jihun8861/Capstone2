import styled from "styled-components";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import colors from "../../color/colors";
import { ColorSelect } from "../../color/ColorSelect";
import { ThreeDModel } from "../../components/model/ThreeDModel";
import { useAuthStore } from "../../api/useAuthStore";
import { saveItem } from "../../api/saveItem";

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
  gap: 10px;
`;

const Button = styled.button`
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:hover {
    background-color: ${colors.babyblue};
    color: white;
    transform: scale(1.05);
  }
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
  top: 50%;
  left: 30px;
  transform: translateY(-80%);
  width: 280px;
  height: 380px;
  background: white;
  display: flex;
  flex-direction: column;
  border: solid 1px #e6e5e1;
  z-index: 10;
`;

const SelectOption = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: ${(props) => (props.selected ? "#007bff" : "#333")};
  cursor: pointer;
  padding: 10px;
  border-radius: 8px;
  transition: all 0.2s ease;
  border: solid 1px;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export const CustomPage = () => {
  const { size } = useParams();
  const selectedSize = size ? `${size}%` : "Custom Keyboard";
  const { user } = useAuthStore();

  const [selectedModel, setSelectedModel] = useState(null);
  const [prevSelectedModel, setPrevSelectedModel] = useState(null);

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
          <Button>다시 시작하기</Button>
          <Button>공유하기</Button>
          <Button onClick={handleSave}>저장하기</Button>
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

        <ThreeDModel
          size={size}
          selectedModel={selectedModel}
          prevSelectedModel={prevSelectedModel}
        />
      </CustomFrame>

      <ColorSelect />
    </Container>
  );
};