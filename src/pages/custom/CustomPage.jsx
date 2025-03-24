import styled from "styled-components";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import colors from "../../color/colors";
import { ColorSelect } from "../../color/ColorSelect";
import { ThreeDModel } from "../../components/model/ThreeDModel";

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
  left: 5%;
  transform: translateY(-50%);
  width: 280px;
  height: 340px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: none;
  z-index: 10;
`;

const SelectOption = styled.p`
  font-size: 24px;
  font-weight: bold;
  color: ${props => props.selected ? "#007bff" : "#333"};
  cursor: pointer;
  margin: 15px 0;
  padding: 10px 20px;
  border-radius: 8px;
  transition: all 0.2s ease;
  width: 80%;
  text-align: center;

  &:hover {
    background-color: #f0f0f0;
  }
`;

export const CustomPage = () => {
  const { size } = useParams();
  const selectedSize = size ? `${size}%` : "Custom Keyboard";
  
  const [selectedModel, setSelectedModel] = useState(null);
  const [prevSelectedModel, setPrevSelectedModel] = useState(null);

  // 모델 선택 핸들러 - 같은 모델을 다시 클릭했을 때 처리
  const handleModelSelect = (modelType) => {
    // 이전 선택 상태 저장
    setPrevSelectedModel(selectedModel);
    
    // 같은 모델을 다시 클릭한 경우, 애니메이션을 다시 시작하기 위해 null로 설정 후 다시 설정
    if (selectedModel === modelType) {
      setSelectedModel(null);
      setTimeout(() => {
        setSelectedModel(modelType);
      }, 10);
    } else {
      setSelectedModel(modelType);
    }
  };

  // ThreeDModel 컴포넌트에 전달할 속성 확인
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
          <Button>다시 시작하기</Button>
          <Button>공유하기</Button>
          <Button>저장하기</Button>
        </RightSection>
      </HeaderFrame>

      <CustomFrame>
        <SelectFrame>
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

        <ThreeDModel size={size} selectedModel={selectedModel} prevSelectedModel={prevSelectedModel} />
      </CustomFrame>

      <ColorSelect />
    </Container>
  );
};